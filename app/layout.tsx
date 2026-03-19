import "./globals.css";

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
          <header className="topbar">
            <a className="brand" href="/">
              <span className="brand-mark">S</span>
              <span className="brand-copy">
                <strong>SenangBah</strong>
                <span>AI Study Platform</span>
              </span>
            </a>
            <nav className="topnav">
              <a href="/#how-it-works">How It Works</a>
              <a href="/#features">Features</a>
              <a href="/#progress">Progress</a>
              <a href="/login">Login</a>
              <a className="topnav-cta" href="/register">Register</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
