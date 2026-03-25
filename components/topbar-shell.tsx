"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

type SessionState = "signed_in" | "signed_out";

function NavLink({
  href,
  label,
  pathname
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <a className={`topnav-link${isActive ? " is-active" : ""}`} href={href}>
      {label}
    </a>
  );
}

export function TopbarShell() {
  const pathname = usePathname();
  const [sessionState, setSessionState] = useState<SessionState>("signed_out");

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "signed_in" : "signed_out");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionState(session ? "signed_in" : "signed_out");
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    if (!hasPublicSupabaseEnv()) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const signedIn = sessionState === "signed_in";

  return (
    <header className={`topbar${signedIn ? " is-app" : " is-public"}`}>
      <a className="brand" href={signedIn ? "/dashboard" : "/"}>
        <span className="brand-mark">S</span>
        <span className="brand-copy">
          <strong>SenangBah</strong>
          <span>{signedIn ? "Student Dashboard" : "AI Study Platform"}</span>
        </span>
      </a>

      <nav className="topnav">
        {signedIn ? (
          <>
            <span className="topbar-mode">Dashboard</span>
            <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
            <NavLink href="/subjects" label="Subjects" pathname={pathname} />
            <NavLink href="/progress" label="Progress Report" pathname={pathname} />
            <NavLink href="/avatar" label="Avatar" pathname={pathname} />
            <button className="topnav-ghost" onClick={handleSignOut} type="button">
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink href="/how-it-works" label="How It Works" pathname={pathname} />
            <NavLink href="/#subjects" label="Subjects" pathname={pathname} />
            <NavLink href="/pricing" label="Pricing" pathname={pathname} />
            <NavLink href="/login" label="Login" pathname={pathname} />
            <a className="topnav-cta" href="/register">
              Start My AI Learning
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
