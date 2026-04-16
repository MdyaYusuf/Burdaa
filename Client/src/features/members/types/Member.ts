export interface MemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  externalId?: string;
  isActive: boolean;
  groupId: string;
  groupName: string;
  createdDate: string;
}

export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  externalId?: string;
  groupId: string;
}

export interface UpdateMemberRequest {
  id: string;
  firstName: string;
  lastName: string;
  externalId?: string;
  isActive: boolean;
}