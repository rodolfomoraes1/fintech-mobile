import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-green-500 justify-center items-center">
      <View className="w-24 h-24 bg-white rounded-2xl justify-center items-center mb-4">
        <Text className="text-green-500 font-bold text-3xl">💰</Text>
      </View>
      <Text className="text-white text-2xl font-bold mt-4">Finance App</Text>
      <Text className="text-green-200 mt-2">Controle suas finanças</Text>
    </View>
  );
}
