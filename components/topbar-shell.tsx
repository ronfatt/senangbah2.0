"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hasPublicSupabaseEnv } from "../lib/env";
import { LOCALE_COOKIE, type AppLocale, getLocaleCopy } from "../lib/locale";
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

function LanguageToggle({
  locale,
  labels
}: {
  locale: AppLocale;
  labels: ReturnType<typeof getLocaleCopy>["nav"];
}) {
  function handleSwitch(nextLocale: AppLocale) {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="topbar-locale-switch" role="group" aria-label="Language switch">
      <button
        className={`topbar-locale-button${locale === "en" ? " is-active" : ""}`}
        onClick={() => handleSwitch("en")}
        type="button"
      >
        {labels.english}
      </button>
      <button
        className={`topbar-locale-button${locale === "ms" ? " is-active" : ""}`}
        onClick={() => handleSwitch("ms")}
        type="button"
      >
        {labels.malay}
      </button>
    </div>
  );
}

export function TopbarShell({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const [sessionState, setSessionState] = useState<SessionState>("signed_out");
  const copy = getLocaleCopy(locale);

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
  const publicHome = !signedIn && pathname === "/";

  return (
    <header
      className={`topbar${signedIn ? " is-app" : " is-public"}${publicHome ? " is-home" : ""}`}
    >
      <a className="brand" href={signedIn ? "/dashboard" : "/"}>
        <span className="brand-mark">{publicHome ? "✦" : "S"}</span>
        <span className="brand-copy">
          <strong>SenangBah</strong>
          <span>{signedIn ? copy.nav.appTagline : copy.nav.publicTagline}</span>
        </span>
      </a>

      <nav className="topnav">
        {signedIn ? (
          <>
            <span className="topbar-mode">{copy.nav.mode}</span>
            <NavLink href="/dashboard" label={copy.nav.dashboard} pathname={pathname} />
            <NavLink href="/my-subjects" label={copy.nav.mySubjects} pathname={pathname} />
            <NavLink href="/progress" label={copy.nav.progress} pathname={pathname} />
            <NavLink href="/avatar" label={copy.nav.avatar} pathname={pathname} />
            <LanguageToggle labels={copy.nav} locale={locale} />
            <button className="topnav-ghost" onClick={handleSignOut} type="button">
              {copy.nav.logout}
            </button>
          </>
        ) : (
          <>
            {publicHome ? (
              <>
                <NavLink href="/login" label={copy.nav.login} pathname={pathname} />
                <a className="topnav-cta is-home-cta" href="/register">
                  {copy.nav.startTrial}
                </a>
              </>
            ) : (
              <>
                <NavLink href="/how-it-works" label={copy.nav.howItWorks} pathname={pathname} />
                <NavLink href="/subjects" label={copy.nav.subjects} pathname={pathname} />
                <NavLink href="/pricing" label={copy.nav.pricing} pathname={pathname} />
                <NavLink href="/login" label={copy.nav.login} pathname={pathname} />
                <LanguageToggle labels={copy.nav} locale={locale} />
                <a className="topnav-cta" href="/register">
                  {copy.nav.start}
                </a>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
