import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../../src/presentation/screens/HomeScreen';
import { weatherApi } from '../../src/data/api/weatherApi';
import settingsReducer from '../../src/store/slices/settingsSlice';

/**
 * Test de integración: renderiza la screen completa contra un store real
 * (Redux + RTK Query), pero mockea `fetch` global para no depender de la
 * red. Esto valida que la screen, los componentes, el hook y RTK Query
 * están correctamente conectados entre sí.
 */
function renderWithStore() {
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
      [weatherApi.reducerPath]: weatherApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(weatherApi.middleware),
  });

  return render(
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  );
}

describe('HomeScreen (integración)', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('geocoding-api')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              results: [{ name: 'Porto', latitude: 41.15, longitude: -8.6 }],
            }),
        });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            current_weather: {
              temperature: 22,
              windspeed: 10,
              weathercode: 0,
            },
          }),
      });
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('busca una ciudad y muestra el clima', async () => {
    const { getByTestId, queryByTestId } = renderWithStore();

    fireEvent.changeText(getByTestId('city-input'), 'Porto');
    fireEvent.press(getByTestId('search-button'));

    await waitFor(
      () => {
        expect(getByTestId('weather-card')).toBeTruthy();
      },
      { timeout: 8000, interval: 100 }
    );

    expect(getByTestId('weather-city').props.children).toBe('Porto');
    expect(queryByTestId('error-message')).toBeNull();
  }, 1000);

  it('muestra un error si la ciudad no existe', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ results: [] }) })
    );

    const { getByTestId } = renderWithStore();

    fireEvent.changeText(getByTestId('city-input'), 'CiudadInexistente');
    fireEvent.press(getByTestId('search-button'));

    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  it('no dispara búsqueda si el input está vacío', async () => {
    const { getByTestId, queryByTestId } = renderWithStore();

    fireEvent.press(getByTestId('search-button'));

    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });
    expect(queryByTestId('weather-card')).toBeNull();
  });
});
