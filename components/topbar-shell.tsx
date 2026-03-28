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
  const [profileName, setProfileName] = useState("Aisyah Rahman");
  const [profileSubtitle, setProfileSubtitle] = useState("");
  const copy = getLocaleCopy(locale);

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      const derivedName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Student";

      setProfileName(derivedName);
      setProfileSubtitle(user?.email || "");
      setSessionState(data.session ? "signed_in" : "signed_out");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const derivedName =
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0] ||
        "Student";

      setProfileName(derivedName);
      setProfileSubtitle(session?.user?.email || "");
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
  const initials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

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
            <NavLink href="/dashboard" label={copy.nav.dashboard} pathname={pathname} />
            <NavLink href="/my-subjects" label={copy.nav.mySubjects} pathname={pathname} />
            <NavLink href="/progress" label={copy.nav.progress} pathname={pathname} />
            <NavLink href="/avatar" label={copy.nav.avatar} pathname={pathname} />
          </>
        ) : (
          <>
            {publicHome ? (
              <>
                <NavLink href="/how-it-works" label={copy.nav.howItWorks} pathname={pathname} />
                <NavLink href="/subjects" label={copy.nav.subjects} pathname={pathname} />
                <NavLink href="/pricing" label={copy.nav.pricing} pathname={pathname} />
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

      {signedIn ? (
        <div className="topbar-profile">
          <div className="topbar-profile-copy">
            <strong>{profileName}</strong>
            <span>{profileSubtitle || copy.nav.appTagline}</span>
          </div>
          <span className="topbar-profile-badge">{initials || "SB"}</span>
          <button className="topnav-ghost topbar-signout" onClick={handleSignOut} type="button">
            {copy.nav.logout}
          </button>
        </div>
      ) : null}
    </header>
  );
}
