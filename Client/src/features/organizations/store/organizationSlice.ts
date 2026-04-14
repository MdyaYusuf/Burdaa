import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationResponseDto } from '../types/Organization';

interface OrganizationState {
  organizations: OrganizationResponseDto[];
  selectedOrganization: OrganizationResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<OrganizationResponseDto[]>) => {
      state.organizations = action.payload;
    },
    selectOrganization: (state, action: PayloadAction<OrganizationResponseDto>) => {
      state.selectedOrganization = action.payload;
    },
    clearOrganization: (state) => {
      state.selectedOrganization = null;
    }
  }
});

export const { setOrganizations, selectOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;