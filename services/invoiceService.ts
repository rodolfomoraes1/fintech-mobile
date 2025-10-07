import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { PersonalInvoice } from "../types";

export const invoiceService = {
  // Criar nova invoice
  async createInvoice(
    invoice: Omit<PersonalInvoice, "id">
  ): Promise<{ data: PersonalInvoice | null; error: string | null }> {
    try {
      console.log("🧾 Creating new invoice for user:", invoice.user_id);

      const invoiceData = {
        ...invoice,
        created_at: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, "personal_invoices"),
        invoiceData
      );

      const newInvoice: PersonalInvoice = {
        id: docRef.id,
        ...invoiceData,
      };

      console.log("✅ Invoice created successfully:", newInvoice.id);
      return { data: newInvoice, error: null };
    } catch (error: any) {
      console.error("❌ Error creating invoice:", error);
      return { data: null, error: error.message };
    }
  },

  // Buscar todas as invoices do usuário
  async getUserInvoices(
    userId: string
  ): Promise<{ data: PersonalInvoice[] | null; error: string | null }> {
    try {
      console.log("🧾 Fetching invoices for user:", userId);

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

      // Ordenar manualmente por data (mais recente primeiro)
      invoices.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      console.log(
        "✅ User invoices fetched successfully:",
        invoices.length,
        "records"
      );
      return { data: invoices, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching user invoices:", error);
      return { data: [], error: error.message };
    }
  },

  // Buscar invoice por ID
  async getInvoiceById(
    invoiceId: string
  ): Promise<{ data: PersonalInvoice | null; error: string | null }> {
    try {
      // Implementação simples - em produção usaríamos getDoc
      const invoices = await this.getUserInvoices("temp"); // Precisamos ajustar isso
      const invoice = invoices.data?.find((inv) => inv.id === invoiceId);

      return { data: invoice || null, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching invoice by ID:", error);
      return { data: null, error: error.message };
    }
  },

  // Atualizar invoice
  async updateInvoice(
    invoiceId: string,
    updates: Partial<PersonalInvoice>
  ): Promise<{ error: string | null }> {
    try {
      console.log("🧾 Updating invoice:", invoiceId);

      const invoiceRef = doc(db, "personal_invoices", invoiceId);
      await updateDoc(invoiceRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      console.log("✅ Invoice updated successfully");
      return { error: null };
    } catch (error: any) {
      console.error("❌ Error updating invoice:", error);
      return { error: error.message };
    }
  },

  // Deletar invoice
  async deleteInvoice(invoiceId: string): Promise<{ error: string | null }> {
    try {
      console.log("🧾 Deleting invoice:", invoiceId);

      await deleteDoc(doc(db, "personal_invoices", invoiceId));

      console.log("✅ Invoice deleted successfully");
      return { error: null };
    } catch (error: any) {
      console.error("❌ Error deleting invoice:", error);
      return { error: error.message };
    }
  },

  // Calcular resumo financeiro
  async getFinancialSummary(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    error: string | null;
  }> {
    try {
      console.log("💰 Calculating financial summary for user:", userId);

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

      console.log("✅ Financial summary calculated:", summary);
      return { ...summary, error: null };
    } catch (error: any) {
      console.error("❌ Error calculating financial summary:", error);
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        error: error.message,
      };
    }
  },
};
