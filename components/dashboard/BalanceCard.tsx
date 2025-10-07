import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { formatCurrency } from "../../utils/format";

interface BalanceCardProps {
  balance: number;
  isLoading: boolean;
  error: string | null;
  totalIncome: number;
  totalExpense: number;
}

export function BalanceCard({
  balance,
  isLoading,
  error,
  totalIncome,
  totalExpense,
}: BalanceCardProps) {
  return (
    <View className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
      <Text className="text-gray-500 text-lg">Saldo Total</Text>

      {isLoading ? (
        <View className="flex-row items-center mt-2">
          <ActivityIndicator size="small" color="#47A138" />
          <Text className="text-gray-500 ml-2">Carregando saldo...</Text>
        </View>
      ) : error ? (
        <Text className="text-red-500 text-lg mt-2">
          Erro ao carregar saldo
        </Text>
      ) : (
        <>
          <Text className="text-3xl font-bold text-gray-800 mt-2">
            {formatCurrency(balance)}
          </Text>
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="text-green-500 font-bold">
                {formatCurrency(totalIncome)}
              </Text>
              <Text className="text-gray-500 text-sm">Receitas</Text>
            </View>
            <View>
              <Text className="text-red-500 font-bold">
                {formatCurrency(totalExpense)}
              </Text>
              <Text className="text-gray-500 text-sm">Despesas</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
