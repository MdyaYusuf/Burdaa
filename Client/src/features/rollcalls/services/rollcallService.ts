import { apiClient } from '@/src/core/api/apiClient';
import { ReturnModel, NoData } from '@/src/core/types/ApiResponse';
import {
  RollcallResponseDto,
  RollcallPreviewDto,
  CreateRollcallRequest,
  UpdateRollcallRequest,
  CreatedRollcallResponseDto
} from '../types/Rollcall';

export const rollcallService = {
  async getAll(): Promise<ReturnModel<RollcallResponseDto[]>> {
    return await apiClient.request<RollcallResponseDto[]>('/rollcalls', {
      method: 'GET'
    });
  },

  async getPreviews(): Promise<ReturnModel<RollcallPreviewDto[]>> {
    return await apiClient.request<RollcallPreviewDto[]>('/rollcalls/previews', {
      method: 'GET'
    });
  },

  async getTemplate(groupId: string): Promise<ReturnModel<RollcallResponseDto>> {
    return await apiClient.request<RollcallResponseDto>(`/rollcalls/template/${groupId}`, {
      method: 'GET'
    });
  },

  async getById(id: string): Promise<ReturnModel<RollcallResponseDto>> {
    return await apiClient.request<RollcallResponseDto>(`/rollcalls/${id}`, {
      method: 'GET'
    });
  },

  async create(data: CreateRollcallRequest): Promise<ReturnModel<CreatedRollcallResponseDto>> {
    return await apiClient.request<CreatedRollcallResponseDto>('/rollcalls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(data: UpdateRollcallRequest): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>('/rollcalls', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>(`/rollcalls/${id}`, {
      method: 'DELETE',
    });
  }
};