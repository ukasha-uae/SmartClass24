# Science Simulations (3D & Interactive)

K-12 science simulations using 3D, animations, and interactive models. Designed for **scalability**, **maintainability**, and **UAE/international curriculum** alignment.

## Current modules

### Solar System
- **Route**: Virtual Labs → **Science** → **Solar System** (`/virtual-labs/solar-system`)
- **Tech**: React Three Fiber (R3F) + Three.js + drei
- **Features**: 3D Sun and planets, orbital animation, time-speed control, click-to-learn facts (K-12 banded content)
- **Content**: `src/lib/science-simulations/solar-system-data.ts` (single source of truth; extend with more `PlanetFact[]` or grade bands)

## Architecture

- **Content**: Data in `src/lib/science-simulations/*.ts` — no user-generated 3D; all content is code/JSON. Safe for CSP and audit.
- **Components**: `src/components/science-simulations/` — each simulation is a self-contained lab (e.g. `SolarSystemLab.tsx` + `SolarSystemScene.tsx`).
- **Registration**: New simulations are added to `src/lib/virtual-labs-data.ts` with `subject: 'Science'` (or Biology/Chemistry/Physics) and the same access control as other virtual labs (V1RouteGuard, premium where applicable).

## Scalability

- **More simulations**: Add a new entry in `virtual-labs-data.ts` and a new folder under `components/science-simulations/` (e.g. `MoonPhasesLab`, `EarthSeasonsLab`). Reuse `solar-system-data.ts` pattern: content in `lib/science-simulations/`, scene + lab wrapper in components.
- **Grade bands**: Use `GradeBand` in content (e.g. `primary` / `middle` / `secondary` for UAE cycles) and pass level from profile or selector to filter facts.
- **i18n**: Content is structured (headline, description); replace with localized strings or CMS later without changing 3D logic.

## Security

- No `eval()` or user-supplied 3D assets in the simulation pipeline.
- Existing virtual lab access control and V1 route guards apply.
- CSP: WebGL and script from same origin; no inline scripts in simulation components.

## Adding another 3D simulation

1. Add content to `src/lib/science-simulations/<topic>-data.ts`.
2. Add `src/components/science-simulations/<Topic>Scene.tsx` (R3F scene) and `<Topic>Lab.tsx` (wrapper with Canvas + UI).
3. Register in `virtual-labs-data.ts`: `slug: '<topic>', subject: 'Science', component: <Topic>Lab`.
4. Optionally add difficulty in virtual-labs page `labDifficulty` and any new subject filters.

## References

- [NASA Solar System Exploration](https://solarsystem.nasa.gov/)
- [WorldWide Telescope Solar System Explorer](https://wwtambassadors.org/solar-system-explorer)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei)
