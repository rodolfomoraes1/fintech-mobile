import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useInvoices } from "../../hooks/useInvoices";

export default function TransactionsScreen() {
  const { user } = useAuth();
  const { invoices, isLoading, error, refreshInvoices, deleteInvoice } =
    useInvoices(user?.id || null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleCreateTransaction = () => {
    router.push("/(tabs)/create-transaction");
  };

  const handleEditTransaction = (invoiceId: string) => {
    router.push({
      pathname: "/edit-transaction",
      params: { id: invoiceId },
    });
  };

  const handleDeleteTransaction = async (invoice: any) => {
    Alert.alert(
      "Excluir Transação",
      `Tem certeza que deseja excluir a transação "${invoice.receiver_name}" no valor de ${formatCurrency(invoice.amount)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!invoice.id) return;

            setDeletingId(invoice.id);
            try {
              const result = await deleteInvoice(
                invoice.id,
                invoice.amount,
                invoice.type
              );

              if (result.success) {
                Alert.alert("Sucesso", "Transação excluída com sucesso!");
              } else {
                Alert.alert(
                  "Erro",
                  result.error || "Não foi possível excluir a transação"
                );
              }
            } catch (error) {
              Alert.alert("Erro", "Ocorreu um erro ao excluir a transação");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshInvoices();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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

  useEffect(() => {
    if (params.refresh === "true") {
      handleRefresh();
    }
  }, [params.refresh]);

  return (
    <View className="flex-1 bg-bgColors-paleGreen">
      <TransactionHeader onCreateTransaction={handleCreateTransaction} />

      <ScrollView className="flex-1 px-6 pt-6">
        <TransactionStats
          total={invoices.length}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />

        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#47A138" />
            <Text className="text-gray-500 mt-4">Carregando transações...</Text>
          </View>
        ) : error ? (
          <View className="items-center py-12">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text className="text-red-500 text-lg mt-4">Erro ao carregar</Text>
            <Text className="text-gray-500 text-center mt-2">{error}</Text>
            <TouchableOpacity
              className="bg-primary rounded-lg px-6 py-3 mt-4"
              onPress={handleRefresh}
            >
              <Text className="text-white font-medium">Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : invoices.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={64} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Nenhuma transação encontrada
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Clique no botão abaixo ou no botão + para adicionar sua primeira
              transação
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-lg px-6 py-3 mt-6"
              onPress={handleCreateTransaction}
            >
              <Text className="text-white font-medium">
                Criar primeira transação
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {invoices.map((invoice) => (
              <TransactionItem
                key={invoice.id}
                invoice={invoice}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                deletingId={deletingId}
              />
            ))}
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
