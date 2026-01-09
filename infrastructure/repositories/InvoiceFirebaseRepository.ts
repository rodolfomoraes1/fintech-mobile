import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  CreateInvoiceInput,
  Invoice,
  UpdateInvoiceInput,
} from "../../domain/entities/Invoice";
import {
  IInvoiceRepository,
  Result,
} from "../../domain/repositories/IInvoiceRepository";
import { db } from "../../lib/firebase";

export class InvoiceFirebaseRepository implements IInvoiceRepository {
  async create(input: CreateInvoiceInput): Promise<Result<Invoice>> {
    try {
      const now = new Date().toISOString();
      const invoiceData = {
        receiver_name: input.receiverName,
        amount: input.amount,
        date: input.date,
        type: input.type,
        user_id: input.userId,
        receipt_url: input.receiptUrl,
        created_at: now,
        updated_at: now,
      };

      const docRef = await addDoc(
        collection(db, "personal_invoices"),
        invoiceData
      );

      const invoice: Invoice = {
        id: docRef.id,
        receiverName: input.receiverName,
        amount: input.amount,
        date: input.date,
        type: input.type,
        userId: input.userId,
        receiptUrl: input.receiptUrl,
        createdAt: now,
        updatedAt: now,
      };

      return { data: invoice, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async findByUserId(userId: string): Promise<Result<Invoice[]>> {
    try {
      const q = query(
        collection(db, "personal_invoices"),
        where("user_id", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const invoices: Invoice[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        invoices.push({
          id: doc.id,
          receiverName: data.receiver_name,
          amount: data.amount,
          date: data.date,
          type: data.type,
          userId: data.user_id,
          receiptUrl: data.receipt_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      });

      return { data: invoices, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async findById(userId: string, invoiceId: string): Promise<Result<Invoice>> {
    try {
      const docRef = doc(db, "personal_invoices", invoiceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().user_id === userId) {
        const data = docSnap.data();
        return {
          data: {
            id: docSnap.id,
            receiverName: data.receiver_name,
            amount: data.amount,
            date: data.date,
            type: data.type,
            userId: data.user_id,
            receiptUrl: data.receipt_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          },
          error: null,
        };
      }

      return { data: null, error: "Transação não encontrada" };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async update(input: UpdateInvoiceInput): Promise<Result<Invoice>> {
    try {
      const docRef = doc(db, "personal_invoices", input.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: "Transação não encontrada" };
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (input.receiverName !== undefined)
        updateData.receiver_name = input.receiverName;
      if (input.amount !== undefined) updateData.amount = input.amount;
      if (input.date !== undefined) updateData.date = input.date;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.receiptUrl !== undefined)
        updateData.receipt_url = input.receiptUrl;

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data()!;

      return {
        data: {
          id: updatedDoc.id,
          receiverName: data.receiver_name,
          amount: data.amount,
          date: data.date,
          type: data.type,
          userId: data.user_id,
          receiptUrl: data.receipt_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async delete(userId: string, invoiceId: string): Promise<Result<void>> {
    try {
      const docRef = doc(db, "personal_invoices", invoiceId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || docSnap.data().user_id !== userId) {
        return { data: null, error: "Transação não encontrada" };
      }

      await deleteDoc(docRef);
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}
