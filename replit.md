# KrazyTrader

A mobile membership platform foundation for Kenyan boda-boda riders and three-wheeler operators, connecting future SACCO, vehicle, financing, protection, and local-benefit journeys.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mobile run typecheck` — typecheck the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The Phase 01 mobile prototype uses local fictional data and does not require a database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/app/` — Expo Router tabs and secondary routes
- `artifacts/mobile/components/` — shared mobile UI components
- `artifacts/mobile/constants/colors.ts` — brand design tokens
- `artifacts/mobile/types/domain.ts` and `data/demo.ts` — domain models and fictional sample records
- `artifacts/mobile/README.md` — mobile architecture and prototype boundaries

## Architecture decisions

- Phase 01 is a local demonstration prototype; do not add real authentication, payments, KYC, transactions, or production service integrations.
- Expo Router file-based navigation defines the five primary tabs and secondary module routes.
- Use shared brand tokens and fictional Kenyan demo records; format displayed prices in KES.

## Product

KrazyTrader is intended to connect riders with SACCO membership, vehicle dealers and financing opportunities, insurance and emergency assistance, maintenance partners, fuel, tyres, and other member benefits. The current app provides a navigable foundation and examples only; do not begin Phase 02 unless the user asks.

## User preferences

The user requested a Phase 01 prototype foundation and explicitly asked not to proceed to Phase 02 automatically.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
