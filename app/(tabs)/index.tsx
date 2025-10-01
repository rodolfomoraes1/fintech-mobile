import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-500 pt-12 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Finanças</Text>
          <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Saldo */}
        <View className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-gray-500 text-lg">Saldo Total</Text>
          <Text className="text-3xl font-bold text-gray-800 mt-2">
            R$ 5.250,00
          </Text>
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="text-green-500 font-bold">R$ 2.500,00</Text>
              <Text className="text-gray-500 text-sm">Receitas</Text>
            </View>
            <View>
              <Text className="text-red-500 font-bold">R$ 750,00</Text>
              <Text className="text-gray-500 text-sm">Despesas</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView className="flex-1 px-6 mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Transações Recentes
        </Text>

        {/* Lista de transações */}
        {[
          {
            id: 1,
            name: "Salário",
            amount: "R$ 2.500,00",
            type: "income",
            date: "10/12/2023",
          },
          {
            id: 2,
            name: "Mercado",
            amount: "R$ 350,00",
            type: "expense",
            date: "09/12/2023",
          },
          {
            id: 3,
            name: "Aluguel",
            amount: "R$ 1.200,00",
            type: "expense",
            date: "08/12/2023",
          },
          {
            id: 4,
            name: "Freelance",
            amount: "R$ 800,00",
            type: "income",
            date: "05/12/2023",
          },
        ].map((transaction) => (
          <View
            key={transaction.id}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-medium text-gray-800">
                  {transaction.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {transaction.date}
                </Text>
              </View>
              <Text
                className={`text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.amount}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão de Logout */}
      <View className="px-6 pb-6">
        <Link href="/login" asChild>
          <TouchableOpacity className="bg-red-500 rounded-lg py-4">
            <Text className="text-white text-center font-bold text-lg">
              Sair
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <StatusBar style="light" />
    </View>
  );
}
