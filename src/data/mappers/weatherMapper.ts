import { Weather } from '../../domain/entities/Weather';
import { WeatherResponseDTO } from '../api/weatherApi';

/**
 * Traduce el DTO (forma de la API externa) a la entidad de dominio.
 * Si mañana cambia el proveedor de clima, solo esto (y el api slice)
 * necesitan cambiar. El dominio y la UI no se enteran.
 */
export function mapDtoToWeather(dto: WeatherResponseDTO): Weather {
  return {
    cityName: dto.cityName,
    temperature: dto.temperature,
    windSpeedKmh: dto.windSpeedKmh,
    weatherCode: dto.weatherCode,
    unit: dto.unit,
  };
}
