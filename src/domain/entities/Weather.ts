/**
 * Entidad de dominio. No sabe nada de HTTP, RTK Query, ni de la API externa.
 * Es el "vocabulario" con el que habla toda la lógica de negocio.
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface Weather {
  cityName: string;
  temperature: number;
  windSpeedKmh: number;
  weatherCode: number;
  unit: TemperatureUnit;
}

/**
 * Mapeo simplificado de weatherCode (estándar WMO, usado por Open-Meteo)
 * a una descripción legible. Vive en el dominio porque es una regla de
 * negocio ("qué significa este código"), no un detalle de la API.
 */
export function describeWeatherCode(code: number): string {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Niebla';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Llovizna';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Lluvia';
  if ([71, 73, 75, 77].includes(code)) return 'Nieve';
  if ([80, 81, 82].includes(code)) return 'Chubascos';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Desconocido';
}
