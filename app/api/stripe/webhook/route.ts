import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cancelSubscriptionFromStripe, recordPaymentFromStripeInvoice, syncSubscriptionFromStripe } from "../../../../lib/billing-sync";
import { getStripeServerClient } from "../../../../lib/stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "stripe_webhook_env_missing" }, { status: 500 });
  }

  const stripe = getStripeServerClient();
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "invalid_webhook_signature"
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        return NextResponse.json({
          ok: true,
          received: true,
          eventType: event.type,
          note: "Checkout completed. Awaiting subscription/invoice events for billing sync."
        });
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const result = await syncSubscriptionFromStripe(event.data.object as Stripe.Subscription);
        return NextResponse.json({
          ok: true,
          received: true,
          eventType: event.type,
          result
        });
      }
      case "customer.subscription.deleted": {
        const result = await cancelSubscriptionFromStripe(event.data.object as Stripe.Subscription);
        return NextResponse.json({
          ok: true,
          received: true,
          eventType: event.type,
          result
        });
      }
      case "invoice.paid": {
        const result = await recordPaymentFromStripeInvoice(event.data.object as Stripe.Invoice);
        return NextResponse.json({
          ok: true,
          received: true,
          eventType: event.type,
          result
        });
      }
      default:
        return NextResponse.json({
          ok: true,
          received: true,
          eventType: event.type,
          ignored: true
        });
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        eventType: event.type,
        error: error instanceof Error ? error.message : "stripe_webhook_failed"
      },
      { status: 500 }
    );
  }
}
