import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GroupResponseDto, CreateGroupRequest } from '../types/Group';
import { groupService } from '../services/groupService';

interface GroupState {
  groups: GroupResponseDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  isLoading: false,
  error: null,
};

// Fetch Thunk
export const fetchGroups = createAsyncThunk<GroupResponseDto[], string, { rejectValue: string }>(
  'groups/fetchAll',
  async (organizationId, { rejectWithValue }) => {
    const response = await groupService.getAll(organizationId);

    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

// Create Thunk
export const createGroup = createAsyncThunk(
  'groups/create',
  async (data: CreateGroupRequest, { dispatch, rejectWithValue }) => {
    const response = await groupService.create(data);

    if (response.success && response.data) {
      dispatch(fetchGroups(response.data.organizationId));

      return response.data;
    }

    const errorMsg = response.errors && response.errors.length > 0
      ? response.errors[0]
      : response.message;

    return rejectWithValue(errorMsg);
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroups: (state) => {
      state.groups = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGroups } = groupSlice.actions;
export default groupSlice.reducer;