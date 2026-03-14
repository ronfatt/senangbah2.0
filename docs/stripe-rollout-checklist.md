# Stripe Rollout Checklist

This is the next practical step for taking SenangBah 2.0 from billing scaffold to a testable Stripe flow.

## 1. Local environment

Add these values to your local env file:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:

- `STRIPE_SECRET_KEY` comes from the Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` comes from the Stripe webhook endpoint
- `NEXT_PUBLIC_APP_URL` must match the app URL used for checkout success/cancel return

## 2. Vercel environment

Add the same billing env vars in Vercel project settings:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

Recommended production value:

```env
NEXT_PUBLIC_APP_URL=https://your-production-domain
```

## 3. Stripe dashboard setup

Create or confirm these pieces in Stripe:

1. A test mode account is active
2. A webhook endpoint points to:

```text
https://your-production-domain/api/stripe/webhook
```

3. Subscribe the webhook to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`

## 4. Product mapping

Current plan mapping in code:

- `language_pack` -> `RM29`
- `humanities_pack` -> `RM19`
- `math_pack` -> `RM19`
- `all_access` -> `RM59`

These prices are currently created inline in the Checkout Session request.

## 5. Test flow

Test this order:

1. Register a fresh student account
2. Open `/pricing`
3. Choose one paid plan
4. Open `/upgrade?plan=...`
5. Prepare checkout intent
6. Confirm Stripe session is created
7. Complete payment in Stripe test mode
8. Confirm webhook hits `/api/stripe/webhook`
9. Check Supabase tables:
   - `subscriptions`
   - `payments`
   - `entitlements`
10. Sign back into the student dashboard and confirm the correct bundle is unlocked

## 6. Known current behavior

- Checkout session creation is live-capable when Stripe env is present
- Webhook sync is scaffolded and should update billing tables
- Trial bootstrap still exists and may overlap with paid access during the trial window

## 7. Next engineering cleanup

After first successful Stripe test, the next cleanup should be:

1. Add subscription dedupe guards for repeated webhook delivery
2. Add billing event logs for easier debugging
3. Move inline Stripe price creation to fixed Stripe Prices or an internal price map
4. Add a post-payment success state on `/upgrade`
5. Reflect paid subscription state more explicitly in dashboard account cards
