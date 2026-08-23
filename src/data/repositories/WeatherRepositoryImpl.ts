import { IWeatherRepository } from '../../domain/repositories/IWeatherRepository';
import { Weather, TemperatureUnit } from '../../domain/entities/Weather';
import { weatherApi } from '../api/weatherApi';
import { mapDtoToWeather } from '../mappers/weatherMapper';
import type { AppDispatch } from '../../store/store';

/**
 * Implementación concreta del puerto del dominio. Usa `store.dispatch` +
 * `initiate()` para poder reusar el caso de uso fuera de un componente
 * React (por ejemplo, en un test de integración o en un background job),
 * aunque en la UI normalmente usemos directamente el hook generado por
 * RTK Query (ver `useWeather.ts`) por comodidad y por el cache reactivo.
 */
export class WeatherRepositoryImpl implements IWeatherRepository {
  constructor(private readonly dispatch: AppDispatch) {}

  async getWeatherByCity(
    city: string,
    unit: TemperatureUnit
  ): Promise<Weather> {
    const result = await this.dispatch(
      weatherApi.endpoints.getWeatherByCity.initiate({ city, unit })
    ).unwrap();

    return mapDtoToWeather(result);
  }
}
