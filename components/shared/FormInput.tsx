import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  helpText?: string;
  prefix?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  helpText,
  prefix,
  disabled,
  ...props
}: FormInputProps) {
  return (
    <View className="mb-6">
      <Text className="text-gray-700 text-lg font-medium mb-2">{label}</Text>

      <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
        {prefix && <Text className="text-gray-500 text-lg mr-2">{prefix}</Text>}
        <TextInput
          className="flex-1 py-4 text-gray-800 text-lg"
          editable={!disabled}
          {...props}
        />
      </View>

      {helpText && (
        <Text className="text-gray-500 text-sm mt-1">{helpText}</Text>
      )}
    </View>
  );
}
