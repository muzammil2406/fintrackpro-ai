"use client";

import * as React from "react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/lib/supabase/hooks";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function lastSixMonths() {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: format(d, "MMM") });
  }
  return months;
}

export default function MonthlySpendingChart() {
  const { transactions, loading } = useTransactions();

  const { chartData, chartConfig } = useMemo(() => {
    const months = lastSixMonths();
    const categoryTotals: Record<string, number> = {};
    const monthKeys = months.map(m => m.key);

    transactions.forEach((t) => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthKeys.includes(key)) return;
      categoryTotals[t.category] = (categoryTotals[t.category] ?? 0) + t.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const data = months.map((m) => {
      const row: Record<string, string | number> = { month: m.label };
      topCategories.forEach((cat) => {
        row[cat] = Math.round(
          transactions
            .filter((t) => {
              const d = new Date(t.date);
              return t.type === 'expense' && t.category === cat && `${d.getFullYear()}-${d.getMonth()}` === m.key;
            })
            .reduce((a, t) => a + t.amount, 0)
        );
      });
      return row;
    });

    const config: Record<string, { label: string; color: string }> = {};
    topCategories.forEach((cat, i) => {
      config[cat] = { label: cat, color: CHART_COLORS[i % CHART_COLORS.length] };
    });

    return { chartData: data, chartConfig: config };
  }, [transactions]);

  if (loading) return <Skeleton className="h-[300px] w-full" />;

  if (chartData.length === 0 || Object.keys(chartConfig).length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No spending data yet.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            width={80}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend />
          {Object.keys(chartConfig).map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={`var(--color-${cat})`}
              radius={i === Object.keys(chartConfig).length - 1 ? [4, 0, 0, 4] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
