export type InvoiceType = "pagamento" | "transferencia" | "deposito";

export interface Invoice {
  id: string;
  receiverName: string;
  amount: number;
  date: string;
  type: InvoiceType;
  userId: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceInput {
  receiverName: string;
  amount: number;
  date: string;
  type: InvoiceType;
  userId: string;
  receiptUrl?: string;
}

export interface UpdateInvoiceInput {
  id: string;
  receiverName?: string;
  amount?: number;
  date?: string;
  type?: InvoiceType;
  receiptUrl?: string;
}
