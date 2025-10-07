import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { balanceService } from "./balanceService";
import { AuthErrorService } from "./errorService";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  success: boolean;
}

class AuthService {
  private mapFirebaseUser(firebaseUser: any, customName?: string): AuthUser {
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

  private async handleAuthOperation(
    operation: () => Promise<any>,
    customName?: string
  ): Promise<AuthResult> {
    try {
      const userCredential = await operation();

      if (customName) {
        await updateProfile(userCredential.user, {
          displayName: customName,
        });
      }

      const user = this.mapFirebaseUser(userCredential.user, customName);

      return { user, error: null, success: true };
    } catch (error: any) {
      const errorMessage = AuthErrorService.getErrorMessage(error);

      return { user: null, error: errorMessage, success: false };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    return this.handleAuthOperation(() =>
      signInWithEmailAndPassword(auth, email, password)
    );
  }

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    return this.handleAuthOperation(
      () => createUserWithEmailAndPassword(auth, email, password),
      name
    ).then(async (result) => {
      console.log("🔍 SignUp result before balance creation:", result);

      // ✅ CRIAR SALDO INICIAL PARA NOVO USUÁRIO
      if (result.user && !result.error) {
        console.log("💰 Creating balance for user ID:", result.user.id);
        const balanceResult = await balanceService.createInitialBalance(
          result.user.id
        );
        console.log("💰 Balance creation result:", balanceResult);
      } else {
        console.log(
          "❌ Cannot create balance - no user or error:",
          result.error
        );
      }

      return result;
    });
  }

  async signOut(): Promise<{ error: string | null; success: boolean }> {
    try {
      await signOut(auth);
      return { error: null, success: true };
    } catch (error: any) {
      const errorMessage = AuthErrorService.getErrorMessage(error);
      return { error: errorMessage, success: false };
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}

export const authService = new AuthService();
