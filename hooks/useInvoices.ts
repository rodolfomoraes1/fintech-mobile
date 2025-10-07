import { useEffect, useState } from "react";
import { balanceService } from "../services/balanceService";
import { invoiceService } from "../services/invoiceService";
import { CreateInvoiceData, InvoiceType, PersonalInvoice } from "../types";

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

        const result = await invoiceService.getUserInvoices(userId);

        if (result.error) {
          throw new Error(result.error);
        }

        setInvoices(result.data || []);
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
      const now = new Date().toISOString();
      const invoiceWithTimestamps = {
        ...invoice,
        created_at: invoice.created_at || now,
        updated_at: invoice.updated_at || now,
      };

      const result = await invoiceService.createInvoice(invoiceWithTimestamps);

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (userId && result.data) {
        await balanceService.updateBalanceWithTransaction(
          userId,
          result.data.amount,
          result.data.type
        );
      }

      if (result.data) {
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
      const result = await invoiceService.getUserInvoices(userId);
      if (!result.error && result.data) {
        setInvoices(result.data);
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

      const result = await invoiceService.deleteInvoice(invoiceId);

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (userId) {
        if (invoiceType === "deposito") {
          await balanceService.updateBalanceWithTransaction(
            userId,
            -amount,
            invoiceType
          );
        } else {
          await balanceService.updateBalanceWithTransaction(
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

  return {
    invoices,
    isLoading,
    error,
    addInvoice,
    refreshInvoices,
    deleteInvoice,
  };
};
