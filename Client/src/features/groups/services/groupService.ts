import { apiClient } from '@/src/core/api/apiClient';
import { ReturnModel } from '@/src/core/types/ApiResponse';
import {
  GroupResponseDto,
  CreateGroupRequest,
  UpdateGroupRequest
} from '../types/Group';

export const groupService = {
  getAll: async (organizationId: string): Promise<ReturnModel<GroupResponseDto[]>> => {
    return await apiClient.request<GroupResponseDto[]>(`/groups?organizationId=${organizationId}`, {
      method: 'GET'
    });
  },

  getById: async (id: string): Promise<ReturnModel<GroupResponseDto>> => {
    return await apiClient.request<GroupResponseDto>(`/groups/${id}`, {
      method: 'GET'
    });
  },

  create: async (data: CreateGroupRequest): Promise<ReturnModel<GroupResponseDto>> => {
    return await apiClient.request<GroupResponseDto>('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (data: UpdateGroupRequest): Promise<ReturnModel<any>> => {
    return await apiClient.request<any>('/groups', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ReturnModel<any>> => {
    return await apiClient.request<any>(`/groups/${id}`, {
      method: 'DELETE',
    });
  }
};