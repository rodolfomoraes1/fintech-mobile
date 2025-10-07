import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { PersonalInvoice } from "../../types";

interface TransactionItemProps {
  invoice: PersonalInvoice;
  onEdit: (id: string) => void;
  onDelete: (invoice: PersonalInvoice) => void;
  deletingId: string | null;
}

export function TransactionItem({
  invoice,
  onEdit,
  onDelete,
  deletingId,
}: TransactionItemProps) {
  const getTypeDisplayName = (type: string) => {
    const types = {
      deposito: "Depósito",
      transferencia: "Transferência",
      pagamento: "Pagamento",
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      deposito: "arrow-down-circle",
      transferencia: "swap-horizontal",
      pagamento: "card",
    };
    return icons[type as keyof typeof icons] || "help-circle";
  };

  const getTypeColor = (type: string) => {
    return type === "deposito" ? "#10b981" : "#ef4444";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-start flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: `${getTypeColor(invoice.type)}20`,
            }}
          >
            <Ionicons
              name={getTypeIcon(invoice.type) as any}
              size={20}
              color={getTypeColor(invoice.type)}
            />
          </View>

          <View className="flex-1">
            <Text className="text-lg font-medium text-gray-800">
              {invoice.receiver_name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-500 text-sm">
                {new Date(invoice.date).toLocaleDateString("pt-BR")}
              </Text>
              <Text className="text-gray-400 mx-2">•</Text>
              <Text className="text-gray-500 text-sm">
                {getTypeDisplayName(invoice.type)}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={`text-lg font-bold ${
              invoice.type === "deposito" ? "text-green-500" : "text-red-500"
            }`}
          >
            {invoice.type === "deposito" ? "+ " : "- "}
            {formatCurrency(invoice.amount)}
          </Text>

          <View className="flex-row mt-2 space-x-2">
            <TouchableOpacity
              className="p-2 rounded-lg bg-blue-50"
              onPress={() => onEdit(invoice.id)}
            >
              <Ionicons name="pencil" size={16} color="#3b82f6" />
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2 rounded-lg bg-red-50 ml-4"
              onPress={() => onDelete(invoice)}
              disabled={deletingId === invoice.id}
            >
              {deletingId === invoice.id ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Ionicons name="trash" size={16} color="#ef4444" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
