export interface GroupResponseDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  organizationId: string;
  organizationName: string;
  creatorId: string;
  creatorName: string;
  totalMembers: number;
  totalRollcalls: number;
}

export interface CreateGroupRequest {
  name: string;
  description: string | null;
  organizationId: string;
}

export interface UpdateGroupRequest {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}