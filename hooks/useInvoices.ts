import { useEffect, useState } from "react";
import { Invoice, InvoiceType } from "../domain/entities/Invoice";
import {
  createInvoiceUseCase,
  deleteInvoiceUseCase,
  getInvoiceByIdUseCase,
  getUserInvoicesUseCase,
  updateBalanceWithTransactionUseCase,
  updateInvoiceUseCase,
} from "../infrastructure/di/container";
import { PersonalInvoice } from "../types";

interface CreateInvoiceData {
  receiverName: string;
  amount: number;
  date: string;
  type: InvoiceType;
  userId: string;
  receiptUrl?: string;
}

// Converte Invoice (camelCase) para PersonalInvoice (snake_case)
const convertToPersonalInvoice = (invoice: Invoice): PersonalInvoice => ({
  id: invoice.id,
  receiver_name: invoice.receiverName,
  amount: invoice.amount,
  date: invoice.date,
  type: invoice.type,
  user_id: invoice.userId,
  receipt_url: invoice.receiptUrl,
  created_at: invoice.createdAt,
  updated_at: invoice.updatedAt,
});

export const useInvoices = (userId: string | null) => {
  const [invoices, setInvoices] = useState<PersonalInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getUserInvoicesUseCase.execute(userId);

        if (result.error) {
          throw new Error(result.error);
        }

        const personalInvoices = (result.data || []).map(
          convertToPersonalInvoice
        );
        setInvoices(personalInvoices);
      } catch (err: any) {
        setError(err.message);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [userId]);

  const addInvoice = async (
    invoice: CreateInvoiceData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await createInvoiceUseCase.execute({
        receiverName: invoice.receiverName,
        amount: invoice.amount,
        date: invoice.date,
        type: invoice.type,
        userId: invoice.userId,
        receiptUrl: invoice.receiptUrl,
      });

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (userId && result.data) {
        await updateBalanceWithTransactionUseCase.execute(
          userId,
          result.data.amount,
          result.data.type
        );
      }

      if (result.data) {
        convertToPersonalInvoice(result.data!);
        setInvoices((prev) => [result.data!, ...prev]);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const refreshInvoices = async () => {
    if (!userId) return;

    try {
      const result = await getUserInvoicesUseCase.execute(userId);
      if (!result.error && result.data) {
        const personalInvoices = result.data.map(convertToPersonalInvoice);
        setInvoices(personalInvoices);
      }
    } catch (err: any) {
      //Alert.alert("Erro", "Não foi possível atualizar as transações");
    }
  };

  const deleteInvoice = async (
    invoiceId: string,
    amount: number,
    type: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const validTypes: InvoiceType[] = [
        "deposito",
        "transferencia",
        "pagamento",
      ];
      const invoiceType = validTypes.includes(type as InvoiceType)
        ? (type as InvoiceType)
        : "pagamento";

      const result = await deleteInvoiceUseCase.execute(userId!, invoiceId);

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (userId) {
        if (invoiceType === "deposito") {
          await updateBalanceWithTransactionUseCase.execute(
            userId,
            -amount,
            invoiceType
          );
        } else {
          await updateBalanceWithTransactionUseCase.execute(
            userId,
            amount,
            invoiceType
          );
        }
      }
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getInvoiceById = async (
    invoiceId: string
  ): Promise<{ data: PersonalInvoice | null; error: string | null }> => {
    if (!userId) return { data: null, error: "Usuário não autenticado" };

    try {
      // Busca direto do repositório para garantir dados atualizados
      const result = await getInvoiceByIdUseCase.execute(userId, invoiceId);
      if (result.error) {
        return { data: null, error: result.error };
      }

      if (!result.data) {
        return { data: null, error: "Transação não encontrada" };
      }

      return { data: convertToPersonalInvoice(result.data), error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateInvoice = async (
    invoiceId: string,
    updates: {
      receiverName?: string;
      amount?: number;
      date?: string;
      type?: InvoiceType;
      receiptUrl?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) return { success: false, error: "Usuário não autenticado" };

    try {
      const result = await updateInvoiceUseCase.execute({
        id: invoiceId,
        ...updates,
      });

      if (result.error) {
        return { success: false, error: result.error };
      }

      // Atualizar a lista local
      if (result.data) {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === invoiceId
              ? convertToPersonalInvoice(result.data!)
              : invoice
          )
        );
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    invoices,
    isLoading,
    error,
    addInvoice,
    updateInvoice,
    getInvoiceById,
    refreshInvoices,
    deleteInvoice,
  };
};
