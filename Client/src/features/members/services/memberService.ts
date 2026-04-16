import { apiClient } from '@/src/core/api/apiClient';
import { ReturnModel, NoData } from '@/src/core/types/ApiResponse';
import {
  MemberResponseDto,
  CreateMemberRequest,
  UpdateMemberRequest
} from '../types/Member';

export const memberService = {
  async getAll(): Promise<ReturnModel<MemberResponseDto[]>> {

    return await apiClient.request<MemberResponseDto[]>('/members', {
      method: 'GET'
    });
  },

  async getById(id: string): Promise<ReturnModel<MemberResponseDto>> {

    return await apiClient.request<MemberResponseDto>(`/members/${id}`, {
      method: 'GET'
    });
  },

  async create(data: CreateMemberRequest): Promise<ReturnModel<any>> {

    return await apiClient.request<any>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(data: UpdateMemberRequest): Promise<ReturnModel<NoData>> {

    return await apiClient.request<NoData>('/members', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<ReturnModel<NoData>> {

    return await apiClient.request<NoData>(`/members/${id}`, {
      method: 'DELETE',
    });
  }
};