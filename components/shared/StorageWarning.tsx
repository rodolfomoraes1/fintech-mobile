import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function StorageWarning() {
  return (
    <View className="mb-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
      <View className="flex-row items-start">
        <Ionicons name="warning" size={20} color="#EAB308" />
        <View className="ml-3 flex-1">
          <Text className="text-yellow-800 font-medium">Aviso Importante</Text>
          <Text className="text-yellow-700 text-sm mt-1">
            O upload de comprovantes está temporariamente indisponível. O
            Firebase Storage não pôde ser configurado devido a restrições de
            localização no plano gratuito.
          </Text>
        </View>
      </View>
    </View>
  );
}
