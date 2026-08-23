import { Weather, TemperatureUnit } from '../entities/Weather';

/**
 * Puerto (interfaz) que define lo que el dominio necesita, sin importar
 * cómo se obtiene. La capa `data` es quien implementa esto (con RTK Query,
 * fetch, o lo que sea). Esto es lo que permite testear el usecase sin
 * tocar la red.
 */
export interface IWeatherRepository {
  getWeatherByCity(city: string, unit: TemperatureUnit): Promise<Weather>;
}
