import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from '../data/api/weatherApi';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
