# KrazyTrader mobile foundation

Phase 01 is an Android-oriented Expo Router shell for a Kenyan rider membership platform. It contains navigable sample screens and reusable foundations; it does not submit applications or connect to live services.

## Structure

- `app/` — Expo Router screens, five primary tabs, and secondary demo routes
- `components/` — shared mobile UI pieces and feature-route placeholder
- `constants/` — shared semantic design tokens
- `data/` — fictional rider, SACCO, vehicle, partner, benefit, and notification records
- `types/` — product domain types and workflow status unions
- `utils/` — KES currency and date formatting helpers

## Architecture decisions

- Expo Router owns navigation; each future module has a distinct route before its full workflow is built.
- The mobile client owns this phase's predictable demo state. There is no production API, database, or account session.
- UI colors and typography use shared tokens and the scaffold's Inter font; reusable cards, fields, status indicators, and dialogs live outside screens.
- Registration is an interaction preview only. It validates sample fields locally and clearly states that information is not saved or sent.
- All organizations, rider details, prices, and offers are fictional examples for Kenya.

## Prototype boundaries

Authentication, real SMS/OTP, KYC, membership contributions, vehicle transactions, lender or insurer connections, emergency dispatch, and guarantee-pool functionality are not implemented.
