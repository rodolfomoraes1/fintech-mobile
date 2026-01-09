import {
  getCurrentBalanceUseCase,
  getUserInvoicesUseCase,
} from "@/infrastructure/di/container";
import { useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";

interface PrefetchOptions {
  userId: string;
  onComplete?: () => void;
}

export const usePrefetchData = ({ userId, onComplete }: PrefetchOptions) => {
  const hasPrefetched = useRef(false);

  const prefetchData = useCallback(async () => {
    if (hasPrefetched.current) return;

    try {
      await Promise.all([
        getCurrentBalanceUseCase.execute(userId),
        getUserInvoicesUseCase.execute(userId),
      ]);

      hasPrefetched.current = true;
      onComplete?.();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível pré-carregar os dados");
    }
  }, [userId, onComplete]);

  useEffect(() => {
    if (userId) {
      prefetchData();
    }
  }, [userId, prefetchData]);

  return { prefetchData };
};
