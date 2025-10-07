import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { CreateInvoiceData, PersonalInvoice } from "../types";

export const invoiceService = {
  async createInvoice(
    invoice: CreateInvoiceData
  ): Promise<{ data: PersonalInvoice | null; error: string | null }> {
    try {
      const now = new Date().toISOString();
      const invoiceData = {
        ...invoice,
        created_at: invoice.created_at || now,
        updated_at: invoice.updated_at || now,
      };

      const docRef = await addDoc(
        collection(db, "personal_invoices"),
        invoiceData
      );

      const newInvoice: PersonalInvoice = {
        id: docRef.id,
        ...invoiceData,
      };

      return { data: newInvoice, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async getUserInvoices(
    userId: string
  ): Promise<{ data: PersonalInvoice[] | null; error: string | null }> {
    try {
      const q = query(
        collection(db, "personal_invoices"),
        where("user_id", "==", userId)
        // ⚠️ Temporariamente sem orderBy para evitar erro de índice
      );

      const querySnapshot = await getDocs(q);
      const invoices: PersonalInvoice[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        invoices.push({
          id: doc.id,
          receiver_name: data.receiver_name,
          amount: data.amount,
          date: data.date,
          type: data.type,
          user_id: data.user_id,
          created_at: data.created_at,
        } as PersonalInvoice);
      });

      return { data: invoices, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  async getInvoiceById(
    userId: string,
    invoiceId: string
  ): Promise<{ data: PersonalInvoice | null; error: string | null }> {
    try {
      const docRef = doc(db, "personal_invoices", invoiceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().user_id === userId) {
        const data = docSnap.data();
        return {
          data: {
            id: docSnap.id,
            ...data,
          } as PersonalInvoice,
          error: null,
        };
      }

      return { data: null, error: "Transação não encontrada" };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateInvoice(
    userId: string,
    invoiceId: string,
    updates: Partial<PersonalInvoice>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const currentInvoice = await this.getInvoiceById(userId, invoiceId);
      if (!currentInvoice.data) {
        return { success: false, error: "Transação não encontrada" };
      }

      const invoiceRef = doc(db, "personal_invoices", invoiceId);
      await updateDoc(invoiceRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async deleteInvoice(invoiceId: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, "personal_invoices", invoiceId));

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async getFinancialSummary(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    error: string | null;
  }> {
    try {
      const invoicesResult = await this.getUserInvoices(userId);

      if (invoicesResult.error) {
        throw new Error(invoicesResult.error);
      }

      const invoices = invoicesResult.data || [];

      const summary = invoices.reduce(
        (acc, invoice) => {
          if (invoice.type === "deposito") {
            acc.totalIncome += invoice.amount;
          } else {
            acc.totalExpense += invoice.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, balance: 0 }
      );

      summary.balance = summary.totalIncome - summary.totalExpense;

      return { ...summary, error: null };
    } catch (error: any) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        error: error.message,
      };
    }
  },
};
