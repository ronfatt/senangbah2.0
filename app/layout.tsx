import "./globals.css";

export const metadata = {
  title: "SenangBah 2.0",
  description: "A premium multi-subject learning platform for student growth."
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
                <strong>SenangBah 2.0</strong>
                <span>Vercel + Supabase rebuild</span>
              </span>
            </a>
            <nav className="topnav">
              <a href="/blueprint">Blueprint</a>
              <a href="/schema">Schema</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/avatar">Avatar</a>
              <a href="/subjects">Subjects</a>
              <a href="/pricing">Pricing</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
