import { InvoiceType } from "../entities/Invoice";
import { IBalanceRepository } from "../repositories/IBalanceRepository";

export class CreateInitialBalanceUseCase {
  constructor(private balanceRepository: IBalanceRepository) {}

  async execute(userId: string) {
    return this.balanceRepository.create({
      userId,
      currentBalance: 0,
    });
  }
}

export class GetUserBalancesUseCase {
  constructor(private balanceRepository: IBalanceRepository) {}

  async execute(userId: string) {
    return this.balanceRepository.findByUserId(userId);
  }
}

export class GetCurrentBalanceUseCase {
  constructor(private balanceRepository: IBalanceRepository) {}

  async execute(userId: string) {
    return this.balanceRepository.getCurrentBalance(userId);
  }
}

export class UpdateBalanceWithTransactionUseCase {
  constructor(private balanceRepository: IBalanceRepository) {}

  async execute(userId: string, amount: number, type: InvoiceType) {
    return this.balanceRepository.updateWithTransaction(userId, amount, type);
  }
}
