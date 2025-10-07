import { useEffect, useState } from "react";
import { balanceService } from "../services/balanceService";
import { invoiceService } from "../services/invoiceService";
import { InvoiceType, PersonalInvoice } from "../types";

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

        console.log("🧾 Fetching invoices for user:", userId);

        const result = await invoiceService.getUserInvoices(userId);

        if (result.error) {
          throw new Error(result.error);
        }

        setInvoices(result.data || []);
        console.log("✅ Invoices loaded:", result.data?.length, "records");
      } catch (err: any) {
        console.error("❌ Error fetching invoices:", err);
        setError(err.message);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [userId]);

  const addInvoice = async (
    invoice: Omit<PersonalInvoice, "id">
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await invoiceService.createInvoice(invoice);

      if (result.error) {
        return { success: false, error: result.error };
      }

      // ✅ ATUALIZAR SALDO quando criar nova transação
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
      console.error("❌ Error refreshing invoices:", err);
    }
  };

  const deleteInvoice = async (
    invoiceId: string,
    amount: number,
    type: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🗑️ Deleting invoice:", invoiceId);

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

      // ✅ ATUALIZAR SALDO - reverter o efeito da transação
      if (userId) {
        if (invoiceType === "deposito") {
          // Se era depósito, subtrai do saldo
          await balanceService.updateBalanceWithTransaction(
            userId,
            -amount,
            invoiceType
          );
        } else {
          // Se era despesa, adiciona de volta ao saldo
          await balanceService.updateBalanceWithTransaction(
            userId,
            amount,
            invoiceType
          );
        }
      }

      // Remover da lista local
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));

      console.log("✅ Invoice deleted successfully");
      return { success: true };
    } catch (err: any) {
      console.error("❌ Error deleting invoice:", err);
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
