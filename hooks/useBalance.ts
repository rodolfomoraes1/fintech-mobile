import { useEffect, useState } from "react";
import { balanceService } from "../services/balanceService";
import { UserBalance } from "../types";

export const useBalance = (userId: string | null) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<UserBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("💰 Fetching balance for user:", userId);

        // ✅ BUSCAR SALDO ATUAL (CRÍTICO)
        const currentBalanceResult =
          await balanceService.getCurrentBalance(userId);
        if (currentBalanceResult.error) {
          throw new Error(currentBalanceResult.error);
        }

        // ✅ BUSCAR HISTÓRICO (NÃO-CRÍTICO) - NÃO QUEBRA O FLUXO SE DER ERRO
        let historyData: UserBalance[] = [];
        try {
          const historyResult = await balanceService.getUserBalances(userId);
          if (!historyResult.error && historyResult.data) {
            historyData = historyResult.data;
            console.log(
              "✅ Balance history loaded:",
              historyData.length,
              "records"
            );
          } else if (historyResult.error) {
            console.warn(
              "⚠️ Could not load balance history:",
              historyResult.error
            );
            // Não joga erro, apenas registra o warning
          }
        } catch (historyError) {
          console.warn("⚠️ Error loading balance history:", historyError);
          // Continua o fluxo mesmo com erro no histórico
        }

        setCurrentBalance(currentBalanceResult.data || 0);
        setBalanceHistory(historyData);

        console.log("✅ Current balance loaded:", currentBalanceResult.data);
      } catch (err: any) {
        console.error("❌ Error fetching current balance:", err);
        setError(err.message);
        setCurrentBalance(0);
        setBalanceHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const refreshBalance = async () => {
    if (!userId) return;

    try {
      const result = await balanceService.getCurrentBalance(userId);
      if (!result.error && result.data !== null) {
        setCurrentBalance(result.data);
      }
    } catch (err: any) {
      console.error("❌ Error refreshing balance:", err);
    }
  };

  return {
    currentBalance,
    balanceHistory,
    isLoading,
    error,
    refreshBalance,
  };
};
