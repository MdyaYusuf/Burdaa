import { apiClient } from '@/src/core/api/apiClient';
import { ReturnModel, NoData } from '@/src/core/types/ApiResponse';
import {
  MemberResponseDto,
  CreatedMemberResponseDto,
  MemberStatsResponseDto
} from '../types/Member';

export const memberService = {
  async getAll(groupId: string): Promise<ReturnModel<MemberResponseDto[]>> {
    return await apiClient.request<MemberResponseDto[]>(`/members?groupId=${groupId}`, {
      method: 'GET'
    });
  },

  async getById(id: string): Promise<ReturnModel<MemberResponseDto>> {
    return await apiClient.request<MemberResponseDto>(`/members/${id}`, {
      method: 'GET'
    });
  },

  async create(data: FormData): Promise<ReturnModel<CreatedMemberResponseDto>> {
    return await apiClient.request<CreatedMemberResponseDto>('/members', {
      method: 'POST',
      body: data,
    });
  },

  async update(data: FormData): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>('/members', {
      method: 'PUT',
      body: data,
    });
  },

  async delete(id: string): Promise<ReturnModel<NoData>> {
    return await apiClient.request<NoData>(`/members/${id}`, {
      method: 'DELETE',
    });
  },

  async getStatsById(id: string): Promise<ReturnModel<MemberStatsResponseDto>> {
    return await apiClient.request<MemberStatsResponseDto>(`/members/${id}/stats`, {
      method: 'GET'
    });
  },
};