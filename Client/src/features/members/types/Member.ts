export interface ProfileImageFile {
  uri: string;
  name: string;
  type: string;
}

export interface MemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  externalId: string | null;
  isActive: boolean;
  birthDate: string | null;
  profileImageUrl: string | null;
  groupId: string;
  groupName: string;
  createdDate: string;
}

export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  externalId: string | null;
  groupId: string;
  birthDate: string | null;
  profileImage: ProfileImageFile | null;
}

export interface UpdateMemberRequest {
  id: string;
  firstName: string;
  lastName: string;
  groupId: string;
  externalId: string | null;
  isActive: boolean;
  birthDate: string | null;
  profileImage: ProfileImageFile | null;
}

export interface CreatedMemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
}

export interface MemberPreviewDto {
  id: string;
  firstName: string;
  lastName: string;
  externalId: string | null;
  isActive: boolean;
}

export interface MemberStatsResponseDto {
  totalSessions: number;
  attendanceRate: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  lastSeen: string | null;
}