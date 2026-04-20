import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  RollcallResponseDto,
  RollcallPreviewDto,
  CreateRollcallRequest,
  AttendanceStatus
} from '../types/Rollcall';
import { rollcallService } from '../services/rollcallService';

interface RollcallState {
  previews: RollcallPreviewDto[];
  activeRollcall: RollcallResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RollcallState = {
  previews: [],
  activeRollcall: null,
  isLoading: false,
  error: null,
};

export const fetchRollcallPreviews = createAsyncThunk<RollcallPreviewDto[], void, { rejectValue: string }>(
  'rollcalls/fetchPreviews',
  async (_, { rejectWithValue }) => {
    const response = await rollcallService.getPreviews();

    if (response.success) {
      return response.data ?? [];
    }
    return rejectWithValue(response.message);
  }
);

export const startNewRollcallSession = createAsyncThunk<RollcallResponseDto, string, { rejectValue: string }>(
  'rollcalls/startSession',
  async (groupId, { rejectWithValue }) => {
    const response = await rollcallService.getTemplate(groupId);

    if (response.success && response.data) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

export const saveRollcallSession = createAsyncThunk<void, CreateRollcallRequest, { rejectValue: string }>(
  'rollcalls/saveSession',
  async (data, { dispatch, rejectWithValue }) => {
    const response = await rollcallService.create(data);

    if (response.success) {
      dispatch(fetchRollcallPreviews());

      return;
    }
    return rejectWithValue(response.message);
  }
);

const rollcallSlice = createSlice({
  name: 'rollcalls',
  initialState,
  reducers: {
    updateActiveEntryStatus: (state, action: PayloadAction<{ memberId: string, status: AttendanceStatus }>) => {
      if (state.activeRollcall) {
        const entry = state.activeRollcall.entries.find(e => e.memberId === action.payload.memberId);

        if (entry) {
          entry.status = action.payload.status;
        }
      }
    },
    updateActiveEntryNote: (state, action: PayloadAction<{ memberId: string, note: string }>) => {
      if (state.activeRollcall) {
        const entry = state.activeRollcall.entries.find(e => e.memberId === action.payload.memberId);

        if (entry) {
          entry.note = action.payload.note;
        }
      }
    },
    updateSessionTimes: (state, action: PayloadAction<{ startTime?: string, endTime?: string }>) => {
      if (state.activeRollcall) {

        if (action.payload.startTime) {
          state.activeRollcall.startTime = action.payload.startTime;
        }

        if (action.payload.endTime) {
          state.activeRollcall.endTime = action.payload.endTime;
        }
      }
    },
    clearActiveRollcall: (state) => {
      state.activeRollcall = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRollcallPreviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRollcallPreviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previews = action.payload;
      })
      .addCase(fetchRollcallPreviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch previews';
      })
      .addCase(startNewRollcallSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startNewRollcallSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRollcall = action.payload;
      })
      .addCase(startNewRollcallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to start session';
      })
      .addCase(saveRollcallSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveRollcallSession.fulfilled, (state) => {
        state.isLoading = false;
        state.activeRollcall = null;
      })
      .addCase(saveRollcallSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to save session';
      });
  },
});

export const { updateActiveEntryStatus, updateActiveEntryNote, updateSessionTimes, clearActiveRollcall } = rollcallSlice.actions;
export default rollcallSlice.reducer;