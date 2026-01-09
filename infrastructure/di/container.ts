import {
  GetCurrentUserUseCase,
  SignInUseCase,
  SignOutUseCase,
  SignUpUseCase,
} from "../../domain/usecases/AuthUseCases";
import {
  CreateInitialBalanceUseCase,
  GetCurrentBalanceUseCase,
  GetUserBalancesUseCase,
  UpdateBalanceWithTransactionUseCase,
} from "../../domain/usecases/BalanceUseCases";
import {
  CreateInvoiceUseCase,
  DeleteInvoiceUseCase,
  GetInvoiceByIdUseCase,
  GetUserInvoicesUseCase,
  UpdateInvoiceUseCase,
} from "../../domain/usecases/InvoiceUseCases";
import { CachedBalanceRepository } from "../cache/CachedBalanceRepository";
import { CachedInvoiceRepository } from "../cache/CachedInvoiceRepository";
import { AuthFirebaseRepository } from "../repositories/AuthFirebaseRepository";

const balanceRepository = new CachedBalanceRepository();
const invoiceRepository = new CachedInvoiceRepository();
const authRepository = new AuthFirebaseRepository(balanceRepository);

export const signInUseCase = new SignInUseCase(authRepository);
export const signUpUseCase = new SignUpUseCase(authRepository);
export const signOutUseCase = new SignOutUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

export const createInitialBalanceUseCase = new CreateInitialBalanceUseCase(
  balanceRepository
);
export const getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(
  balanceRepository
);
export const getUserBalancesUseCase = new GetUserBalancesUseCase(
  balanceRepository
);
export const updateBalanceWithTransactionUseCase =
  new UpdateBalanceWithTransactionUseCase(balanceRepository);

export const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepository);
export const getUserInvoicesUseCase = new GetUserInvoicesUseCase(
  invoiceRepository
);
export const getInvoiceByIdUseCase = new GetInvoiceByIdUseCase(
  invoiceRepository
);
export const updateInvoiceUseCase = new UpdateInvoiceUseCase(invoiceRepository);
export const deleteInvoiceUseCase = new DeleteInvoiceUseCase(invoiceRepository);
