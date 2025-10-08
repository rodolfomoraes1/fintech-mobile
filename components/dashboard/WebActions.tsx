import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export function WebActions() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut(router);
        },
      },
    ]);
  };

  return (
    <View className="flex-row justify-end items-center py-1 px-1 bg-white/50 border-b border-gray-100/50">
      <TouchableOpacity
        className="flex-row items-center bg-red-500/5 hover:bg-red-500/10 px-2.5 py-2 rounded-lg border border-red-500/10"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={16} color="#ef4444" />
        <Text className="text-red-500 font-medium ml-1.5 text-xs">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
