"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";

type UpgradeIntentPanelProps = {
  planCode: string;
  planName: string;
  priceLabel: string;
  locale: AppLocale;
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

export function UpgradeIntentPanel({ planCode, planName, priceLabel, locale }: UpgradeIntentPanelProps) {
  const isMalay = locale === "ms";
  const [intent, setIntent] = useState<CheckoutIntent | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionPreview | null>(null);
  const [status, setStatus] = useState(
    isMalay
      ? "Pilih keahlian ini apabila anda sudah bersedia untuk terus belajar dengan akses penuh."
      : "Choose this membership when you are ready to continue learning with full access."
  );
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
      setStatus(
        isMalay
          ? `${payload.intent.planName} sudah sedia. Anda boleh teruskan ke langkah pembayaran apabila mahu.`
          : `${payload.intent.planName} is ready. You can continue into the payment step when you want.`
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : isMalay
            ? "Tidak dapat menyediakan langkah keahlian anda sekarang."
            : "Unable to prepare your membership step right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="feature-panel">
      <p className="eyebrow">{isMalay ? "Langkah seterusnya" : "Next step"}</p>
      <h2>{isMalay ? `Sediakan ${planName}.` : `Get ${planName} ready.`}</h2>
      <p className="dashboard-helper">
        {isMalay
          ? `Laluan keahlian ${priceLabel}. Ini akan mengesahkan pelan, akaun anda, dan langkah pembayaran seterusnya.`
          : `${priceLabel} membership path. This will confirm the plan, your account, and the next payment step.`}
      </p>

      <div className="hero-actions">
        <button className="btn btn-primary" disabled={isSubmitting} onClick={handlePrepare} type="button">
          {isSubmitting
            ? isMalay
              ? "Sedang disediakan..."
              : "Getting it ready..."
            : isMalay
              ? `Teruskan dengan ${planName}`
              : `Continue with ${planName}`}
        </button>
      </div>

      {intent ? (
        <div className="momentum-stack">
          <div className="momentum-item">
            <span className="dashboard-label">{isMalay ? "Status" : "Status"}</span>
            <strong>{intent.status}</strong>
            <p className="dashboard-helper">{intent.nextStep}</p>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">{isMalay ? "Keahlian" : "Membership"}</span>
            <strong>
              {intent.planName} · {intent.priceLabel}
            </strong>
            <p className="dashboard-helper">{intent.summary.detail}</p>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">{isMalay ? "Akaun" : "Account"}</span>
            <strong>{intent.email || (isMalay ? "Pratonton tetamu" : "Guest preview")}</strong>
            <p className="dashboard-helper">
              {isMalay
                ? "Keahlian anda akan dipautkan pada akaun ini apabila checkout selesai."
                : "Your membership will attach to this account when checkout is complete."}
            </p>
          </div>
          {checkoutSession ? (
            <div className="momentum-item">
              <span className="dashboard-label">{isMalay ? "Langkah pembayaran" : "Payment step"}</span>
              <strong>{checkoutSession.provider}</strong>
              <p className="dashboard-helper">{checkoutSession.message}</p>
              {checkoutSession.sessionId ? (
                <p className="dashboard-helper">{isMalay ? "Sesi" : "Session"}: {checkoutSession.sessionId}</p>
              ) : null}
              <p className="dashboard-helper">{isMalay ? "Berjaya" : "Success"}: {checkoutSession.successUrl}</p>
              <p className="dashboard-helper">{isMalay ? "Batal" : "Cancel"}: {checkoutSession.cancelUrl}</p>
              <a className="mini-link" href={checkoutSession.checkoutUrl}>
                {isMalay ? "Buka langkah pembayaran" : "Open payment step"}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="auth-status">{status}</p>
    </section>
  );
}
