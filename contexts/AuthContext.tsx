import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../domain/entities/User";
import {
  getCurrentUserUseCase,
  signInUseCase,
  signOutUseCase,
  signUpUseCase,
} from "../infrastructure/di/container";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: (router?: any) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUserUseCase.execute();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInUseCase.execute({ email, password });

      if (result.data && result.success) {
        setUser(result.data);
      }

      return { error: result.error };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await signUpUseCase.execute({ name, email, password });

        if (result.data && result.success) {
          setUser(result.data);
        }

        return { error: result.error };
      } catch (error: any) {
        return { error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async (router?: any) => {
    setIsLoading(true);
    try {
      const result = await signOutUseCase.execute();

      if (result.success) {
        setUser(null);

        if (router) {
          router.replace("/login");
        }
      }

      return { error: result.error };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthLoading = () => {
  const { isLoading } = useAuth();
  return isLoading;
};
