import { Tabs } from "expo-router";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transações",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name="swap-horizontal-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create-transaction"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="edit-transaction"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
