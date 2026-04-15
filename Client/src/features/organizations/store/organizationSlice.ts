import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationResponseDto } from '../types/Organization';
import { organizationService } from '../services/organizationService';

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

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchAll',
  async (_, { rejectWithValue }) => {
    const response = await organizationService.getAll();

    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    const response = await organizationService.create(formData);

    if (response.success) {
      // We wait for the backend and then pull the fresh list
      dispatch(fetchOrganizations());
      return response.data;
    }
    const errorMsg = response.errors && response.errors.length > 0
      ? response.errors[0]
      : response.message;

    return rejectWithValue(errorMsg);
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    selectOrganization: (state, action: PayloadAction<OrganizationResponseDto>) => {
      state.selectedOrganization = action.payload;
    },
    clearOrganization: (state) => {
      state.selectedOrganization = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { selectOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;