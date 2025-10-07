import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface ImageUploaderProps {
  image: string | null;
  onImageSelect: (uri: string) => void;
  disabled?: boolean;
}

export function ImageUploader({
  image,
  onImageSelect,
  disabled = false,
}: ImageUploaderProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelect(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={disabled}
      className="bg-white rounded-xl p-4 border border-gray-200 items-center"
    >
      {image ? (
        <View className="w-full items-center">
          <Image
            source={{ uri: image }}
            className="w-32 h-32 rounded-lg mb-2"
          />
          <Text className="text-primary">Trocar imagem</Text>
        </View>
      ) : (
        <View className="items-center">
          <Ionicons name="receipt-outline" size={32} color="#6b7280" />
          <Text className="text-gray-500 mt-2">
            Toque para adicionar um comprovante
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            (Apenas visualização local)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
