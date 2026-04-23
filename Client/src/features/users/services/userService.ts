import { apiClient } from '@/src/core/api/apiClient';
import { ReturnModel, NoData } from '@/src/core/types/ApiResponse';
import { ChangePasswordRequest } from '../types/User';

export const userService = {
  async update(formData: FormData): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>('/users/profile', {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  },

  async changePassword(data: ChangePasswordRequest): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};