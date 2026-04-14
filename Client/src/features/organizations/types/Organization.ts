export interface OrganizationResponseDto {
  id: string;
  name: string;
  address?: string;
  logoUrl?: string;
  createdDate: string;
  ownerId: string;
  ownerName: string;
  totalGroups: number;
}

export interface ImageFile {
  uri: string;
  name: string;
  type: string;
}

export interface CreateOrganizationRequest {
  name: string;
  address?: string;
  logoFile?: ImageFile; 
}

export interface UpdateOrganizationRequest {
  id: string;
  name: string;
  address?: string;
  logoFile?: ImageFile;
}

export interface OrganizationPreviewDto {
  id: string;
  name: string;
  logoUrl?: string;
  groupCount: number;
}

export interface CreatedOrganizationResponseDto {
  id: string;
  name: string;
}