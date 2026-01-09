import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Alert, Platform } from "react-native";

const ENCRYPTION_KEY = "fintech-mobile-secret-key-2026";

export class SecureStorageService {
  static async setSecure(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar dado seguro");
      throw error;
    }
  }

  static async getSecure(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao recuperar dado seguro");
      return null;
    }
  }

  static async removeSecure(key: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao remover dado seguro");
    }
  }

  static async hash(text: string): Promise<string> {
    try {
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        text
      );
    } catch (error) {
      Alert.alert("Erro", "Erro ao gerar hash");
      throw error;
    }
  }

  static generateUUID(): string {
    return Crypto.randomUUID();
  }
}
