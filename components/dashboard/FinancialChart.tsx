import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

interface FinancialChartProps {
  isVisible: boolean;
  onToggle: () => void;
  animation: Animated.Value;
  data: Array<{
    name: string;
    value: number;
    color: string;
    legendFontColor: string;
  }>;
  isLoading: boolean;
  hasError: boolean;
}

export function FinancialChart({
  isVisible,
  onToggle,
  animation,
  data,
  isLoading,
  hasError,
}: FinancialChartProps) {
  const { width } = Dimensions.get("window");

  return (
    <View className="bg-white">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row justify-between items-center px-6 py-4"
      >
        <Text className="text-xl font-bold text-gray-800">
          Resumo Financeiro
        </Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons name="chevron-down" size={24} color="#4B5563" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
      >
        {isVisible && (
          <View className="px-6 pb-4">
            {!isLoading && !hasError && (
              <PieChart
                data={data}
                width={width - 32}
                height={200}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
