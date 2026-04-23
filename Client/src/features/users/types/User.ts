export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdDate: string;
  roleName: string;
  organizationCount: number;
  groupCount: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateUserFormValues {
  username: string;
  email: string;
  imageFile?: any;
}