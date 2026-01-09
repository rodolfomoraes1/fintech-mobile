import { CreateInvoiceInput, UpdateInvoiceInput } from "../entities/Invoice";
import { IInvoiceRepository } from "../repositories/IInvoiceRepository";

export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(input: CreateInvoiceInput) {
    return this.invoiceRepository.create(input);
  }
}

export class GetUserInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(userId: string) {
    return this.invoiceRepository.findByUserId(userId);
  }
}

export class GetInvoiceByIdUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(userId: string, invoiceId: string) {
    return this.invoiceRepository.findById(userId, invoiceId);
  }
}

export class UpdateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(input: UpdateInvoiceInput) {
    return this.invoiceRepository.update(input);
  }
}

export class DeleteInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(userId: string, invoiceId: string) {
    return this.invoiceRepository.delete(userId, invoiceId);
  }
}
