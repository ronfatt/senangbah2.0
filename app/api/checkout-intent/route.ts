import { NextResponse } from "next/server";
import { planDefinitions } from "../../../lib/plans";

const PAID_PLAN_CODES = ["language_pack", "humanities_pack", "math_pack", "all_access"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const planCode = String(body?.planCode || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!planCode) {
    return NextResponse.json({ ok: false, error: "missing_plan_code" }, { status: 400 });
  }

  if (!PAID_PLAN_CODES.includes(planCode)) {
    return NextResponse.json({ ok: false, error: "unsupported_plan_code" }, { status: 400 });
  }

  const plan = planDefinitions.find((item) => item.code === planCode);
  if (!plan) {
    return NextResponse.json({ ok: false, error: "plan_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    intent: {
      planCode: plan.code,
      planName: plan.name,
      priceLabel: plan.priceLabel,
      email: email || null,
      status: "placeholder_ready",
      checkoutPath: `/upgrade?plan=${plan.code}`,
      nextStep:
        "Replace this placeholder with a real payment provider session when checkout integration starts.",
      summary: {
        detail: plan.detail,
        points: plan.points
      }
    }
  });
}
