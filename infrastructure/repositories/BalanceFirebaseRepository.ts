import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Balance, CreateBalanceInput } from "../../domain/entities/Balance";
import { InvoiceType } from "../../domain/entities/Invoice";
import {
  IBalanceRepository,
  Result,
} from "../../domain/repositories/IBalanceRepository";
import { db } from "../../lib/firebase";

export class BalanceFirebaseRepository implements IBalanceRepository {
  async create(input: CreateBalanceInput): Promise<Result<Balance>> {
    try {
      const now = new Date().toISOString();
      const balanceData = {
        user_id: input.userId,
        current_balance: input.currentBalance,
        date: now,
        created_at: now,
      };

      const docRef = await addDoc(collection(db, "user_balances"), balanceData);

      const balance: Balance = {
        id: docRef.id,
        userId: input.userId,
        currentBalance: input.currentBalance,
        date: now,
        createdAt: now,
      };

      return { data: balance, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async findByUserId(userId: string): Promise<Result<Balance[]>> {
    try {
      const q = query(
        collection(db, "user_balances"),
        where("user_id", "==", userId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const balances: Balance[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        balances.push({
          id: doc.id,
          userId: data.user_id,
          currentBalance: data.current_balance,
          date: data.date,
          createdAt: data.created_at,
        });
      });

      return { data: balances, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getCurrentBalance(userId: string): Promise<Result<number>> {
    try {
      const result = await this.findByUserId(userId);

      if (result.error || !result.data || result.data.length === 0) {
        return { data: 0, error: null };
      }

      const currentBalance = result.data[0].currentBalance;
      return { data: currentBalance, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async updateWithTransaction(
    userId: string,
    amount: number,
    type: InvoiceType
  ): Promise<Result<void>> {
    try {
      const currentBalanceResult = await this.getCurrentBalance(userId);
      if (currentBalanceResult.error || currentBalanceResult.data === null) {
        return { data: null, error: "Erro ao obter saldo atual" };
      }

      let newBalance = currentBalanceResult.data;

      if (type === "deposito") {
        newBalance += amount;
      } else if (type === "pagamento" || type === "transferencia") {
        newBalance -= amount;
      }

      await this.create({
        userId,
        currentBalance: newBalance,
      });

      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}
