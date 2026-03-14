"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";

type UpgradeIntentPanelProps = {
  planCode: string;
  planName: string;
  priceLabel: string;
};

type CheckoutIntent = {
  planCode: string;
  planName: string;
  priceLabel: string;
  email: string | null;
  status: string;
  checkoutPath: string;
  nextStep: string;
  summary: {
    detail: string;
    points: string[];
  };
};

type CheckoutSessionPreview = {
  mode: string;
  provider: string;
  planCode: string;
  planName: string;
  priceLabel: string;
  email: string | null;
  checkoutUrl: string;
  successUrl: string;
  cancelUrl: string;
  message: string;
  sessionId?: string;
};

export function UpgradeIntentPanel({ planCode, planName, priceLabel }: UpgradeIntentPanelProps) {
  const [intent, setIntent] = useState<CheckoutIntent | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionPreview | null>(null);
  const [status, setStatus] = useState("Create a checkout placeholder to confirm the upgrade path.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePrepare() {
    setIsSubmitting(true);
    setStatus("");

    try {
      let email = "";

      if (hasPublicSupabaseEnv()) {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session }
        } = await supabase.auth.getSession();
        email = session?.user?.email || "";
      }

      const response = await fetch("/api/checkout-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode,
          email
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "checkout_intent_failed");
      }

      setIntent(payload.intent);

      const sessionResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode,
          email
        })
      });

      const sessionPayload = await sessionResponse.json().catch(() => ({}));
      if (!sessionResponse.ok || !sessionPayload?.ok) {
        throw new Error(sessionPayload?.error || "create_checkout_session_failed");
      }

      setCheckoutSession(sessionPayload.session);
      setStatus(`Checkout placeholder ready for ${payload.intent.planName}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to prepare checkout placeholder.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="feature-panel">
      <p className="eyebrow">Checkout intent</p>
      <h2>Prepare {planName} for payment wiring.</h2>
      <p className="dashboard-helper">
        {priceLabel} placeholder flow. This is where Stripe or another payment provider will hook in later.
      </p>

      <div className="hero-actions">
        <button className="btn btn-primary" disabled={isSubmitting} onClick={handlePrepare} type="button">
          {isSubmitting ? "Preparing..." : `Prepare ${planName}`}
        </button>
      </div>

      {intent ? (
        <div className="momentum-stack">
          <div className="momentum-item">
            <span className="dashboard-label">Intent status</span>
            <strong>{intent.status}</strong>
            <p className="dashboard-helper">{intent.nextStep}</p>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">Plan</span>
            <strong>
              {intent.planName} · {intent.priceLabel}
            </strong>
            <p className="dashboard-helper">{intent.summary.detail}</p>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">Identity</span>
            <strong>{intent.email || "Guest preview"}</strong>
            <p className="dashboard-helper">When real checkout starts, this will attach to the payment customer.</p>
          </div>
          {checkoutSession ? (
            <div className="momentum-item">
              <span className="dashboard-label">Checkout session</span>
              <strong>{checkoutSession.provider}</strong>
              <p className="dashboard-helper">{checkoutSession.message}</p>
              {checkoutSession.sessionId ? (
                <p className="dashboard-helper">Session: {checkoutSession.sessionId}</p>
              ) : null}
              <p className="dashboard-helper">Success: {checkoutSession.successUrl}</p>
              <p className="dashboard-helper">Cancel: {checkoutSession.cancelUrl}</p>
              <a className="mini-link" href={checkoutSession.checkoutUrl}>
                Open checkout target
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="auth-status">{status}</p>
    </section>
  );
}
