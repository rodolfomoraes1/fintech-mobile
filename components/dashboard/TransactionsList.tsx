import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PersonalInvoice } from "../../types";
import { formatCurrency } from "../../utils/format";

interface TransactionsListProps {
  isLoading: boolean;
  error: string | null;
  transactions: PersonalInvoice[];
}

export function TransactionsList({
  isLoading,
  error,
  transactions,
}: TransactionsListProps) {
  const getTypeDisplayName = (type: string) => {
    const types = {
      deposito: "Depósito",
      transferencia: "Transferência",
      pagamento: "Pagamento",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <>
      <Text className="text-xl font-bold text-gray-800 mb-4 mt-4">
        Transações Recentes
      </Text>

      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#47A138" />
          <Text className="text-gray-500 mt-2">Carregando transações...</Text>
        </View>
      ) : error ? (
        <View className="items-center py-8">
          <Text className="text-red-500">Erro ao carregar transações</Text>
          <Text className="text-gray-500 text-sm mt-1">{error}</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500 text-lg">
            Nenhuma transação encontrada
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Suas transações aparecerão aqui
          </Text>
        </View>
      ) : (
        transactions.map((transaction) => (
          <View
            key={transaction.id}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-medium text-gray-800">
                  {transaction.receiver_name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-gray-500 text-sm">
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </Text>
                  <Text className="text-gray-400 mx-2">•</Text>
                  <Text className="text-gray-500 text-sm">
                    {getTypeDisplayName(transaction.type)}
                  </Text>
                </View>
              </View>
              <Text
                className={`text-lg font-bold ${
                  transaction.type === "deposito"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "deposito" ? "+ " : "- "}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>
        ))
      )}
    </>
  );
}
