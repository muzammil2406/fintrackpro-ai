import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FinanceAI account to manage your finances.",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm />
    </div>
  );
}
