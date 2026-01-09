import {
  CreateInvoiceInput,
  Invoice,
  UpdateInvoiceInput,
} from "../entities/Invoice";

export interface Result<T> {
  data: T | null;
  error: string | null;
}

export interface IInvoiceRepository {
  create(input: CreateInvoiceInput): Promise<Result<Invoice>>;
  findByUserId(userId: string): Promise<Result<Invoice[]>>;
  findById(userId: string, invoiceId: string): Promise<Result<Invoice>>;
  update(input: UpdateInvoiceInput): Promise<Result<Invoice>>;
  delete(userId: string, invoiceId: string): Promise<Result<void>>;
}
