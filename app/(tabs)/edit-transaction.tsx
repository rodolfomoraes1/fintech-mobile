import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { invoiceService } from "../../services/invoiceService";
import { InvoiceType } from "../../types";

export default function EditTransactionScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    receiver_name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "deposito" as InvoiceType,
    user_id: user?.id || "",
    receipt_url: "",
  });

  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const loadInvoice = async () => {
    if (!user?.id || !params.id) {
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const result = await invoiceService.getInvoiceById(
        user.id,
        params.id as string
      );

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
    } catch (error) {
      console.error("Erro ao carregar transação:", error);
      Alert.alert("Erro", "Erro ao carregar transação");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [params.id]);

  const updateField = (
    field: keyof typeof formData,
    value: string | InvoiceType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.receiver_name.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome do beneficiário");
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const handleUpdateTransaction = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setIsLoading(true);

      // Firebase Storage upload commented due to location restrictions
      // let receiptUrl = formData.receipt_url;
      // if (receiptImage && receiptImage !== formData.receipt_url) {
      //   const uploadResult = await storageService.uploadReceipt(
      //     user.id,
      //     formData.id,
      //     receiptImage
      //   );
      //
      //   if (uploadResult.error) {
      //     throw new Error(uploadResult.error);
      //   }
      //   receiptUrl = uploadResult.url ?? "";
      // }

      const result = await invoiceService.updateInvoice(user.id, formData.id, {
        receiver_name: formData.receiver_name,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        receipt_url: "", // Set empty as Storage is not available
      });

      if (result.success) {
        Alert.alert("Sucesso", "Transação atualizada com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              router.replace({
                pathname: "/(tabs)/transactions",
                params: { refresh: "true" },
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          result.error || "Não foi possível atualizar a transação"
        );
      }
    } catch (error: any) {
      console.error("Erro ao atualizar transação:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bgColors-paleGreen">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bgColors-paleGreen pb-4">
      {/* Header */}
      <View className="bg-dark pt-12 pb-4 px-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">
              Editar Transação
            </Text>
            <Text className="text-light text-sm mt-1">
              Modifique os dados da transação
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
        {/* Firebase Storage Warning */}
        <View className="mb-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <View className="flex-row items-start">
            <Ionicons name="warning" size={20} color="#EAB308" />
            <View className="ml-3 flex-1">
              <Text className="text-yellow-800 font-medium">
                Aviso Importante
              </Text>
              <Text className="text-yellow-700 text-sm mt-1">
                O upload de comprovantes está temporariamente indisponível. O
                Firebase Storage não pôde ser configurado devido a restrições de
                localização no plano gratuito.
              </Text>
            </View>
          </View>
        </View>

        {/* Tipo de Transação - Versão Simplificada */}
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-medium mb-3">
            Tipo de Transação
          </Text>

          {/* Radio Button para Depósito */}
          <TouchableOpacity
            className="flex-row items-center py-3 px-4 bg-white rounded-xl border border-gray-200 mb-2"
            onPress={() => updateField("type", "deposito")}
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
            onPress={() => updateField("type", "pagamento")}
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
            onPress={() => updateField("type", "transferencia")}
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

        {/* Upload de Recibo - Apenas visualização local */}
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-medium mb-2">
            Comprovante (apenas visualização)
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            disabled={isLoading}
            className="bg-white rounded-xl p-4 border border-gray-200 items-center"
          >
            {receiptImage ? (
              <View className="w-full items-center">
                <Image
                  source={{ uri: receiptImage }}
                  className="w-32 h-32 rounded-lg mb-2"
                />
                <Text className="text-primary">Trocar imagem</Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="receipt-outline" size={32} color="#6b7280" />
                <Text className="text-gray-500 mt-2">
                  Toque para adicionar um comprovante
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  (Apenas visualização local)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Botão Atualizar */}
        <TouchableOpacity
          className={`rounded-xl py-4 mb-6 ${
            isLoading ? "bg-primary/70" : "bg-primary"
          } shadow-lg`}
          onPress={handleUpdateTransaction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Atualizar Transação
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
