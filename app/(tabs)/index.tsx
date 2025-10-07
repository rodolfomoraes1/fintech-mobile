import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { useBalance } from "@/hooks/useBalance";
import { useInvoices } from "@/hooks/useInvoices";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    currentBalance,
    isLoading: balanceLoading,
    error: balanceError,
    refreshBalance,
  } = useBalance(user?.id || null);
  const {
    invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refreshInvoices,
  } = useInvoices(user?.id || null);

  const [isChartVisible, setIsChartVisible] = useState(true);
  const animation = useState(new Animated.Value(1))[0];

  const refreshData = async () => {
    try {
      await Promise.all([refreshBalance(), refreshInvoices()]);
    } catch (error) {
      // Erro tratado pelos hooks individuais
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  useEffect(() => {
    refreshData();
  }, []);

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    invoices.forEach((invoice) => {
      if (invoice.type === "deposito") {
        totalIncome += invoice.amount;
      } else {
        totalExpense += invoice.amount;
      }
    });

    return { totalIncome, totalExpense };
  };

  const { totalIncome, totalExpense } = calculateTotals();

  const getChartData = () => {
    return [
      {
        name: "Receitas",
        value: totalIncome,
        color: "#10b981",
        legendFontColor: "#7F7F7F",
      },
      {
        name: "Despesas",
        value: totalExpense,
        color: "#ef4444",
        legendFontColor: "#7F7F7F",
      },
    ];
  };

  const toggleChart = () => {
    const toValue = isChartVisible ? 0 : 1;
    setIsChartVisible(!isChartVisible);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-dark pt-12 pb-6 px-6">
        <DashboardHeader user={user} />
        <BalanceCard
          balance={currentBalance}
          isLoading={balanceLoading}
          error={balanceError}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />
      </View>

      <FinancialChart
        isVisible={isChartVisible}
        onToggle={toggleChart}
        animation={animation}
        data={getChartData()}
        isLoading={balanceLoading}
        hasError={!!balanceError}
      />

      <ScrollView className="flex-1 px-6 bg-bgColors-paleGreen">
        <TransactionsList
          isLoading={invoicesLoading}
          error={invoicesError}
          transactions={invoices}
        />
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}
