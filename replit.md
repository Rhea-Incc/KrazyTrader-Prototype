# KrazyTrader

An Android-oriented Expo prototype for Kenyan boda-boda riders and three-wheeler operators. Phase 02 includes local demo sign-in, rider onboarding, fictional SACCO affiliation, membership states, a personalized homepage and profile, supplied brand/vehicle imagery, and an illustrative local financing journey.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mobile run typecheck` — typecheck the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The Phase 02 mobile prototype uses AsyncStorage and fictional data; it does not require a database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/app/` — Expo Router welcome/login, onboarding, tabs, financing and secondary routes
- `artifacts/mobile/components/` — shared mobile UI components
- `artifacts/mobile/context/` — locally persisted demo rider, membership, notification and financing state
- `artifacts/mobile/constants/colors.ts` — brand design tokens
- `artifacts/mobile/types/domain.ts` and `data/demo.ts` — domain models and fictional sample records
- `artifacts/mobile/README.md` — mobile architecture and prototype boundaries

## Architecture decisions

- The app uses AsyncStorage for local prototype flows. Keep real authentication, SMS, KYC, SACCO, lender, payment, insurance and emergency integrations out of this prototype.
- The login flow uses a fixed displayed demo code; it is not production authentication.
- Expo Router file-based navigation defines welcome/login routes, five primary tabs and secondary routes.
- Use shared brand tokens, the supplied KrazyTrader logo, fictional Kenyan demo records and KES formatting.
- Membership benefits and insurance/safety remain gated until membership is Active; submitting an application never means approval.
- Financing uses illustrative principal-only estimates and is not a lender quote or credit decision.

## Product

KrazyTrader connects riders with SACCO membership, vehicle dealers and financing opportunities, insurance and emergency assistance, maintenance partners, fuel, tyres, and other member benefits. Phase 02 is implemented as a local prototype; do not proceed to Phase 03 without a new request.

## User preferences

The user requested Phase 02 onboarding and membership, plus an illustrative financing workflow in this phase. Do not proceed to Phase 03 automatically.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
