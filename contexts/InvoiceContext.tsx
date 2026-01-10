import React, { createContext, useCallback, useContext, useMemo } from "react";
import { InvoiceType } from "../domain/entities/Invoice";
import { useInvoices } from "../hooks/useInvoices";
import { PersonalInvoice } from "../types";

interface CreateInvoiceData {
  receiverName: string;
  amount: number;
  date: string;
  type: InvoiceType;
  userId: string;
  receiptUrl?: string;
}

interface InvoiceContextType {
  invoices: PersonalInvoice[];
  isLoading: boolean;
  error: string | null;
  addInvoice: (
    invoice: CreateInvoiceData
  ) => Promise<{ success: boolean; error?: string }>;
  refreshInvoices: () => Promise<void>;
  deleteInvoice: (
    invoiceId: string,
    amount: number,
    type: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const {
    invoices,
    isLoading,
    error,
    addInvoice: originalAdd,
    refreshInvoices: originalRefresh,
    deleteInvoice: originalDelete,
  } = useInvoices(userId);

  const addInvoice = useCallback(
    async (invoice: CreateInvoiceData) => {
      return await originalAdd(invoice);
    },
    [originalAdd]
  );

  const refreshInvoices = useCallback(async () => {
    await originalRefresh();
  }, [originalRefresh]);

  const deleteInvoice = useCallback(
    async (invoiceId: string, amount: number, type: string) => {
      return await originalDelete(invoiceId, amount, type);
    },
    [originalDelete]
  );

  const value = useMemo(
    () => ({
      invoices,
      isLoading,
      error,
      addInvoice,
      refreshInvoices,
      deleteInvoice,
    }),
    [invoices, isLoading, error, addInvoice, refreshInvoices, deleteInvoice]
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoiceContext must be used within an InvoiceProvider");
  }
  return context;
}

export const useInvoicesList = () => {
  const { invoices } = useInvoiceContext();
  return invoices;
};

export const useInvoiceLoading = () => {
  const { isLoading } = useInvoiceContext();
  return isLoading;
};
