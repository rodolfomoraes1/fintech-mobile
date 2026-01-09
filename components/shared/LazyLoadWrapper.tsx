import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
}) => {
  const defaultFallback = (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};
