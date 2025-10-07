import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const { user, signIn, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Erro", "Por favor, digite sua senha");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, digite um e-mail válido");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const { error } = await signIn(email, password);

      if (error) {
        Alert.alert("Erro", error);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bgColors-paleGreen"
    >
      <View className="flex-1 justify-center px-8">
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
                editable={!authLoading}
              />
            </View>
          </View>

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
                editable={!authLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={authLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`rounded-lg py-4 mt-6 ${
              authLoading ? "bg-secondary" : "bg-primary"
            }`}
            onPress={handleLogin}
            disabled={authLoading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {authLoading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-green-500 font-bold">Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}
