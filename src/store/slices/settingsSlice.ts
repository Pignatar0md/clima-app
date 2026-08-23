import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TemperatureUnit } from '../../domain/entities/Weather';

interface SettingsState {
  unit: TemperatureUnit;
  lastSearchedCity: string | null;
}

const initialState: SettingsState = {
  unit: 'celsius',
  lastSearchedCity: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'celsius' ? 'fahrenheit' : 'celsius';
    },
    setLastSearchedCity: (state, action: PayloadAction<string>) => {
      state.lastSearchedCity = action.payload;
    },
  },
});

export const { toggleUnit, setLastSearchedCity } = settingsSlice.actions;
export default settingsSlice.reducer;
