# SenangBah 2.0

SenangBah 2.0 is the next-generation learning platform for secondary students.

Initial goals:

- migrate away from Railway
- rebuild on Vercel + Supabase
- modernize the product and UI
- expand beyond English into multi-subject learning
- support paid unlocks for premium subjects and tools

## Docs

- [Product Blueprint](./docs/product-blueprint.md)
- [Database Design](./docs/database-design.md)
- [Pricing Strategy](./docs/pricing-strategy.md)
- [Supabase Schema](./supabase/schema.sql)
- [Stripe Rollout Checklist](./docs/stripe-rollout-checklist.md)

## Product direction

Phase 1 focuses on rebuilding the core student product:

- authentication and profile
- dashboard
- English Writing
- English Grammar
- English Reading
- Vocabulary
- billing and access control foundation

Phase 2 expands into:

- Bahasa Melayu
- Sejarah
- Geografi
- Math
- Add Math
- teacher and parent reporting
- richer progress insights

## Stack

- Next.js on Vercel
- Supabase Postgres
- Supabase Storage
- OpenAI for analysis and feedback
- Stripe or a local payment alternative for subscriptions

## Environment

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

Billing status:

- `/api/checkout-intent` prepares a bundle-specific placeholder
- `/api/create-checkout-session` now attempts a real Stripe Checkout Session when `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_APP_URL` are set
- if Stripe env is still missing, the flow safely falls back to a placeholder response
- `/api/stripe/webhook` is scaffolded to sync `subscriptions`, `payments`, and `entitlements` after Stripe events arrive
