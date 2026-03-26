import "./globals.css";
import { TopbarShell } from "../components/topbar-shell";
import { getServerLocale } from "../lib/server-locale";

export const metadata = {
  title: "SenangBah",
  description:
    "AI-powered SPM study platform for English, Bahasa Melayu, Sejarah, Geografi, Math, and Add Math with clear missions, feedback, and trackable progress."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();

  return (
    <html lang={locale}>
      <body>
        <div className="site-frame">
          <TopbarShell locale={locale} />
          {children}
        </div>
      </body>
    </html>
  );
}
