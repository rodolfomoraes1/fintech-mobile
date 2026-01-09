import { Alert } from "react-native";
import { SecureStorageService } from "./SecureStorageService";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

export class AuthTokenService {
  static async setToken(token: string): Promise<void> {
    await SecureStorageService.setSecure(TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return await SecureStorageService.getSecure(TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await SecureStorageService.removeSecure(TOKEN_KEY);
  }

  static async setRefreshToken(token: string): Promise<void> {
    await SecureStorageService.setSecure(REFRESH_TOKEN_KEY, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await SecureStorageService.getSecure(REFRESH_TOKEN_KEY);
  }

  static async setUserData(userData: any): Promise<void> {
    const jsonString = JSON.stringify(userData);
    await SecureStorageService.setSecure(USER_DATA_KEY, jsonString);
  }

  static async getUserData(): Promise<any | null> {
    const jsonString = await SecureStorageService.getSecure(USER_DATA_KEY);
    if (!jsonString) return null;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer parse dos dados");
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      SecureStorageService.removeSecure(REFRESH_TOKEN_KEY),
      SecureStorageService.removeSecure(USER_DATA_KEY),
    ]);
  }
}
