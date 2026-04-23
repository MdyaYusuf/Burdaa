import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import { ChangePasswordRequest } from '../types/User';
import { updateAuthUserInfo } from '../../auth/store/authSlice';
import * as SecureStore from 'expo-secure-store';

interface UserSettingsState {
  isUpdating: boolean;
  isChangingPassword: boolean;
  error: string | null;
}

const initialState: UserSettingsState = {
  isUpdating: false,
  isChangingPassword: false,
  error: null,
};

export const updateProfileInfo = createAsyncThunk(
  'user/updateProfile',
  async ({ formData, username, profileImageUrl }: { formData: FormData, username: string, profileImageUrl?: string }, { dispatch, getState }) => {
    const response = await userService.update(formData);

    if (response.success) {
      dispatch(updateAuthUserInfo({ username, profileImageUrl }));

      const { auth } = getState() as any;

      if (auth.user) {
        await SecureStore.setItemAsync('user', JSON.stringify(auth.user));
      }
    }
    return response;
  }
);

export const changeUserPassword = createAsyncThunk(
  'user/changePassword',
  async (data: ChangePasswordRequest) => {
    return await userService.changePassword(data);
  }
);

const userSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileInfo.pending, (state) => { state.isUpdating = true; })
      .addCase(updateProfileInfo.fulfilled, (state) => { state.isUpdating = false; })
      .addCase(updateProfileInfo.rejected, (state) => { state.isUpdating = false; });
  },
});

export default userSlice.reducer;