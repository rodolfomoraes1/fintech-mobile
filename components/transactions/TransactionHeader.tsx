import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TransactionHeaderProps {
  onCreateTransaction: () => void;
}

export function TransactionHeader({
  onCreateTransaction,
}: TransactionHeaderProps) {
  return (
    <View className="bg-dark pt-12 pb-4 px-6">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Transações</Text>
          <Text className="text-light text-sm mt-1">
            Gerencie suas transações financeiras
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary rounded-full p-3 shadow-lg"
          onPress={onCreateTransaction}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
