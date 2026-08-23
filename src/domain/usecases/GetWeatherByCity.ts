import { Weather, TemperatureUnit } from '../entities/Weather';
import { IWeatherRepository } from '../repositories/IWeatherRepository';

export class InvalidCityNameError extends Error {
  constructor() {
    super('El nombre de la ciudad no puede estar vacío');
    this.name = 'InvalidCityNameError';
  }
}

/**
 * Caso de uso: encapsula la regla de negocio ("no se puede buscar clima
 * de una ciudad vacía") y delega el "cómo" al repositorio inyectado.
 * Es 100% independiente de React, RTK Query o cualquier framework.
 */
export class GetWeatherByCity {
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(city: string, unit: TemperatureUnit): Promise<Weather> {
    const trimmedCity = city.trim();

    if (trimmedCity.length === 0) {
      throw new InvalidCityNameError();
    }

    return this.weatherRepository.getWeatherByCity(trimmedCity, unit);
  }
}
