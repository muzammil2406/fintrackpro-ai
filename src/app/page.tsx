'use client';

import { useUser } from "@/lib/supabase/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, BrainCircuit, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
     return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
            </div>
            <div className="grid gap-6 lg:grid-cols-5 mt-6">
                <Skeleton className="lg:col-span-3 h-80 rounded-lg" />
                <Skeleton className="lg:col-span-2 h-80 rounded-lg" />
            </div>
        </div>
      </div>
    )
  }

  // If not authenticated, and not initialising, show the landing page.
  return <LandingPage />;
}

function LandingPage() {
  const features = [
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: "Smart Tracking",
      description: "Effortlessly monitor your income and expenses in real-time.",
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "AI Insights",
      description: "Receive personalized financial advice and predictions from our AI.",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
      title: "Visual Analytics",
      description: "Understand your spending with beautiful, interactive charts.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Budget Management",
      description: "Set budgets, get alerts, and stay on top of your financial goals.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">Finance Tracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/10 -z-10" />
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Master Your Money
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The intelligent personal finance tracker that helps you save more, spend smarter, and achieve
                your financial goals.
              </p>
            </div>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Features for Financial Freedom</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful tools to give you a complete picture of your financial health.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col gap-2 items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Finance Tracker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default App;
