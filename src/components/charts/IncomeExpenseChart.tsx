"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/lib/supabase/hooks";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
};

function lastSixMonths() {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: format(d, "MMM") });
  }
  return months;
}

export default function IncomeExpenseChart() {
  const { transactions, loading } = useTransactions();

  const chartData = lastSixMonths().map((m) => {
    const monthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return `${d.getFullYear()}-${d.getMonth()}` === m.key;
    });
    return {
      month: m.label,
      income: Math.round(monthTxs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)),
      expense: Math.round(monthTxs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)),
    };
  });

  if (loading) return <Skeleton className="h-[300px] w-full" />;

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
           <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
