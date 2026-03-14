import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <AuthForm mode="login" />
    </main>
  );
}
