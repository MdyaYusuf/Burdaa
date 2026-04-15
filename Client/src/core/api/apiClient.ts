import * as SecureStore from 'expo-secure-store';
import { ReturnModel } from '../types/ApiResponse';
import { TokenResponseDto } from '../../features/auth/types/Authentication';
import Toast from 'react-native-toast-message';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// This prevents multiple refresh calls from firing at the same time
let isRefreshing = false;

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false // Flag to prevent infinite loops
  ): Promise<ReturnModel<T>> {

    const accessToken = await SecureStore.getItemAsync('accessToken');
    const method = options.method?.toUpperCase() || 'GET';

    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const config: RequestInit = { ...options, headers };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized: Token Expired
      if (response.status === 401 && !isRetry && !endpoint.includes('auth/login')) {
        const refreshResult = await this.handleTokenRefresh();

        if (refreshResult) {
          // Retry the original request with the new token
          return this.request<T>(endpoint, options, true);
        } else {
          // Refresh failed so user must log in again
          return {
            success: false,
            message: 'Oturum süreniz doldu, lütfen tekrar giriş yapın.',
            data: null,
            statusCode: 401
          };
        }
      }

      const result: ReturnModel<T> = await response.json();

      // Global Success Handling
      if (result.success && result.message && method !== 'GET') {
        Toast.show({
          type: 'success',
          text1: 'Başarılı',
          text2: result.message,
        });
      }

      // Global Failure Handling
      if (!result.success) {
        this.handleFailure(result);
      }

      return result;
    } catch (error) {

      return this.handleNetworkError(error);
    }
  },

  // The Token Refresh Logic
  async handleTokenRefresh(): Promise<boolean> {

    if (isRefreshing) {

      return false;
    }
    isRefreshing = true;

    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (!refreshToken) {
        throw new Error("Refresh token bulunamadı.");
      }

      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refreshToken),
      });

      const result: ReturnModel<TokenResponseDto> = await response.json();

      if (result.success && result.data) {
        await SecureStore.setItemAsync('accessToken', result.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', result.data.refreshToken);
        await SecureStore.setItemAsync('user', JSON.stringify(result.data.user));

        isRefreshing = false;
        return true;
      }

      throw new Error("Refresh failed on server");
    } catch (e) {
      console.error("Token Refresh Error:", e);
      // Clear storage on hard failure so app redirects to login
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');

      Toast.show({
        type: 'error',
        text1: 'Oturum Hatası',
        text2: 'Oturumunuzun süresi doldu, lütfen tekrar giriş yapın.',
      });

      isRefreshing = false;
      return false;
    }
  },

  handleFailure(result: ReturnModel<any>) {

    if (result.errors && result.errors.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Validasyon Hatası',
        text2: result.errors.join('\n'),
      });
    } else if (result.message) {
      Toast.show({
        type: 'error',
        text1: 'İşlem Başarısız',
        text2: result.message,
      });
    }
  },

  handleNetworkError<T>(error: unknown): ReturnModel<T> {
    console.error("Network Error:", error);

    Toast.show({
      type: 'error',
      text1: 'Bağlantı Hatası',
      text2: 'Sunucuya bağlanılamadı.',
    });

    return {
      success: false,
      message: 'Network Error',
      data: null as T,
      statusCode: 500
    };
  }
};