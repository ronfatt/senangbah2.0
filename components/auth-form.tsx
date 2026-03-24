"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";

type AuthMode = "login" | "register";

const formCopy = {
  login: {
    eyebrow: "Welcome back",
    title: "Continue your AI learning journey.",
    helper: "Jump back into English, Bahasa Melayu, Sejarah, Geografi, Math, and Add Math with your saved progress waiting.",
    button: "Login to Continue Learning",
    success: "Signed in. Your learning dashboard is ready."
  },
  register: {
    eyebrow: "Start your account",
    title: "Start your 7-day full access trial.",
    helper: "Get instant access to the SenangBah AI learning platform and try missions across all six subjects.",
    button: "Register and Start Trial",
    success: "Account created and your 7-day full trial has been prepared."
  }
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasPublicSupabaseEnv()) {
      setStatus("Missing Supabase public env. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
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
      const message = error instanceof Error ? error.message : "Something went wrong.";
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
            <span>Full name</span>
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
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@email.com"
            required
            type="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
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
          {isLoading ? "Working..." : formCopy[mode].button}
        </button>
      </form>

      <p className="auth-status">
        {status ||
          (mode === "register"
            ? "Create your account to unlock your 7-day full trial."
            : "Login to continue your missions, points, and progress.")}
      </p>
    </section>
  );
}
