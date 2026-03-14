import { planDefinitions } from "./plans";

export type BillingProvider = "stripe_placeholder";

export function getBillingProvider(): BillingProvider {
  return "stripe_placeholder";
}

export function hasStripeServerEnv() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_APP_URL);
}

export function getPaidPlanDefinition(planCode: string) {
  return planDefinitions.find((plan) =>
    ["language_pack", "humanities_pack", "math_pack", "all_access"].includes(plan.code) && plan.code === planCode
  );
}

export function buildCheckoutReturnUrls(planCode: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    successUrl: `${appUrl}/dashboard?billing=success&plan=${planCode}`,
    cancelUrl: `${appUrl}/upgrade?plan=${planCode}&status=cancelled`
  };
}
