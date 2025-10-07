import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useInvoices } from "../../hooks/useInvoices";
import { InvoiceType } from "../../types";

export default function CreateTransactionScreen() {
  const { user } = useAuth();
  const { addInvoice, isLoading } = useInvoices(user?.id || null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    receiver_name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "deposito" as InvoiceType,
  });

  const updateField = (
    field: keyof typeof formData,
    value: string | InvoiceType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTransactionType = (type: InvoiceType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const validateForm = (): boolean => {
    if (!formData.receiver_name.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome do destinatário");
      return false;
    }

    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      Alert.alert("Erro", "Por favor, digite um valor válido");
      return false;
    }

    if (!formData.date) {
      Alert.alert("Erro", "Por favor, selecione uma data");
      return false;
    }

    return true;
  };

  const handleCreateTransaction = async () => {
    if (!validateForm()) return;

    try {
      const transactionData = {
        receiver_name: formData.receiver_name.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        user_id: user!.id,
      };

      const result = await addInvoice(transactionData);

      if (result.success) {
        Alert.alert("Sucesso", "Transação criada com sucesso!", [
          {
            text: "OK",
            onPress: () =>
              router.replace({
                pathname: "/(tabs)/transactions",
                params: { refresh: "true" },
              }),
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          result.error || "Não foi possível criar a transação"
        );
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado");
    }
  };

  return (
    <View className="flex-1 bg-bgColors-paleGreen pb-4">
      {/* Header */}
      <View className="bg-dark pt-12 pb-4 px-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">
              Nova Transação
            </Text>
            <Text className="text-light text-sm mt-1">
              Adicione uma nova transação financeira
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/transactions")}
            className="p-2"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Tipo de Transação - Versão Simplificada */}
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-medium mb-3">
            Tipo de Transação
          </Text>

          {/* Radio Button para Depósito */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200 mb-2"
            onPress={() => updateTransactionType("deposito")}
            disabled={isLoading}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
                formData.type === "deposito"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400"
              }`}
            >
              {formData.type === "deposito" && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            <Ionicons name="arrow-down-circle" size={20} color="#10b981" />
            <Text className="text-gray-800 font-medium ml-2">Depósito</Text>
          </TouchableOpacity>

          {/* Radio Button para Pagamento */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200 mb-2"
            onPress={() => updateTransactionType("pagamento")}
            disabled={isLoading}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
                formData.type === "pagamento"
                  ? "border-red-500 bg-red-500"
                  : "border-gray-400"
              }`}
            >
              {formData.type === "pagamento" && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            <Ionicons name="card" size={20} color="#ef4444" />
            <Text className="text-gray-800 font-medium ml-2">Pagamento</Text>
          </TouchableOpacity>

          {/* Radio Button para Transferência */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200"
            onPress={() => updateTransactionType("transferencia")}
            disabled={isLoading}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
                formData.type === "transferencia"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-400"
              }`}
            >
              {formData.type === "transferencia" && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            <Ionicons name="swap-horizontal" size={20} color="#3b82f6" />
            <Text className="text-gray-800 font-medium ml-2">
              Transferência
            </Text>
          </TouchableOpacity>
        </View>

        {/* Destinatário */}
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">
            Destinatário
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-4 text-gray-800 border border-gray-200"
            placeholder="Ex: Mercado, Empresa, Pessoa..."
            value={formData.receiver_name}
            onChangeText={(value) => updateField("receiver_name", value)}
            editable={!isLoading}
          />
        </View>

        {/* Valor */}
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">Valor</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
            <Text className="text-gray-500 text-lg mr-2">R$</Text>
            <TextInput
              className="flex-1 py-4 text-gray-800 text-lg"
              placeholder="0,00"
              value={formData.amount}
              onChangeText={(value) =>
                updateField("amount", value.replace(",", "."))
              }
              keyboardType="decimal-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Data */}
        <View className="mb-8">
          <Text className="text-gray-700 text-lg font-medium mb-2">Data</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-4 text-gray-800 border border-gray-200"
            value={formData.date}
            onChangeText={(value) => updateField("date", value)}
            placeholder="YYYY-MM-DD"
            editable={!isLoading}
          />
          <Text className="text-gray-500 text-sm mt-1">
            Formato: AAAA-MM-DD (use o teclado para editar)
          </Text>
        </View>

        {/* Botão Criar */}
        <TouchableOpacity
          className={`rounded-xl py-4 mb-6 ${
            isLoading ? "bg-primary/70" : "bg-primary"
          } shadow-lg`}
          onPress={handleCreateTransaction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Criar Transação
            </Text>
          )}
        </TouchableOpacity>

        {/* Informações */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-800 font-medium">Como funciona:</Text>
              <Text className="text-blue-600 text-sm mt-1">
                • <Text className="font-medium">Depósito</Text>: Adiciona valor
                ao seu saldo{"\n"}•{" "}
                <Text className="font-medium">Pagamento</Text>: Subtrai valor do
                seu saldo{"\n"}•{" "}
                <Text className="font-medium">Transferência</Text>: Subtrai
                valor do seu saldo
              </Text>
            </View>
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
