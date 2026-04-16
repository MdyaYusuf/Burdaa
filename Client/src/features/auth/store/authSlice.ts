import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../../core/api/apiClient';
import {
  UserResponseDto,
  RegisterUserRequest,
  LoginRequest,
  TokenResponseDto
} from '../types/Authentication';
import * as SecureStore from 'expo-secure-store';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterUserRequest, { rejectWithValue }) => {
    const result = await apiClient.request<TokenResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      await SecureStore.setItemAsync('accessToken', result.data.accessToken);
      await SecureStore.setItemAsync('refreshToken', result.data.refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(result.data.user));

      return result.data.user;
    }

    return rejectWithValue(result.message || 'Kayıt başarısız');
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    const result = await apiClient.request<TokenResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      await SecureStore.setItemAsync('accessToken', result.data.accessToken);
      await SecureStore.setItemAsync('refreshToken', result.data.refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(result.data.user));

      return result.data.user;
    }

    return rejectWithValue(result.message || 'Giriş başarısız');
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');

    return true;
  }
);

interface AuthState {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserResponseDto>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;