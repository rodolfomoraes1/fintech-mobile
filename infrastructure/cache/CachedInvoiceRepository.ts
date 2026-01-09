import {
  CreateInvoiceInput,
  Invoice,
  UpdateInvoiceInput,
} from "../../domain/entities/Invoice";
import {
  IInvoiceRepository,
  Result,
} from "../../domain/repositories/IInvoiceRepository";
import { InvoiceFirebaseRepository } from "../repositories/InvoiceFirebaseRepository";
import { CacheService } from "./CacheService";

export class CachedInvoiceRepository implements IInvoiceRepository {
  private repository: InvoiceFirebaseRepository;
  private readonly CACHE_PREFIX = "invoice";
  private readonly CACHE_TTL = 3 * 60 * 1000; // 3 minutos

  constructor() {
    this.repository = new InvoiceFirebaseRepository();
  }

  async create(input: CreateInvoiceInput): Promise<Result<Invoice>> {
    const result = await this.repository.create(input);

    if (result.data) {
      await CacheService.invalidatePattern(
        `${this.CACHE_PREFIX}:${input.userId}`
      );
    }

    return result;
  }

  async findByUserId(userId: string): Promise<Result<Invoice[]>> {
    const cacheKey = `${this.CACHE_PREFIX}:${userId}:list`;

    const cached = await CacheService.get<Invoice[]>(cacheKey);
    if (cached) {
      return { data: cached, error: null };
    }

    const result = await this.repository.findByUserId(userId);

    if (result.data && !result.error) {
      await CacheService.set(cacheKey, result.data, this.CACHE_TTL);
    }

    return result;
  }

  async findById(userId: string, invoiceId: string): Promise<Result<Invoice>> {
    const cacheKey = `${this.CACHE_PREFIX}:${userId}:${invoiceId}`;

    const cached = await CacheService.get<Invoice>(cacheKey);
    if (cached) {
      return { data: cached, error: null };
    }

    const result = await this.repository.findById(userId, invoiceId);

    if (result.data && !result.error) {
      await CacheService.set(cacheKey, result.data, this.CACHE_TTL);
    }

    return result;
  }

  async update(input: UpdateInvoiceInput): Promise<Result<Invoice>> {
    const result = await this.repository.update(input);

    if (result.data) {
      await CacheService.invalidatePattern(
        `${this.CACHE_PREFIX}:${result.data.userId}`
      );
    }

    return result;
  }

  async delete(userId: string, invoiceId: string): Promise<Result<void>> {
    const result = await this.repository.delete(userId, invoiceId);

    if (!result.error) {
      await CacheService.invalidatePattern(`${this.CACHE_PREFIX}:${userId}`);
    }

    return result;
  }
}
