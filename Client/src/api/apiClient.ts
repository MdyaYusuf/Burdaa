import * as SecureStore from 'expo-secure-store';
import { ReturnModel } from '../types/ApiResponse';

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
      
      if (response.status === 401) {
        console.warn("Token expired or unauthorized");
      }

      return await response.json();
    } catch (error) {
      console.error("Network Error:", error);
      return {
        success: false,
        message: 'Sunucuya bağlanılamadı. Lütfen internetinizi ve IP adresinizi kontrol edin.',
        data: null,
        statusCode: 500
      };
    }
  }
};