import "./globals.css";
import { TopbarShell } from "../components/topbar-shell";

export const metadata = {
  title: "SenangBah",
  description:
    "AI-powered SPM study platform for English, Bahasa Melayu, Sejarah, Geografi, Math, and Add Math with clear missions, feedback, and trackable progress."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-frame">
          <TopbarShell />
          {children}
        </div>
      </body>
    </html>
  );
}
