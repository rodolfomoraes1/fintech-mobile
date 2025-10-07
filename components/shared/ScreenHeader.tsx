import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function ScreenHeader({ title, subtitle, onClose }: ScreenHeaderProps) {
  return (
    <View className="bg-dark pt-12 pb-4 px-6">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">{title}</Text>
          {subtitle && (
            <Text className="text-light text-sm mt-1">{subtitle}</Text>
          )}
        </View>

        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
