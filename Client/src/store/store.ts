import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import organizationReducer from '../features/organizations/store/organizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    organizations: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;