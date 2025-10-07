import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

  const handleCreateTransaction = () => {
    router.push("../create-transaction");
  };

  const handleEditTransaction = (invoiceId: string) => {
    Alert.alert("Editar Transação", `Editar transação: ${invoiceId}`);
  };

  // ✅ FUNÇÃO REAL DE EXCLUSÃO
  const handleDeleteTransaction = (invoice: any) => {
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

  return (
    <View className="flex-1 bg-bgColors-paleGreen">
      {/* Header */}
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
            onPress={handleCreateTransaction}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Estatísticas Rápidas */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-500 text-sm">Total de Transações</Text>
              <Text className="text-2xl font-bold text-gray-800">
                {invoices.length}
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons name="refresh" size={16} color="#47A138" />
              <Text className="text-primary font-medium ml-2">
                {refreshing ? "Atualizando..." : "Atualizar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Transações */}
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
              <View
                key={invoice.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-start">
                  {/* Informações da Transação */}
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

                  {/* Valor e Ações */}
                  <View className="items-end">
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

                    {/* Botões de Ação */}
                    <View className="flex-row mt-2 space-x-2">
                      <TouchableOpacity
                        className="p-2 rounded-lg bg-blue-50"
                        onPress={() => handleEditTransaction(invoice.id!)}
                      >
                        <Ionicons name="pencil" size={16} color="#3b82f6" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="p-2 rounded-lg bg-red-50 ml-4"
                        onPress={() => handleDeleteTransaction(invoice)}
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
            ))}
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
