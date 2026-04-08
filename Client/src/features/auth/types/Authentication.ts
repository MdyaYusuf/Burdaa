export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdDate: string;
  roleId: number;
  roleName: string;
  organizationCount: number;
  groupCount: number;
}

export interface TokenResponseDto {
  accessToken: string;
  expiration: string;
  refreshToken: string;
  user: UserResponseDto;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password?: string;
}