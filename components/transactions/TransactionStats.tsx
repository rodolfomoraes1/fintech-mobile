import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TransactionStatsProps {
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function TransactionStats({
  total,
  onRefresh,
  isRefreshing,
}: TransactionStatsProps) {
  return (
    <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">Total de Transações</Text>
          <Text className="text-2xl font-bold text-gray-800">{total}</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
          onPress={onRefresh}
          disabled={isRefreshing}
        >
          <Ionicons name="refresh" size={16} color="#47A138" />
          <Text className="text-primary font-medium ml-2">
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
