
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface SettingsState {
  language: Language;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

const initialState: SettingsState = {
  language: 'en',
  notificationsEnabled: true,
  darkMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { setLanguage, toggleNotifications, toggleDarkMode } = settingsSlice.actions;
export default settingsSlice.reducer;
