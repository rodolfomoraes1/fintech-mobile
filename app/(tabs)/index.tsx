import { UserAvatar } from "@/components/UserAvatar";
import { useBalance } from "@/hooks/useBalance";
import { useInvoices } from "@/hooks/useInvoices";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { width } = Dimensions.get("window");
  const {
    currentBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useBalance(user?.id || null);
  const {
    invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useInvoices(user?.id || null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    invoices.forEach((invoice) => {
      if (invoice.type === "deposito") {
        totalIncome += invoice.amount;
      } else {
        totalExpense += invoice.amount;
      }
    });

    return { totalIncome, totalExpense };
  };

  const { totalIncome, totalExpense } = calculateTotals();

  const getTypeDisplayName = (type: string) => {
    const types = {
      deposito: "Depósito",
      transferencia: "Transferência",
      pagamento: "Pagamento",
    };
    return types[type as keyof typeof types] || type;
  };

  console.log("User no Dashboard:", user?.email);
  console.log("Current Balance:", currentBalance);
  console.log("Invoices count:", invoices.length);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-dark pt-12 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          {/* Nome do Usuário e Logo */}
          <View className="flex-row items-center flex-1">
            <Image
              source={require("@/assets/images/favicon.png")}
              style={{
                width: width * 0.08,
                height: width * 0.08,
                resizeMode: "contain",
                marginRight: 12,
              }}
            />
            <View>
              <Text className="text-white text-lg">Olá,</Text>
              <Text className="text-white text-xl font-bold">
                {user?.name || "Usuário"}
              </Text>
            </View>
          </View>

          {/* Avatar com Menu */}
          <UserAvatar user={user} />
        </View>

        {/* Card do Saldo */}
        <View className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-gray-500 text-lg">Saldo Total</Text>

          {balanceLoading ? (
            <View className="flex-row items-center mt-2">
              <ActivityIndicator size="small" color="#47A138" />
              <Text className="text-gray-500 ml-2">Carregando saldo...</Text>
            </View>
          ) : balanceError ? (
            <Text className="text-red-500 text-lg mt-2">
              Erro ao carregar saldo
            </Text>
          ) : (
            <>
              <Text className="text-3xl font-bold text-gray-800 mt-2">
                {formatCurrency(currentBalance)}
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
      </View>

      {/* Lista de Transações */}
      <ScrollView className="flex-1 px-6 bg-bgColors-paleGreen">
        <Text className="text-xl font-bold text-gray-800 mb-4 mt-4">
          Transações Recentes
        </Text>

        {invoicesLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#47A138" />
            <Text className="text-gray-500 mt-2">Carregando transações...</Text>
          </View>
        ) : invoicesError ? (
          <View className="items-center py-8">
            <Text className="text-red-500">Erro ao carregar transações</Text>
            <Text className="text-gray-500 text-sm mt-1">{invoicesError}</Text>
          </View>
        ) : invoices.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-gray-500 text-lg">
              Nenhuma transação encontrada
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Suas transações aparecerão aqui
            </Text>
          </View>
        ) : (
          invoices.map((invoice) => (
            <View
              key={invoice.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-start">
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
                <Text
                  className={`text-lg font-bold ${
                    invoice.type === "deposito"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {invoice.type === "deposito" ? "+ " : "- "}
                  {formatCurrency(invoice.amount)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* REMOVER BOTÃO DE SAIR ANTIGO */}

      <StatusBar style="light" />
    </View>
  );
}
