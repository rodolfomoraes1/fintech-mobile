import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useBalance } from "../hooks/useBalance";

interface BalanceContextType {
  currentBalance: number;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const {
    currentBalance,
    isLoading,
    error,
    refreshBalance: originalRefresh,
  } = useBalance(userId);

  const refreshBalance = useCallback(async () => {
    await originalRefresh();
  }, [originalRefresh]);

  const value = useMemo(
    () => ({
      currentBalance,
      isLoading,
      error,
      refreshBalance,
    }),
    [currentBalance, isLoading, error, refreshBalance]
  );

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
}

export function useBalanceContext() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalanceContext must be used within a BalanceProvider");
  }
  return context;
}

export const useCurrentBalance = () => {
  const { currentBalance } = useBalanceContext();
  return currentBalance;
};

export const useBalanceLoading = () => {
  const { isLoading } = useBalanceContext();
  return isLoading;
};
