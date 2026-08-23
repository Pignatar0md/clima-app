import settingsReducer, {
  toggleUnit,
  setLastSearchedCity,
} from '../../src/store/slices/settingsSlice';

describe('settingsSlice', () => {
  const initialState = {
    unit: 'celsius' as const,
    lastSearchedCity: null,
  };

  it('devuelve el estado inicial', () => {
    expect(settingsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('alterna la unidad de celsius a fahrenheit', () => {
    const state = settingsReducer(initialState, toggleUnit());
    expect(state.unit).toBe('fahrenheit');
  });

  it('alterna la unidad de fahrenheit a celsius', () => {
    const fahrenheitState = { ...initialState, unit: 'fahrenheit' as const };
    const state = settingsReducer(fahrenheitState, toggleUnit());
    expect(state.unit).toBe('celsius');
  });

  it('guarda la última ciudad buscada', () => {
    const state = settingsReducer(
      initialState,
      setLastSearchedCity('Porto')
    );
    expect(state.lastSearchedCity).toBe('Porto');
  });
});
