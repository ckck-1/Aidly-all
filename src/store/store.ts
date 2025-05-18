
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import chatReducer from './features/chatSlice';
import healthReducer from './features/healthSlice';
import settingsReducer from './features/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    health: healthReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
