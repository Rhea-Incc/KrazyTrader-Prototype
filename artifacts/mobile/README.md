# KrazyTrader mobile prototype

Phase 02 extends the Android-oriented Expo app with a branded welcome and local demo sign-in, five-step rider registration, SACCO selection, membership states, a rider homepage and profile, and a complete local-only financing demonstration.

## Structure

- `app/` — Expo Router welcome/login routes, five primary tabs, registration and financing flows, and development controls
- `components/` — shared mobile UI, forms, status indicators and reusable cards
- `context/` — locally persisted demo account, membership, notification and financing state
- `constants/` — semantic design tokens
- `data/` — fictional Kenyan rider, SACCO, vehicle, partner, benefit and notification records
- `types/` — rider, membership, financing and registration models
- `assets/images/` — supplied KrazyTrader logo and optimized vehicle photos

## Demo flows

- Login uses `+254 700 000 128` and the fixed verification code `123456`; no SMS is sent.
- Registration collects fictional sample details, lets the rider search/select a fictional SACCO, and saves a `Submitted` application locally.
- Membership states are distinct: Submitted, Pending verification, Active, Rejected and Inactive. Developer-only controls can switch states and reset local demo data.
- Member benefits and insurance/safety routes remain gated until the membership is Active.
- Financing guides a rider through vehicle selection, deposit and term choices, a principal-only estimate, review and a locally saved request reference.
- Profile edits, notification preferences, membership state and demo financing requests persist in AsyncStorage on the device.

## Prototype boundaries

No production authentication, SMS, identity verification, SACCO system, lender, credit check, insurance provider, payment processing or emergency dispatch is connected. Financing estimates are illustrative and exclude interest and fees. Use fictional information only.
