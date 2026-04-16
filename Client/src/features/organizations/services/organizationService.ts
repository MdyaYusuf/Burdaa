import { apiClient } from "@/src/core/api/apiClient";
import { ReturnModel } from "@/src/core/types/ApiResponse";
import {
  OrganizationResponseDto,
  CreatedOrganizationResponseDto
} from "../types/Organization";

export const organizationService = {

  async getAll(): Promise<ReturnModel<OrganizationResponseDto[]>> {
    return await apiClient.request<OrganizationResponseDto[]>('/organizations');
  },

  async create(formData: FormData): Promise<ReturnModel<CreatedOrganizationResponseDto>> {
    return await apiClient.request<CreatedOrganizationResponseDto>('/organizations', {
      method: 'POST',
      body: formData,
    });
  }
};