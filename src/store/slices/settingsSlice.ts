import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings, CustomCategory } from '../../types';
import { defaultSettings } from '../../utils';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoading: false,
  error: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Load settings from localStorage
    loadSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
      state.isLoading = false;
    },
    
    // Update currency
    updateCurrency: (state, action: PayloadAction<'USD' | 'EUR' | 'RUB'>) => {
      state.settings.currency = action.payload;
    },
    
    // Add custom category
    addCustomCategory: (state, action: PayloadAction<CustomCategory>) => {
      state.settings.customCategories.push(action.payload);
    },
    
    // Update custom category
    updateCustomCategory: (state, action: PayloadAction<CustomCategory>) => {
      const index = state.settings.customCategories.findIndex(
        cat => cat.id === action.payload.id
      );
      if (index !== -1) {
        state.settings.customCategories[index] = action.payload;
      }
    },
    
    // Delete custom category
    deleteCustomCategory: (state, action: PayloadAction<string>) => {
      state.settings.customCategories = state.settings.customCategories.filter(
        cat => cat.id !== action.payload
      );
    },
    
    // Reset settings to default
    resetSettings: (state) => {
      state.settings = defaultSettings;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  loadSettings,
  updateCurrency,
  addCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
  resetSettings,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
