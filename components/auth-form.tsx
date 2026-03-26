"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLocaleCopy, type AppLocale } from "../lib/locale";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";

type AuthMode = "login" | "register";

export function AuthForm({ mode, locale }: { mode: AuthMode; locale: AppLocale }) {
  const router = useRouter();
  const copy = getLocaleCopy(locale);
  const formCopy = {
    login: {
      eyebrow: locale === "ms" ? "Selamat kembali" : "Welcome back",
      title: locale === "ms" ? "Sambung semula perjalanan pembelajaran AI anda." : "Continue your AI learning journey.",
      helper:
        locale === "ms"
          ? "Masuk semula ke Bahasa Inggeris, Bahasa Melayu, Sejarah, Geografi, Matematik, dan Matematik Tambahan dengan semua kemajuan anda menunggu."
          : "Jump back into English, Bahasa Melayu, Sejarah, Geografi, Math, and Add Math with your saved progress waiting.",
      button: locale === "ms" ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning",
      success: locale === "ms" ? "Berjaya log masuk. Dashboard pembelajaran anda sudah sedia." : "Signed in. Your learning dashboard is ready."
    },
    register: {
      eyebrow: locale === "ms" ? "Mulakan akaun anda" : "Start your account",
      title: locale === "ms" ? "Mulakan percubaan akses penuh 7 hari anda." : "Start your 7-day full access trial.",
      helper:
        locale === "ms"
          ? "Dapatkan akses segera ke platform pembelajaran AI SenangBah dan cuba misi untuk keenam-enam subjek."
          : "Get instant access to the SenangBah AI learning platform and try missions across all six subjects.",
      button: locale === "ms" ? "Daftar dan Mulakan Percubaan" : "Register and Start Trial",
      success:
        locale === "ms"
          ? "Akaun berjaya dicipta dan percubaan penuh 7 hari anda sudah disediakan."
          : "Account created and your 7-day full trial has been prepared."
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasPublicSupabaseEnv()) {
      setStatus(copy.auth.missingEnv);
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      let bootstrapPayload:
        | {
            authUserId: string;
            email?: string;
            fullName: string;
          }
        | null = null;

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const user = data.user;

        if (user) {
          bootstrapPayload = {
            authUserId: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || ""
          };
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;

        const user = data.user;
        if (user) {
          bootstrapPayload = {
            authUserId: user.id,
            email: user.email,
            fullName
          };
        }
      }

      if (bootstrapPayload) {
        const bootstrapResponse = await fetch("/api/auth/bootstrap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bootstrapPayload)
        });

        const bootstrapResult = await bootstrapResponse.json().catch(() => ({}));
        if (!bootstrapResponse.ok || !bootstrapResult?.ok) {
          throw new Error(bootstrapResult?.error || "bootstrap_failed");
        }
      }

      setStatus(formCopy[mode].success);
      router.push(mode === "register" ? "/welcome" : "/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : locale === "ms"
            ? "Sesuatu telah berlaku."
            : "Something went wrong.";
      setStatus(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="section-heading auth-heading">
        <p className="eyebrow">{formCopy[mode].eyebrow}</p>
        <h1>{formCopy[mode].title}</h1>
        <p className="dashboard-helper auth-helper">{formCopy[mode].helper}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className="field">
            <span>{copy.auth.fullName}</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Aisyah"
              required
              type="text"
            />
          </label>
        ) : null}

        <label className="field">
          <span>{copy.auth.email}</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@email.com"
            required
            type="email"
          />
        </label>

        <label className="field">
          <span>{copy.auth.password}</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            type="password"
          />
        </label>

        <button className="btn btn-primary auth-submit" disabled={isLoading} type="submit">
          {isLoading ? copy.auth.working : formCopy[mode].button}
        </button>
      </form>

      <p className="auth-status">
        {status ||
          (mode === "register"
            ? locale === "ms"
              ? "Cipta akaun anda untuk membuka percubaan penuh 7 hari."
              : "Create your account to unlock your 7-day full trial."
            : locale === "ms"
              ? "Log masuk untuk teruskan misi, mata, dan kemajuan anda."
              : "Login to continue your missions, points, and progress.")}
      </p>
    </section>
  );
}
