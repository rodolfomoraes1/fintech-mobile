import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Erro", "Por favor, digite sua senha");
      return false;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, digite um e-mail válido");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail("demo@email.com");
    setPassword("123456");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-green-500 rounded-2xl justify-center items-center mb-4">
            <Text className="text-white font-bold text-2xl">💰</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800">Finance App</Text>
          <Text className="text-gray-500 mt-2">Controle suas finanças</Text>
        </View>

        <Text className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login
        </Text>

        <View className="space-y-4">
          {/* Campo Email */}
          <View>
            <Text className="text-gray-700 mb-2 font-medium">E-mail</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Senha</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity
            className={`rounded-lg py-4 mt-6 ${
              isLoading ? "bg-green-400" : "bg-green-500"
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* Botão Demo */}
          <TouchableOpacity
            className="border border-green-500 rounded-lg py-4 mt-2"
            onPress={handleDemoLogin}
            disabled={isLoading}
          >
            <Text className="text-green-500 text-center font-bold text-lg">
              Usar Dados de Demo
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-500 mt-8">
          Versão 1.0 - Finance App
        </Text>
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}
