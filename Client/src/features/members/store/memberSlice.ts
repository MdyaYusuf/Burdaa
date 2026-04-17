import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  MemberResponseDto,
  CreateMemberRequest,
  UpdateMemberRequest,
  CreatedMemberResponseDto
} from '../types/Member';
import { memberService } from '../services/memberService';

interface MemberState {
  members: MemberResponseDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  isLoading: false,
  error: null,
};

// Fetch Thunk
export const fetchMembers = createAsyncThunk<MemberResponseDto[], void, { rejectValue: string }>(
  'members/fetchAll',
  async (_, { rejectWithValue }) => {
    const response = await memberService.getAll();

    if (response.success) {

      return response.data ?? [];
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
      dispatch(fetchMembers());

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
      dispatch(fetchMembers());

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