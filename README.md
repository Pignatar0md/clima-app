# Clima App

App de ejemplo en React Native + TypeScript para practicar Clean
Architecture, Redux Toolkit, RTK Query, testing (unit/integration/e2e) y
CI/CD — todo con herramientas gratuitas.

Usa la API pública de [Open-Meteo](https://open-meteo.com/) (gratis, sin
API key) para geocoding y forecast.

## Cómo correr el proyecto

```bash
npm install
npm start
```

## Arquitectura

```
src/
  domain/          → Entidades, contratos (interfaces) y casos de uso.
                      Cero dependencias de React o de la API externa.
  data/            → Implementación de los contratos del dominio:
                      RTK Query (api/), mappers DTO -> entidad,
                      y el repositorio concreto.
  presentation/    → Screens, componentes y hooks. Consume el dominio
                      a través de hooks, nunca llama a fetch directamente.
  store/           → Configuración de Redux (store, slices, hooks tipados).
```

La regla de dependencia: `presentation` → `data` → `domain`, nunca al
revés. El dominio no importa nada de `data` ni de `presentation`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run typecheck` | Chequeo de tipos con `tsc` |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios + integración (Jest) |
| `npm run test:coverage` | Igual, con reporte de cobertura |
| `npm run e2e` | Corre el flujo E2E con Maestro (requiere build nativo) |

## Testing

- **Unit**: `__tests__/unit` — casos de uso y reducers, sin React ni red.
- **Integración**: `__tests__/integration` — renderiza `HomeScreen` con un
  store real y `fetch` mockeado, para validar que todas las piezas están
  bien conectadas.
- **E2E**: `maestro/weather-search.yaml` — flujo completo sobre la app
  instalada en un emulador/dispositivo. [Maestro](https://maestro.mobile.dev/)
  se eligió sobre Detox por ser más simple de configurar y no requerir
  compilar la app en modo detox-friendly.

## CI/CD

`.github/workflows/ci.yml` corre en cada PR y push a `main`:
1. Lint + typecheck + tests unitarios/integración (siempre gratis en
   GitHub Actions con runners `ubuntu-latest`).
2. Job de E2E con Maestro (el build nativo necesario para instalar el
   APK en el emulador se deja como siguiente paso — normalmente vía
   `eas build` o `expo prebuild` + Gradle).

Todo esto corre dentro del tier gratuito de GitHub Actions (2000
min/mes en repos privados, ilimitado en públicos).

## Decisiones de diseño (para la entrevista)

- **RTK Query con `fakeBaseQuery` + `queryFn`**: el flujo real necesita
  dos llamadas encadenadas (geocoding → forecast). Se usa `queryFn` para
  controlar ese flujo a mano, pero seguimos beneficiándonos del cache,
  los estados de loading/error y la deduplicación de RTK Query.
- **Repositorio vía `store.dispatch(...).unwrap()`**: permite que el
  dominio (a través del usecase) sea invocable fuera de un componente
  React, aunque en la UI se use el hook generado (`useGetWeatherByCityQuery`)
  por comodidad y reactividad.
- **Mappers separados**: aíslan el DTO (forma de la API externa) de la
  entidad de dominio, para que un cambio de proveedor de clima no
  impacte en `domain` ni en `presentation`.
