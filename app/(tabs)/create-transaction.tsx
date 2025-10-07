import { FormInput } from "@/components/shared/FormInput";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { StorageWarning } from "@/components/shared/StorageWarning";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { TransactionTypeSelector } from "@/components/shared/TransactionTypeSelector";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useInvoices } from "../../hooks/useInvoices";
import { InvoiceType } from "../../types";

export default function CreateTransactionScreen() {
  const { user } = useAuth();
  const { addInvoice } = useInvoices(user?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    receiver_name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "deposito" as InvoiceType,
  });

  useEffect(() => {
    setFormData({
      receiver_name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "deposito",
    });
    setReceiptImage(null);
  }, []);

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

  const handleCreateTransaction = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setIsLoading(true);

      const now = new Date().toISOString();
      const transactionData = {
        receiver_name: formData.receiver_name.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        user_id: user.id,
        receipt_url: "",
        created_at: now,
        updated_at: now,
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
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bgColors-paleGreen pb-4">
      <ScreenHeader
        title="Nova Transação"
        subtitle="Adicione uma nova transação financeira"
        onClose={() => router.replace("/(tabs)/transactions")}
      />

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
            onPress={handleCreateTransaction}
            isLoading={isLoading}
            title="Criar Transação"
          />
        </View>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
