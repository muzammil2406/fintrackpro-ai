'use client'

import SummaryCards from "@/components/SummaryCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import ExpenseBreakdownChart from "@/components/charts/ExpenseBreakdownChart";
import RecentTransactions from "@/components/RecentTransactions";
import InsightsPanel from "@/components/InsightsPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Here's a summary of your financial activity.</p>
      </div>

      <SummaryCards />
      
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Income vs. Expense</CardTitle>
            <CardDescription>For the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>For the current month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseBreakdownChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <InsightsPanel />
      </div>
    </div>
  );
}