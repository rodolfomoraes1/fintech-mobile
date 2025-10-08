import { Image } from "expo-image";
import React from "react";
import { Dimensions, Platform, Text, View } from "react-native";
import { User } from "../../types";
import { UserAvatar } from "./UserAvatar";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  return (
    <View className={`${isWeb ? "flex-col" : "flex-row"} items-center`}>
      <View
        className={`flex-row items-center ${isWeb ? "mb-6 w-full justify-center" : "flex-1"}`}
      >
        <Image
          source={require("@/assets/images/favicon.png")}
          style={{
            width: isWeb ? 48 : width * 0.08,
            height: isWeb ? 48 : width * 0.08,
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
