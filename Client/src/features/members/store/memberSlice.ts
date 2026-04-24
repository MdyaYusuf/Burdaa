import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  MemberResponseDto,
  CreateMemberRequest,
  UpdateMemberRequest,
  CreatedMemberResponseDto,
  MemberStatsResponseDto
} from '../types/Member';
import { memberService } from '../services/memberService';

interface MemberState {
  members: MemberResponseDto[];
  selectedMember: MemberResponseDto | null;
  stats: MemberStatsResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  selectedMember: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Fetch Thunk
export const fetchMembers = createAsyncThunk<MemberResponseDto[], string, { rejectValue: string }>(
  'members/fetchAll',
  async (groupId, { rejectWithValue }) => {
    const response = await memberService.getAll(groupId);

    if (response.success) {
      return response.data ?? [];
    }
    return rejectWithValue(response.message);
  }
);

export const fetchMemberById = createAsyncThunk<MemberResponseDto, string, { rejectValue: string }>(
  'members/fetchById',
  async (memberId, { rejectWithValue }) => {
    const response = await memberService.getById(memberId);

    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

export const fetchMemberStats = createAsyncThunk<MemberStatsResponseDto, string, { rejectValue: string }>(
  'members/fetchStats',
  async (memberId, { rejectWithValue }) => {
    const response = await memberService.getStatsById(memberId);

    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

// Create Thunk
export const createMember = createAsyncThunk<CreatedMemberResponseDto, CreateMemberRequest, { rejectValue: string }>(
  'members/create',
  async (data, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('groupId', data.groupId);

    if (data.externalId) {
      formData.append('externalId', data.externalId);
    }

    if (data.birthDate) {
      formData.append('birthDate', data.birthDate);
    }

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage as any);
    }

    const response = await memberService.create(formData);

    if (response.success && response.data) {
      dispatch(fetchMembers(data.groupId));

      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

// Update Thunk
export const updateMember = createAsyncThunk<void, UpdateMemberRequest, { rejectValue: string }>(
  'members/update',
  async (data, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('groupId', data.groupId);
    formData.append('isActive', String(data.isActive));

    if (data.externalId) {
      formData.append('externalId', data.externalId);
    }

    if (data.birthDate) {
      formData.append('birthDate', data.birthDate);
    }

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage as any);
    }

    const response = await memberService.update(formData);

    if (response.success) {
      dispatch(fetchMembers(data.groupId));

      return;
    }
    return rejectWithValue(response.message);
  }
);

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    clearMembers: (state) => {
      state.members = [];
      state.selectedMember = null;
      state.stats = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch members';
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.selectedMember = action.payload;
      })
      .addCase(fetchMemberStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending') && (action.type.includes('create') || action.type.includes('update')),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && (action.type.includes('create') || action.type.includes('update')),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<string> =>
          action.type.endsWith('/rejected') && (action.type.includes('create') || action.type.includes('update')),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearMembers } = memberSlice.actions;
export default memberSlice.reducer;