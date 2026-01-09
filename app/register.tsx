import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { InputValidator } from "../infrastructure/security/InputValidator";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const { signUp, isLoading: authLoading } = useAuth();

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validations = {
    name: () => {
      const result = InputValidator.validateName(formData.name);
      return result.valid ? null : result.error;
    },
    email: () => {
      const result = InputValidator.validateEmail(formData.email);
      return result.valid ? null : result.error;
    },
    password: () => {
      const result = InputValidator.validatePassword(formData.password);
      return result.valid ? null : result.error;
    },
    confirmPassword: () => {
      if (formData.password !== formData.confirmPassword)
        return "As senhas não coincidem";
      return null;
    },
  };

  const validateForm = (): boolean => {
    const errors = Object.entries(validations)
      .map(([field, validation]) => validation())
      .filter((error) => error !== null);

    if (errors.length > 0) {
      Alert.alert("Erro no formulário", errors[0]);
      return false;
    }
    return true;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      const { error } = await signUp(
        formData.name,
        formData.email,
        formData.password
      );

      if (error) {
        Alert.alert("Erro", error);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-bgColors-paleGreen"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-8 py-8">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            width: width * 0.5,
            height: width * 0.5,
            alignSelf: "center",
            resizeMode: "contain",
          }}
        />

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">
              Nome Completo
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="Seu nome completo"
                value={formData.name}
                onChangeText={(value) => updateField("name", value)}
                editable={!isLoading}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-gray-700 mb-2 font-medium">E-mail</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="seu@email.com"
                value={formData.email}
                onChangeText={(value) => updateField("email", value)}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-gray-700 mb-2 font-medium">Senha</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="Sua senha"
                value={formData.password}
                onChangeText={(value) => updateField("password", value)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs mt-1">
              Mínimo 6 caracteres
            </Text>
          </View>

          <View className="mt-2">
            <Text className="text-gray-700 mb-2 font-medium">
              Confirmar Senha
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField("confirmPassword", value)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity
            className={`rounded-lg py-4 mt-6 ${
              isLoading ? "bg-green-400" : "bg-green-500"
            } shadow-lg`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? "Criando conta..." : "Criar minha conta"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Já tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              disabled={isLoading}
            >
              <Text className="text-green-500 font-bold">Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}
