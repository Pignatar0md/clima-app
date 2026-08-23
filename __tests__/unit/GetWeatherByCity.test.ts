import {
  GetWeatherByCity,
  InvalidCityNameError,
} from '../../src/domain/usecases/GetWeatherByCity';
import { IWeatherRepository } from '../../src/domain/repositories/IWeatherRepository';
import { Weather } from '../../src/domain/entities/Weather';

describe('GetWeatherByCity usecase', () => {
  const mockWeather: Weather = {
    cityName: 'Porto',
    temperature: 21,
    windSpeedKmh: 12,
    weatherCode: 1,
    unit: 'celsius',
  };

  function createRepositoryMock(): jest.Mocked<IWeatherRepository> {
    return {
      getWeatherByCity: jest.fn().mockResolvedValue(mockWeather),
    };
  }

  it('devuelve el clima cuando la ciudad es válida', async () => {
    const repository = createRepositoryMock();
    const usecase = new GetWeatherByCity(repository);

    const result = await usecase.execute('Porto', 'celsius');

    expect(result).toEqual(mockWeather);
    expect(repository.getWeatherByCity).toHaveBeenCalledWith(
      'Porto',
      'celsius'
    );
  });

  it('recorta espacios antes de delegar al repositorio', async () => {
    const repository = createRepositoryMock();
    const usecase = new GetWeatherByCity(repository);

    await usecase.execute('  Lisboa  ', 'celsius');

    expect(repository.getWeatherByCity).toHaveBeenCalledWith(
      'Lisboa',
      'celsius'
    );
  });

  it('lanza InvalidCityNameError si la ciudad está vacía', async () => {
    const repository = createRepositoryMock();
    const usecase = new GetWeatherByCity(repository);

    await expect(usecase.execute('   ', 'celsius')).rejects.toThrow(
      InvalidCityNameError
    );
    expect(repository.getWeatherByCity).not.toHaveBeenCalled();
  });

  it('propaga errores del repositorio', async () => {
    const repository = createRepositoryMock();
    repository.getWeatherByCity.mockRejectedValue(new Error('network error'));
    const usecase = new GetWeatherByCity(repository);

    await expect(usecase.execute('Porto', 'celsius')).rejects.toThrow(
      'network error'
    );
  });
});
