import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MemberResponseDto, CreateMemberRequest } from '../types/Member';
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

// Thunk: Fetch all members for the active roster
export const fetchMembers = createAsyncThunk(
  'members/fetchAll',
  async (_, { rejectWithValue }) => {
    const response = await memberService.getAll();

    if (response.success) {

      return response.data ?? [];
    }
    return rejectWithValue(response.message);
  }
);

// Thunk: Register a new member to a group
export const createMember = createAsyncThunk(
  'members/create',
  async (data: CreateMemberRequest, { dispatch, rejectWithValue }) => {
    const response = await memberService.create(data);

    if (response.success) {
      dispatch(fetchMembers()); // Refresh the roster automatically

      return response.data;
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
      // Fetch Members Cases
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
        state.error = action.payload as string;
      })

      // Create Member Cases
      .addCase(createMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMembers } = memberSlice.actions;
export default memberSlice.reducer;