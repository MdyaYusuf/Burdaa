export enum AttendanceStatus {
  None = 0,
  Present = 1,
  Absent = 2,
  Late = 3
}

export interface CreateRollcallEntryDto {
  memberId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface UpdateRollcallEntryDto {
  id?: string;
  memberId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface RollcallEntryResponseDto {
  id: string;
  memberId: string;
  externalId?: string;
  memberFirstName: string;
  memberLastName: string;
  status: AttendanceStatus;
  note?: string;
  profileImageUrl?: string;
}

export interface CreateRollcallRequest {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  groupId: string;
  organizationId: string;
  entries: CreateRollcallEntryDto[];
}

export interface UpdateRollcallRequest {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  entries: UpdateRollcallEntryDto[];
}

export interface RollcallResponseDto {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  groupId: string;
  groupName: string;
  entries: RollcallEntryResponseDto[];
  createdDate: string;
}

export interface CreatedRollcallResponseDto {
  id: string;
  title: string;
}

export interface RollcallPreviewDto {
  id: string;
  title: string;
  groupId: string;
  groupName: string;
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
}