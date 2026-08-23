import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { TemperatureUnit } from '../../domain/entities/Weather';

/**
 * DTOs: la forma exacta en la que la API externa devuelve los datos.
 * Viven en `data`, no en `domain`, porque son un detalle de infraestructura.
 */
interface GeocodingResultDTO {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

interface ForecastResultDTO {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

export interface WeatherResponseDTO {
  cityName: string;
  temperature: number;
  windSpeedKmh: number;
  weatherCode: number;
  unit: TemperatureUnit;
}

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Usamos fakeBaseQuery + queryFn porque el flujo real necesita DOS llamadas
 * encadenadas (geocoding -> forecast). RTK Query igual nos da cache,
 * loading/error states y deduplicación de requests "gratis".
 */
export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getWeatherByCity: builder.query<
      WeatherResponseDTO,
      { city: string; unit: TemperatureUnit }
    >({
      queryFn: async ({ city, unit }) => {
        try {
          const geoResponse = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`
          );
          const geoData: GeocodingResultDTO = await geoResponse.json();
          const match = geoData.results?.[0];

          if (!match) {
            return {
              error: { status: 404, data: `Ciudad "${city}" no encontrada` },
            };
          }

          const tempUnitParam =
            unit === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';

          const forecastResponse = await fetch(
            `${FORECAST_URL}?latitude=${match.latitude}&longitude=${match.longitude}&current_weather=true${tempUnitParam}`
          );
          const forecastData: ForecastResultDTO = await forecastResponse.json();

          const dto: WeatherResponseDTO = {
            cityName: match.name,
            temperature: forecastData.current_weather.temperature,
            windSpeedKmh: forecastData.current_weather.windspeed,
            weatherCode: forecastData.current_weather.weathercode,
            unit,
          };

          return { data: dto };
        } catch (err) {
          return {
            error: { status: 'FETCH_ERROR', data: (err as Error).message },
          };
        }
      },
      providesTags: ['Weather'],
    }),
  }),
});

export const { useGetWeatherByCityQuery, useLazyGetWeatherByCityQuery } =
  weatherApi;
