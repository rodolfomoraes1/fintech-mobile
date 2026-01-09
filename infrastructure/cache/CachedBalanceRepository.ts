import { Balance, CreateBalanceInput } from "../../domain/entities/Balance";
import { InvoiceType } from "../../domain/entities/Invoice";
import {
  IBalanceRepository,
  Result,
} from "../../domain/repositories/IBalanceRepository";
import { BalanceFirebaseRepository } from "../repositories/BalanceFirebaseRepository";
import { CacheService } from "./CacheService";

export class CachedBalanceRepository implements IBalanceRepository {
  private repository: BalanceFirebaseRepository;
  private readonly CACHE_PREFIX = "balance";
  private readonly CACHE_TTL = 3 * 60 * 1000; // 3 minutos

  constructor() {
    this.repository = new BalanceFirebaseRepository();
  }

  async create(input: CreateBalanceInput): Promise<Result<Balance>> {
    const result = await this.repository.create(input);

    if (result.data) {
      await CacheService.invalidatePattern(
        `${this.CACHE_PREFIX}:${input.userId}`
      );
    }

    return result;
  }

  async findByUserId(userId: string): Promise<Result<Balance[]>> {
    const cacheKey = `${this.CACHE_PREFIX}:${userId}:list`;

    const cached = await CacheService.get<Balance[]>(cacheKey);
    if (cached) {
      return { data: cached, error: null };
    }

    const result = await this.repository.findByUserId(userId);

    if (result.data && !result.error) {
      await CacheService.set(cacheKey, result.data, this.CACHE_TTL);
    }

    return result;
  }

  async getCurrentBalance(userId: string): Promise<Result<number>> {
    const cacheKey = `${this.CACHE_PREFIX}:${userId}:current`;

    const cached = await CacheService.get<number>(cacheKey);
    if (cached !== null) {
      return { data: cached, error: null };
    }

    const result = await this.repository.getCurrentBalance(userId);

    if (result.data !== null && !result.error) {
      await CacheService.set(cacheKey, result.data, this.CACHE_TTL);
    }

    return result;
  }

  async updateWithTransaction(
    userId: string,
    amount: number,
    type: InvoiceType
  ): Promise<Result<void>> {
    const result = await this.repository.updateWithTransaction(
      userId,
      amount,
      type
    );

    if (!result.error) {
      await CacheService.invalidatePattern(`${this.CACHE_PREFIX}:${userId}`);
    }

    return result;
  }
}
