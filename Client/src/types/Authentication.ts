export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
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