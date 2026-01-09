import { Balance, CreateBalanceInput } from "../entities/Balance";
import { InvoiceType } from "../entities/Invoice";

export interface Result<T> {
  data: T | null;
  error: string | null;
}

export interface IBalanceRepository {
  create(input: CreateBalanceInput): Promise<Result<Balance>>;
  findByUserId(userId: string): Promise<Result<Balance[]>>;
  getCurrentBalance(userId: string): Promise<Result<number>>;
  updateWithTransaction(
    userId: string,
    amount: number,
    type: InvoiceType
  ): Promise<Result<void>>;
}
