import { configureStore } from '@reduxjs/toolkit';
import { expenseSlice } from './slices/expenseSlice';
import { settingsSlice } from './slices/settingsSlice';
import { filterSlice } from './slices/filterSlice';
import { persistenceMiddleware } from './middleware/persistence';

export const store = configureStore({
  reducer: {
    expenses: expenseSlice.reducer,
    settings: settingsSlice.reducer,
    filters: filterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
