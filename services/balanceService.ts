import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { InvoiceType, UserBalance } from "../types";

export const balanceService = {
  async createInitialBalance(
    userId: string
  ): Promise<{ error: string | null }> {
    try {
      const balanceData = {
        user_id: userId,
        current_balance: 0,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      await addDoc(collection(db, "user_balances"), balanceData);

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getUserBalances(
    userId: string
  ): Promise<{ data: UserBalance[] | null; error: string | null }> {
    try {
      const q = query(
        collection(db, "user_balances"),
        where("user_id", "==", userId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const balances: UserBalance[] = [];

      querySnapshot.forEach((doc) => {
        balances.push({
          id: doc.id,
          ...doc.data(),
        } as UserBalance);
      });

      return { data: balances, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async addBalance(
    userId: string,
    balance: number
  ): Promise<{ error: string | null }> {
    try {
      await addDoc(collection(db, "user_balances"), {
        user_id: userId,
        current_balance: balance,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getCurrentBalance(
    userId: string
  ): Promise<{ data: number | null; error: string | null }> {
    try {
      const balances = await this.getUserBalances(userId);

      if (balances.error || !balances.data || balances.data.length === 0) {
        return { data: 0, error: null };
      }

      const currentBalance = balances.data[0].current_balance;
      return { data: currentBalance, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateBalanceWithTransaction(
    userId: string,
    amount: number,
    type: InvoiceType
  ): Promise<{ error: string | null }> {
    try {
      const currentBalanceResult = await this.getCurrentBalance(userId);
      if (currentBalanceResult.error) {
        throw new Error(currentBalanceResult.error);
      }

      const currentBalance = currentBalanceResult.data || 0;
      let newBalance = currentBalance;

      if (type === "deposito") {
        newBalance += amount;
      } else {
        newBalance -= amount;
      }

      return await this.addBalance(userId, newBalance);
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
