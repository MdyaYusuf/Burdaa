import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../../core/api/apiClient';
import { UserResponseDto, RegisterUserRequest, TokenResponseDto } from '../types/Authentication';
import * as SecureStore from 'expo-secure-store';

// The Thunk handles the API call and storage automatically
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterUserRequest, { rejectWithValue }) => {
    const result = await apiClient.request<TokenResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      await SecureStore.setItemAsync('accessToken', result.data.accessToken);
      await SecureStore.setItemAsync('user', JSON.stringify(result.data.user));
      return result.data.user; // This goes to fulfilled
    }
    return rejectWithValue(result.message || 'Registration failed');
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
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;