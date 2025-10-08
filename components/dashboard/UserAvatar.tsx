import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

interface UserAvatarProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const handleLogout = async () => {
    setIsMenuOpen(false);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const MenuItems = () => (
    <>
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
        onPress={() => {
          setIsMenuOpen(false);
          Alert.alert("Perfil", "Funcionalidade em desenvolvimento");
        }}
      >
        <Ionicons name="person-outline" size={18} color="#6b7280" />
        <Text className="text-gray-700 ml-3">Meu Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
        onPress={() => {
          setIsMenuOpen(false);
          Alert.alert("Configurações", "Funcionalidade em desenvolvimento");
        }}
      >
        <Ionicons name="settings-outline" size={18} color="#6b7280" />
        <Text className="text-gray-700 ml-3">Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center px-4 py-3 hover:bg-red-50 active:bg-red-100"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text className="text-red-500 font-medium ml-3">Sair</Text>
      </TouchableOpacity>
    </>
  );

  if (isWeb) {
    return null;
  }

  return (
    <View className="relative">
      <TouchableOpacity
        className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg border border-primary/20"
        onPress={() => setIsMenuOpen(!isMenuOpen)}
      >
        <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-2">
          <Text className="text-white font-bold text-sm">
            {user ? getInitials(user.name) : "U"}
          </Text>
        </View>
        <Ionicons
          name={isMenuOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#47A138"
        />
      </TouchableOpacity>

      {isMenuOpen && (
        <>
          <View className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 min-w-48 z-50">
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="font-semibold text-gray-800 text-base">
                {user?.name || "Usuário"}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {user?.email || ""}
              </Text>
            </View>
            <MenuItems />
          </View>

          <TouchableOpacity
            className="absolute inset-0 -top-4 -bottom-4 -left-4 -right-4"
            onPress={() => setIsMenuOpen(false)}
          />
        </>
      )}
    </View>
  );
};
