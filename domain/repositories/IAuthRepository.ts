import { User } from "../entities/User";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult<T = User> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface IAuthRepository {
  signIn(input: SignInInput): Promise<AuthResult<User>>;
  signUp(input: SignUpInput): Promise<AuthResult<User>>;
  signOut(): Promise<AuthResult<void>>;
  getCurrentUser(): Promise<User | null>;
}
