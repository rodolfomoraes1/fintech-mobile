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
      console.log("💰 Creating initial balance for user:", userId);

      const balanceData = {
        user_id: userId,
        current_balance: 0,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      console.log("💰 Balance data:", balanceData);

      await addDoc(collection(db, "user_balances"), balanceData);

      console.log("✅ Initial balance created successfully");
      return { error: null };
    } catch (error: any) {
      console.error("❌ Error creating initial balance:", error);
      return { error: error.message };
    }
  },

  // Buscar histórico de saldo do usuário
  async getUserBalances(
    userId: string
  ): Promise<{ data: UserBalance[] | null; error: string | null }> {
    try {
      console.log("💰 Fetching user balances for:", userId);

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

      console.log("✅ User balances fetched:", balances.length);
      return { data: balances, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching user balances:", error);
      return { data: null, error: error.message };
    }
  },

  // Adicionar novo registro de saldo
  async addBalance(
    userId: string,
    balance: number
  ): Promise<{ error: string | null }> {
    try {
      console.log(
        "💰 Adding new balance for user:",
        userId,
        "Balance:",
        balance
      );

      await addDoc(collection(db, "user_balances"), {
        user_id: userId,
        current_balance: balance,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      console.log("✅ New balance added successfully");
      return { error: null };
    } catch (error: any) {
      console.error("❌ Error adding new balance:", error);
      return { error: error.message };
    }
  },

  // Buscar saldo atual (último registro)
  async getCurrentBalance(
    userId: string
  ): Promise<{ data: number | null; error: string | null }> {
    try {
      console.log("💰 Fetching current balance for:", userId);

      const balances = await this.getUserBalances(userId);

      if (balances.error || !balances.data || balances.data.length === 0) {
        return { data: 0, error: null }; // Retorna 0 se não encontrar registros
      }

      const currentBalance = balances.data[0].current_balance;
      console.log("✅ Current balance:", currentBalance);
      return { data: currentBalance, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching current balance:", error);
      return { data: null, error: error.message };
    }
  },

  async updateBalanceWithTransaction(
    userId: string,
    amount: number,
    type: InvoiceType
  ): Promise<{ error: string | null }> {
    try {
      console.log("💰 Updating balance with transaction:", {
        userId,
        amount,
        type,
      });

      // Buscar saldo atual
      const currentBalanceResult = await this.getCurrentBalance(userId);
      if (currentBalanceResult.error) {
        throw new Error(currentBalanceResult.error);
      }

      const currentBalance = currentBalanceResult.data || 0;
      let newBalance = currentBalance;

      // Calcular novo saldo baseado no tipo de transação
      if (type === "deposito") {
        newBalance += amount;
      } else {
        newBalance -= amount;
      }

      // Adicionar novo registro de saldo
      return await this.addBalance(userId, newBalance);
    } catch (error: any) {
      console.error("❌ Error updating balance with transaction:", error);
      return { error: error.message };
    }
  },
};
