export type AppLocale = "en" | "ms";

export const LOCALE_COOKIE = "sb-locale";

export function normalizeLocale(value: string | null | undefined): AppLocale {
  return value === "ms" ? "ms" : "en";
}

export function getSubjectDisplayName(subject: string, locale: AppLocale) {
  const names: Record<string, { en: string; ms: string }> = {
    English: { en: "English", ms: "Bahasa Inggeris" },
    "Bahasa Melayu": { en: "Bahasa Melayu", ms: "Bahasa Melayu" },
    Sejarah: { en: "Sejarah", ms: "Sejarah" },
    Geografi: { en: "Geografi", ms: "Geografi" },
    Math: { en: "Math", ms: "Matematik" },
    "Add Math": { en: "Add Math", ms: "Matematik Tambahan" },
    Humanities: { en: "Humanities", ms: "Kemanusiaan" }
  };

  return names[subject]?.[locale] || subject;
}

export const localeCopy = {
  en: {
    nav: {
      publicTagline: "AI Study Platform",
      appTagline: "Student Dashboard",
      mode: "Dashboard",
      dashboard: "Dashboard",
      mySubjects: "My Subjects",
      progress: "Progress Report",
      avatar: "Avatar",
      logout: "Log Out",
      howItWorks: "How It Works",
      subjects: "Subjects",
      pricing: "Pricing",
      login: "Login",
      start: "Start My AI Learning",
      startTrial: "Start Free Trial",
      english: "EN",
      malay: "BM"
    },
    common: {
      startNow: "Start now",
      openDetails: "Open details",
      openProgressReport: "Open Progress Report",
      openMySubjects: "Open My Subjects",
      backToDashboard: "Back to Dashboard",
      comparePlans: "Compare plans",
      viewMemberships: "View Memberships",
      openAvatarCloset: "Open Avatar Closet",
      signedOut: "Signed out. Login or register to continue learning."
    },
    auth: {
      fullName: "Full name",
      email: "Email",
      password: "Password",
      working: "Working...",
      missingEnv:
        "Missing Supabase public env. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    }
  },
  ms: {
    nav: {
      publicTagline: "Platform Pembelajaran AI",
      appTagline: "Dashboard Pelajar",
      mode: "Dashboard",
      dashboard: "Dashboard",
      mySubjects: "Subjek Saya",
      progress: "Laporan Kemajuan",
      avatar: "Avatar",
      logout: "Log Keluar",
      howItWorks: "Cara Ia Berfungsi",
      subjects: "Subjek",
      pricing: "Harga",
      login: "Log Masuk",
      start: "Mula Belajar Dengan AI",
      startTrial: "Mula Percubaan Percuma",
      english: "EN",
      malay: "BM"
    },
    common: {
      startNow: "Mula sekarang",
      openDetails: "Buka butiran",
      openProgressReport: "Buka Laporan Kemajuan",
      openMySubjects: "Buka Subjek Saya",
      backToDashboard: "Kembali ke Dashboard",
      comparePlans: "Bandingkan pelan",
      viewMemberships: "Lihat Keahlian",
      openAvatarCloset: "Buka Almari Avatar",
      signedOut: "Anda telah log keluar. Log masuk atau daftar untuk terus belajar."
    },
    auth: {
      fullName: "Nama penuh",
      email: "E-mel",
      password: "Kata laluan",
      working: "Sedang diproses...",
      missingEnv:
        "Env awam Supabase tiada. Tambah NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
    }
  }
} as const;

export function getLocaleCopy(locale: AppLocale) {
  return localeCopy[locale];
}
