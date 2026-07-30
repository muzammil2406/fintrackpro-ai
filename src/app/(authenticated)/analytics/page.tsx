import type { Metadata } from "next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import MonthlySpendingChart from "@/components/charts/MonthlySpendingChart";
  import CumulativeSavingsChart from "@/components/charts/CumulativeSavingsChart";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Dive deep into your financial data with interactive charts and analytics.",
};

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-semibold">Analytics</h1>
                <p className="text-muted-foreground">Dive deeper into your financial data.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Spending by Category</CardTitle>
                        <CardDescription>See how your spending varies each month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MonthlySpendingChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Cumulative Savings</CardTitle>
                        <CardDescription>Track your savings growth over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CumulativeSavingsChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
