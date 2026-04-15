import { apiClient } from "@/src/core/api/apiClient";
import { OrganizationResponseDto, CreatedOrganizationResponseDto } from "../types/Organization";

export const organizationService = {

  async getAll() {
    return await apiClient.request<OrganizationResponseDto[]>('/organizations');
  },

  async create(formData: FormData) {
    return await apiClient.request<CreatedOrganizationResponseDto>('/organizations', {
      method: 'POST',
      body: formData,
    });
  }
};