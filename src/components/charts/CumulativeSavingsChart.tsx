"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", savings: 1050 },
  { month: "Feb", savings: 2120 },
  { month: "Mar", savings: 3290 },
  { month: "Apr", savings: 3170 },
  { month: "May", savings: 3260 },
  { month: "Jun", savings: 3850 },
];

const chartConfig = {
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-2))",
  },
};

export default function CumulativeSavingsChart() {
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
