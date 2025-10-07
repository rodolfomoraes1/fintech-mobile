import { Image } from "expo-image";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { User } from "../../types";
import { UserAvatar } from "./UserAvatar";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { width } = Dimensions.get("window");

  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center flex-1">
        <Image
          source={require("@/assets/images/favicon.png")}
          style={{
            width: width * 0.08,
            height: width * 0.08,
            resizeMode: "contain",
            marginRight: 12,
          }}
        />
        <View>
          <Text className="text-white text-lg">Olá,</Text>
          <Text className="text-white text-xl font-bold">
            {user?.name || "Usuário"}
          </Text>
        </View>
      </View>
      <UserAvatar user={user} />
    </View>
  );
}
