import { NextResponse } from "next/server";
import {
  buildCheckoutReturnUrls,
  getBillingProvider,
  getPaidPlanDefinition,
  hasStripeServerEnv
} from "../../../lib/billing";
import { getStripeServerClient } from "../../../lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const planCode = String(body?.planCode || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!planCode) {
    return NextResponse.json({ ok: false, error: "missing_plan_code" }, { status: 400 });
  }

  const plan = getPaidPlanDefinition(planCode);
  if (!plan) {
    return NextResponse.json({ ok: false, error: "unsupported_plan_code" }, { status: 400 });
  }

  const provider = getBillingProvider();
  const urls = buildCheckoutReturnUrls(planCode);

  if (!hasStripeServerEnv()) {
    return NextResponse.json({
      ok: true,
      session: {
        mode: "placeholder",
        provider,
        planCode: plan.code,
        planName: plan.name,
        priceLabel: plan.priceLabel,
        email: email || null,
        checkoutUrl: `/upgrade?plan=${plan.code}&status=provider-env-missing`,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
        message: "Stripe env is not configured yet. Replace this placeholder response with a real Stripe Checkout Session."
      }
    });
  }

  try {
    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
      customer_email: email || undefined,
      metadata: {
        plan_code: plan.code,
        plan_name: plan.name
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "myr",
            unit_amount: plan.priceCents,
            recurring: {
              interval: "month"
            },
            product_data: {
              name: plan.name,
              description: plan.detail
            }
          }
        }
      ]
    });

    return NextResponse.json({
      ok: true,
      session: {
        mode: "stripe_checkout",
        provider,
        planCode: plan.code,
        planName: plan.name,
        priceLabel: plan.priceLabel,
        email: email || null,
        checkoutUrl: session.url || `/upgrade?plan=${plan.code}&status=stripe-session-created`,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
        message: "Stripe Checkout Session created successfully.",
        sessionId: session.id
      }
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      session: {
        mode: "placeholder",
        provider,
        planCode: plan.code,
        planName: plan.name,
        priceLabel: plan.priceLabel,
        email: email || null,
        checkoutUrl: `/upgrade?plan=${plan.code}&status=stripe-error`,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
        message:
          error instanceof Error
            ? `Stripe session fallback: ${error.message}`
            : "Stripe session fallback triggered."
      }
    });
  }
}
