import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signIn(email, password);

      if (result.user && !result.error) {
        setUser(result.user);
      }

      return { error: result.error };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signUp(name, email, password);

      if (result.user && !result.error) {
        setUser(result.user);
      }

      return { error: result.error };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (router?: any) => {
    setIsLoading(true);
    try {
      const result = await authService.signOut();

      if (!result.error) {
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
