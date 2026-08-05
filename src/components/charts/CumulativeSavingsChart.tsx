"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/lib/supabase/hooks";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-2))",
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

export default function CumulativeSavingsChart() {
  const { transactions, loading } = useTransactions();

  const chartData = (() => {
    let runningTotal = 0;
    return lastSixMonths().map((m) => {
      const monthTxs = transactions.filter((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${d.getMonth()}` === m.key;
      });
      const income = monthTxs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
      runningTotal += income - expense;
      return { month: m.label, savings: Math.round(runningTotal) };
    });
  })();

  if (loading) return <Skeleton className="h-[300px] w-full" />;

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Area type="monotone" dataKey="savings" stroke="var(--color-savings)" fillOpacity={1} fill="url(#colorSavings)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
