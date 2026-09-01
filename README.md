# Weather App

Sample app in React Native + TypeScript to practice Clean Architecture, Redux Toolkit, RTK Query, testing (unit/integration/e2e), and CI/CD—all with free tools.

Uses the public Open-Meteo API (https://open-meteo.com/) (free, no API key required) for geocoding and forecasting.

## How to run the project

```bash
npm install
npm start
```

## Architecture

```
src/
domain/ → Entities, contracts (interfaces), and use cases.
Zero dependencies on React or the external API.
data/ → Implementation of domain contracts:
RTK Query (api/), DTO mappers -> entity,
and the concrete repository.
presentation/ → Screens, components, and hooks. Consume the domain

through hooks, never call fetch directly.

store/ → Redux configuration (store, slices, typed hooks).

``

The dependency rule: `presentation` → `data` → `domain`, never the other way around. The domain doesn't import anything from `data` or `presentation`.

## Scripts

| Command | What it does |

---|---|

`npm run typecheck` | Type checking with `tsc` |

`npm run lint` | ESLint |

`npm test` | Unit + integration tests (Jest) |

`npm run test:coverage` | Same, with coverage report |

`npm run e2e` | Runs the E2E flow with Maestro (requires native build) |

## Testing

- **Unit**: `__tests__/unit` — use cases and reducers, without React or network.

- **Integration**: `__tests__/integration` — renders `HomeScreen` with a real store and mocked `fetch`, to validate that all the pieces are properly connected.

- **E2E**: `maestro/weather-search.yaml` — complete flow on the app installed on an emulator/device. [Maestro](https://maestro.mobile.dev/)
was chosen over Detox because it is simpler to configure and does not require compiling the app in detox-friendly mode.

## CI/CD

`.github/workflows/ci.yml` runs in every pull request and pushes to `main`:
1. Lint + typecheck + unit/integration tests (always free in GitHub Actions with `ubuntu-latest` runners).

2. End-to-end job with Maestro (the native build needed to install the APK in the emulator is left as the next step—usually via `eas build` or `expo prebuild` + Gradle).

All of this runs within the free tier of GitHub Actions (2000 min/month in private repositories, unlimited in public ones).

## Design Decisions (for the interview)

- **RTK Query with `fakeBaseQuery` + `queryFn`**: the actual flow needs two chained calls (geocoding → forecast). We use `queryFn` to
manually control that flow, but we still benefit from caching,
loading/error states, and RTK Query deduplication.

- **Repository via `store.dispatch(...).unwrap()`: allows the
domain (via the usecase) to be invoked outside of a React component,
even though the UI uses the generated hook (`useGetWeatherByCityQuery`)
for convenience and responsiveness.

- **Separate Mappers: isolate the DTO (form of the external API) from the
domain entity, so that a change of weather provider does not
impact `domain` or `presentation`.