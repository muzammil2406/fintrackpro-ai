"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", income: 1860, expense: 800 },
  { month: "Feb", income: 3050, expense: 1980 },
  { month: "Mar", income: 2370, expense: 1200 },
  { month: "Apr", income: 2780, expense: 2900 },
  { month: "May", income: 1890, expense: 1800 },
  { month: "Jun", income: 2390, expense: 1800 },
];

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

export default function IncomeExpenseChart() {
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
