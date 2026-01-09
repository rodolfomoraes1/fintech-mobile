import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Balance } from "../domain/entities/Balance";
import {
  getCurrentBalanceUseCase,
  getUserBalancesUseCase,
} from "../infrastructure/di/container";

export const useBalance = (userId: string | null) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<Balance[]>([]);
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

        const currentBalanceResult =
          await getCurrentBalanceUseCase.execute(userId);
        if (currentBalanceResult.error) {
          throw new Error(currentBalanceResult.error);
        }

        let historyData: Balance[] = [];
        try {
          const historyResult = await getUserBalancesUseCase.execute(userId);
          if (!historyResult.error && historyResult.data) {
            historyData = historyResult.data;
          } else if (historyResult.error) {
            Alert.alert(
              "Erro",
              "Não foi possível carregar o histórico de saldo"
            );
          }
        } catch (historyError) {
          Alert.alert("Erro", "Erro ao carregar o histórico de saldo");
        }

        setCurrentBalance(currentBalanceResult.data || 0);
        setBalanceHistory(historyData);
      } catch (err: any) {
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
      const result = await getCurrentBalanceUseCase.execute(userId);
      if (!result.error && result.data !== null) {
        setCurrentBalance(result.data);
      }
    } catch (err: any) {
      Alert.alert("Erro", "Não foi possível atualizar o saldo");
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
