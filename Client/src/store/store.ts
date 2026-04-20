import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import organizationReducer from '../features/organizations/store/organizationSlice';
import groupReducer from '../features/groups/store/groupSlice';
import memberReducer from '../features/members/store/memberSlice';
import rollcallReducer from '../features/rollcalls/store/rollcallSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationReducer,
    groups: groupReducer,
    members: memberReducer,
    rollcalls: rollcallReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;