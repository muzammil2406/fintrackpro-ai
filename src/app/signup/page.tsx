import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free FinanceAI account to track your income, expenses, and budgets.",
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignupForm />
    </div>
  );
}
