import { FormInput } from "@/components/shared/FormInput";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { StorageWarning } from "@/components/shared/StorageWarning";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { TransactionTypeSelector } from "@/components/shared/TransactionTypeSelector";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useInvoices } from "../../hooks/useInvoices";
import { InvoiceType } from "../../types";

export default function EditTransactionScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getInvoiceById, updateInvoice } = useInvoices(user?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    receiver_name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "deposito" as InvoiceType,
    user_id: user?.id || "",
    receipt_url: "",
  });

  const loadInvoice = async () => {
    if (!user?.id || !params.id) {
      router.back();
      return;
    }

    try {
      setIsLoadingData(true);
      const result = await getInvoiceById(params.id as string);

      if (result.error || !result.data) {
        Alert.alert("Erro", "Não foi possível carregar a transação");
        router.back();
        return;
      }

      setFormData({
        id: result.data.id,
        receiver_name: result.data.receiver_name,
        amount: result.data.amount.toString(),
        date: result.data.date,
        type: result.data.type as InvoiceType,
        user_id: result.data.user_id,
        receipt_url: result.data.receipt_url || "",
      });

      if (result.data.receipt_url) {
        setReceiptImage(result.data.receipt_url);
      }
    } catch (error: any) {
      Alert.alert("Erro", "Erro ao carregar transação");
      router.back();
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.id && params.id) {
      loadInvoice();
    }
  }, [params.id, user?.id]);

  const updateField = (
    field: keyof typeof formData,
    value: string | InvoiceType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleUpdateTransaction = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setIsLoading(true);

      const result = await updateInvoice(formData.id, {
        receiverName: formData.receiver_name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        receiptUrl: "",
      });

      if (result.success) {
        console.log("Transação atualizada com sucesso");
        Alert.alert("Sucesso", "Transação atualizada com sucesso!", [
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
        if (
          result.error?.includes("permission") ||
          result.error?.includes("Missing or insufficient permissions")
        ) {
          Alert.alert(
            "Sessão Expirada",
            "Sua sessão expirou. Por favor, faça login novamente.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/login"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Erro",
            result.error || "Não foi possível atualizar a transação"
          );
        }
      }
    } catch (error: any) {
      if (
        error.message?.includes("permission") ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        Alert.alert(
          "Sessão Expirada",
          "Sua sessão expirou. Por favor, faça login novamente.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ]
        );
      } else {
        Alert.alert("Erro", error.message || "Ocorreu um erro inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bgColors-paleGreen pb-4">
      <ScreenHeader
        title="Editar Transação"
        subtitle="Modifique os dados da transação"
        onClose={() => router.replace("/(tabs)/transactions")}
      />

      {isLoadingData ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-600 mt-4">Carregando dados...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6">
          <StorageWarning />

          <TransactionTypeSelector
            selectedType={formData.type}
            onTypeSelect={(type) => updateField("type", type)}
            disabled={isLoading}
          />

          <FormInput
            label="Destinatário"
            value={formData.receiver_name}
            onChangeText={(value) => updateField("receiver_name", value)}
            placeholder="Ex: Mercado, Empresa, Pessoa..."
            disabled={isLoading}
          />

          <FormInput
            label="Valor"
            value={formData.amount}
            onChangeText={(value) =>
              updateField("amount", value.replace(",", "."))
            }
            placeholder="0,00"
            keyboardType="decimal-pad"
            prefix="R$"
            disabled={isLoading}
          />

          <FormInput
            label="Data"
            value={formData.date}
            onChangeText={(value) => updateField("date", value)}
            placeholder="YYYY-MM-DD"
            helpText="Formato: AAAA-MM-DD (use o teclado para editar)"
            disabled={isLoading}
          />

          <ImageUploader
            image={receiptImage}
            onImageSelect={setReceiptImage}
            disabled={isLoading}
          />

          <View className="mt-4">
            <SubmitButton
              onPress={handleUpdateTransaction}
              isLoading={isLoading}
              title="Atualizar Transação"
            />
          </View>

          <View className="h-6" />
        </ScrollView>
      )}
    </View>
  );
}
