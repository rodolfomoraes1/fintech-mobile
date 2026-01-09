import { User } from "../entities/User";
import {
  IAuthRepository,
  SignInInput,
  SignUpInput,
} from "../repositories/IAuthRepository";

export class SignInUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: SignInInput) {
    return this.authRepository.signIn(input);
  }
}

export class SignUpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: SignUpInput) {
    return this.authRepository.signUp(input);
  }
}

export class SignOutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute() {
    return this.authRepository.signOut();
  }
}

export class GetCurrentUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
