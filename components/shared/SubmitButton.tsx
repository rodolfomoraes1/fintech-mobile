import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface SubmitButtonProps {
  onPress: () => void;
  isLoading: boolean;
  title: string;
  loadingTitle?: string;
}

export function SubmitButton({
  onPress,
  isLoading,
  title,
  loadingTitle,
}: SubmitButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-xl py-4 ${
        isLoading ? "bg-primary/70" : "bg-primary"
      } shadow-lg`}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text className="text-white text-center font-bold text-lg">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
