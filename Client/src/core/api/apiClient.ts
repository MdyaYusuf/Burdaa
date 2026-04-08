import * as SecureStore from 'expo-secure-store';
import { ReturnModel } from '../types/ApiResponse';
import Toast from 'react-native-toast-message';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ReturnModel<T>> {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      
      const result: ReturnModel<T> = await response.json();

      // Handling backend defined errors
      if (!result.success) {
        if (response.status === 401) {
          console.warn("Unauthorized: Clearing session...");
          // Future: Logic to clear SecureStore and redirect to login
        }

        // Handle Validation Errors
        if (result.errors && result.errors.length > 0) {
          Toast.show({
            type: 'error',
            text1: 'Validasyon Hatası',
            text2: result.errors.join('\n'),
          });
        } 
        // Handle Business Exceptions
        else if (result.message) {
          Toast.show({
            type: 'error',
            text1: 'İşlem Başarısız',
            text2: result.message,
          });
        }
      }

      return result;
    } catch (error) {
      console.error("Network Error:", error);
      const networkError = {
        success: false,
        message: 'Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.',
        data: null,
        statusCode: 500
      };

      Toast.show({
        type: 'error',
        text1: 'Bağlantı Hatası',
        text2: networkError.message,
      });

      return networkError;
    }
  }
};