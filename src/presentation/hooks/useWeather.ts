import { useState, useCallback } from 'react';
import { useGetWeatherByCityQuery } from '../../data/api/weatherApi';
import { mapDtoToWeather } from '../../data/mappers/weatherMapper';
import { InvalidCityNameError } from '../../domain/usecases/GetWeatherByCity';
import { Weather } from '../../domain/entities/Weather';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setLastSearchedCity } from '../../store/slices/settingsSlice';

interface UseWeatherResult {
  weather: Weather | null;
  isLoading: boolean;
  errorMessage: string | null;
  searchCity: (city: string) => void;
}

/**
 * Este hook es la frontera entre presentación y el resto de las capas.
 * - Valida la entrada con la misma regla que el usecase (evita pegarle
 *   a la red con un string vacío).
 * - Delega el fetch/cache a RTK Query.
 * - Traduce el DTO a entidad de dominio antes de devolverlo a la UI.
 */
export function useWeather(): UseWeatherResult {
  const [cityQuery, setCityQuery] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const unit = useAppSelector((state) => state.settings.unit);
  const dispatch = useAppDispatch();

  const { data, isFetching, error } = useGetWeatherByCityQuery(
    cityQuery ? { city: cityQuery, unit } : skipToken(),
    { skip: !cityQuery }
  );

  const searchCity = useCallback(
    (city: string) => {
      const trimmed = city.trim();
      if (trimmed.length === 0) {
        setValidationError(new InvalidCityNameError().message);
        return;
      }
      setValidationError(null);
      setCityQuery(trimmed);
      dispatch(setLastSearchedCity(trimmed));
    },
    [dispatch]
  );

  const errorMessage =
    validationError ??
    (error ? extractErrorMessage(error) : null);

  return {
    weather: data ? mapDtoToWeather(data) : null,
    isLoading: isFetching,
    errorMessage,
    searchCity,
  };
}

// Pequeño helper: RTK Query exige un tipo concreto para "skip",
// esto evita pasar un objeto inválido cuando todavía no hay ciudad.
function skipToken() {
  return { city: '', unit: 'celsius' as const };
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'string') return data;
  }
  return 'No se pudo obtener el clima. Intenta de nuevo.';
}
