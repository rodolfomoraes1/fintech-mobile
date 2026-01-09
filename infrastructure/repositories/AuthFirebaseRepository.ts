import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { User } from "../../domain/entities/User";
import {
  AuthResult,
  IAuthRepository,
  SignInInput,
  SignUpInput,
} from "../../domain/repositories/IAuthRepository";
import { IBalanceRepository } from "../../domain/repositories/IBalanceRepository";
import { auth } from "../../lib/firebase";
import { AuthErrorService } from "../../services/errorService";
import { AuthTokenService } from "../security/AuthTokenService";
import { InputValidator } from "../security/InputValidator";

export class AuthFirebaseRepository implements IAuthRepository {
  constructor(private balanceRepository?: IBalanceRepository) {}

  private mapFirebaseUser(
    firebaseUser: FirebaseUser,
    customName?: string
  ): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name:
        customName ||
        firebaseUser.displayName ||
        this.extractNameFromEmail(firebaseUser.email),
    };
  }

  private extractNameFromEmail(email: string | null): string {
    if (!email) return "Usuário";
    return email.split("@")[0] || "Usuário";
  }

  async signIn(input: SignInInput): Promise<AuthResult<User>> {
    try {
      const emailValidation = InputValidator.validateEmail(input.email);
      if (!emailValidation.valid) {
        return {
          data: null,
          error: emailValidation.error!,
          success: false,
        };
      }

      const passwordValidation = InputValidator.validatePassword(
        input.password
      );
      if (!passwordValidation.valid) {
        return {
          data: null,
          error: passwordValidation.error!,
          success: false,
        };
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );

      const user = this.mapFirebaseUser(userCredential.user);

      const token = await userCredential.user.getIdToken();
      await AuthTokenService.setToken(token);
      await AuthTokenService.setUserData(user);

      return { data: user, error: null, success: true };
    } catch (error: any) {
      const errorMessage = AuthErrorService.getErrorMessage(error);
      return { data: null, error: errorMessage, success: false };
    }
  }

  async signUp(input: SignUpInput): Promise<AuthResult<User>> {
    try {
      const nameValidation = InputValidator.validateName(input.name);
      if (!nameValidation.valid) {
        return {
          data: null,
          error: nameValidation.error!,
          success: false,
        };
      }

      const emailValidation = InputValidator.validateEmail(input.email);
      if (!emailValidation.valid) {
        return {
          data: null,
          error: emailValidation.error!,
          success: false,
        };
      }

      const passwordValidation = InputValidator.validatePassword(
        input.password
      );
      if (!passwordValidation.valid) {
        return {
          data: null,
          error: passwordValidation.error!,
          success: false,
        };
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );

      await updateProfile(userCredential.user, {
        displayName: input.name,
      });

      const user = this.mapFirebaseUser(userCredential.user, input.name);

      const token = await userCredential.user.getIdToken();
      await AuthTokenService.setToken(token);
      await AuthTokenService.setUserData(user);

      if (this.balanceRepository) {
        await this.balanceRepository.create({
          userId: user.id,
          currentBalance: 0,
        });
      }

      return { data: user, error: null, success: true };
    } catch (error: any) {
      const errorMessage = AuthErrorService.getErrorMessage(error);
      return { data: null, error: errorMessage, success: false };
    }
  }

  async signOut(): Promise<AuthResult<void>> {
    try {
      await signOut(auth);
      await AuthTokenService.clearAll();
      return { data: null, error: null, success: true };
    } catch (error: any) {
      const errorMessage = AuthErrorService.getErrorMessage(error);
      return { data: null, error: errorMessage, success: false };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      const cachedUser = await AuthTokenService.getUserData();
      return cachedUser;
    }
    return this.mapFirebaseUser(firebaseUser);
  }
}
