import type Stripe from "stripe";
import { getSupabaseServerClient } from "./supabase/server";

type PlanRecord = {
  id: string;
  code: string;
  metadata: {
    subject_codes?: string[];
  } | null;
};

async function findUserIdByEmail(email?: string | null) {
  if (!email) return null;

  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).limit(1);
  return data?.[0]?.id || null;
}

async function findPlanByCode(planCode?: string | null): Promise<PlanRecord | null> {
  if (!planCode) return null;

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("plans")
    .select("id, code, metadata")
    .eq("code", planCode)
    .limit(1);

  return (data?.[0] as PlanRecord | undefined) || null;
}

async function findSubjectsByCodes(subjectCodes: string[]) {
  if (!subjectCodes.length) return [];

  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("subjects").select("id, code").in("code", subjectCodes);
  return data || [];
}

export async function syncSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const customerEmail =
    typeof subscription.customer === "object" && "email" in subscription.customer
      ? subscription.customer.email
      : subscription.metadata?.customer_email || null;
  const planCode = subscription.metadata?.plan_code || null;

  const userId = await findUserIdByEmail(customerEmail);
  const plan = await findPlanByCode(planCode);
  if (!userId || !plan) {
    return {
      ok: false,
      reason: "missing_user_or_plan"
    };
  }

  const supabase = getSupabaseServerClient();
  const currentPeriodStart = subscription.items.data[0]?.current_period_start
    ? new Date(subscription.items.data[0].current_period_start * 1000).toISOString()
    : null;
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end
    ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
    : null;

  const { data: existingSubscriptions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscription.id)
    .limit(1);

  let subscriptionId = existingSubscriptions?.[0]?.id || null;

  if (subscriptionId) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        user_id: userId,
        plan_id: plan.id,
        status: subscription.status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        metadata: subscription,
        updated_at: new Date().toISOString()
      })
      .eq("id", subscriptionId);

    if (error) throw error;
  } else {
    const { data: inserted, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_id: plan.id,
        provider: "stripe",
        provider_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        metadata: subscription
      })
      .select("id")
      .limit(1);

    if (error) throw error;
    subscriptionId = inserted?.[0]?.id || null;
  }

  const subjectCodes = Array.isArray(plan.metadata?.subject_codes) ? plan.metadata.subject_codes : [];
  const subjects = await findSubjectsByCodes(subjectCodes);

  await supabase
    .from("entitlements")
    .update({
      is_active: false,
      ends_at: currentPeriodEnd
    })
    .eq("user_id", userId)
    .eq("source", "stripe_subscription");

  if (subjects.length && subscription.status !== "canceled" && subscription.status !== "unpaid") {
    const entitlementRows = subjects.map((subject) => ({
      user_id: userId,
      plan_id: plan.id,
      subject_id: subject.id,
      entitlement_type: "subject_access",
      source: "stripe_subscription",
      starts_at: currentPeriodStart,
      ends_at: currentPeriodEnd,
      is_active: true,
      metadata: {
        provider: "stripe",
        provider_subscription_id: subscription.id,
        subject_code: subject.code,
        plan_code: plan.code
      }
    }));

    const { error } = await supabase.from("entitlements").insert(entitlementRows);
    if (error) throw error;
  }

  return {
    ok: true,
    userId,
    subscriptionId,
    planCode: plan.code
  };
}

export async function cancelSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const supabase = getSupabaseServerClient();

  const { data: rows } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("provider", "stripe")
    .eq("provider_subscription_id", subscription.id)
    .limit(1);

  const row = rows?.[0];
  if (!row) {
    return {
      ok: false,
      reason: "subscription_not_found"
    };
  }

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: true,
      current_period_end: subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
      metadata: subscription
    })
    .eq("id", row.id);

  await supabase
    .from("entitlements")
    .update({
      is_active: false,
      ends_at: new Date().toISOString()
    })
    .eq("user_id", row.user_id)
    .eq("source", "stripe_subscription");

  return {
    ok: true,
    subscriptionId: row.id,
    userId: row.user_id
  };
}

export async function recordPaymentFromStripeInvoice(invoice: Stripe.Invoice) {
  const customerEmail =
    typeof invoice.customer_email === "string" ? invoice.customer_email : invoice.customer_email || null;
  const userId = await findUserIdByEmail(customerEmail);
  if (!userId) {
    return {
      ok: false,
      reason: "user_not_found"
    };
  }

  const supabase = getSupabaseServerClient();
  let subscriptionId: string | null = null;
  const invoiceRecord = invoice as unknown as {
    subscription?: string | null;
    parent?: {
      subscription_details?: {
        subscription?: string | null;
      } | null;
    } | null;
  };
  const stripeSubscriptionId =
    invoiceRecord.subscription ||
    invoiceRecord.parent?.subscription_details?.subscription ||
    null;

  if (typeof stripeSubscriptionId === "string") {
    const { data: subscriptionRows } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("provider", "stripe")
      .eq("provider_subscription_id", stripeSubscriptionId)
      .limit(1);

    subscriptionId = subscriptionRows?.[0]?.id || null;
  }

  const invoicePaymentRecord = invoice as unknown as {
    payment_intent?: string | null;
  };
  const providerPaymentId =
    typeof invoicePaymentRecord.payment_intent === "string"
      ? invoicePaymentRecord.payment_intent
      : invoice.id;

  const { data: existingPayments } = await supabase
    .from("payments")
    .select("id")
    .eq("provider", "stripe")
    .eq("provider_payment_id", providerPaymentId)
    .limit(1);

  if (existingPayments?.length) {
    return {
      ok: true,
      paymentId: existingPayments[0].id,
      deduped: true
    };
  }

  const { data: inserted, error } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      subscription_id: subscriptionId,
      provider: "stripe",
      provider_payment_id: providerPaymentId,
      status: invoice.status || "paid",
      currency: (invoice.currency || "myr").toUpperCase(),
      amount_cents: invoice.amount_paid || 0,
      paid_at: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : new Date().toISOString(),
      metadata: invoice
    })
    .select("id")
    .limit(1);

  if (error) throw error;

  return {
    ok: true,
    paymentId: inserted?.[0]?.id || null
  };
}
