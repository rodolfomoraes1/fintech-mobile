import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InvoiceType } from "../../types";

interface TransactionTypeSelectorProps {
  selectedType: InvoiceType;
  onTypeSelect: (type: InvoiceType) => void;
  disabled?: boolean;
}

export function TransactionTypeSelector({
  selectedType,
  onTypeSelect,
  disabled = false,
}: TransactionTypeSelectorProps) {
  return (
    <View className="space-y-2">
      {/* Radio Button para Depósito */}
      <TouchableOpacity
        className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200"
        onPress={() => onTypeSelect("deposito")}
        disabled={disabled}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
            selectedType === "deposito"
              ? "border-green-500 bg-green-500"
              : "border-gray-400"
          }`}
        >
          {selectedType === "deposito" && (
            <View className="w-2 h-2 rounded-full bg-white" />
          )}
        </View>
        <Ionicons name="arrow-down-circle" size={20} color="#10b981" />
        <Text className="text-gray-800 font-medium ml-2">Depósito</Text>
      </TouchableOpacity>

      {/* Radio Button para Pagamento */}
      <TouchableOpacity
        className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200"
        onPress={() => onTypeSelect("pagamento")}
        disabled={disabled}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
            selectedType === "pagamento"
              ? "border-red-500 bg-red-500"
              : "border-gray-400"
          }`}
        >
          {selectedType === "pagamento" && (
            <View className="w-2 h-2 rounded-full bg-white" />
          )}
        </View>
        <Ionicons name="card" size={20} color="#ef4444" />
        <Text className="text-gray-800 font-medium ml-2">Pagamento</Text>
      </TouchableOpacity>

      {/* Radio Button para Transferência */}
      <TouchableOpacity
        className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200"
        onPress={() => onTypeSelect("transferencia")}
        disabled={disabled}
      >
        <View
          className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
            selectedType === "transferencia"
              ? "border-blue-500 bg-blue-500"
              : "border-gray-400"
          }`}
        >
          {selectedType === "transferencia" && (
            <View className="w-2 h-2 rounded-full bg-white" />
          )}
        </View>
        <Ionicons name="swap-horizontal" size={20} color="#3b82f6" />
        <Text className="text-gray-800 font-medium ml-2">Transferência</Text>
      </TouchableOpacity>
    </View>
  );
}
