"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", food: 186, transport: 80, shopping: 200 },
  { month: "February", food: 305, transport: 200, shopping: 150 },
  { month: "March", food: 237, transport: 120, shopping: 180 },
  { month: "April", food: 73, transport: 190, shopping: 220 },
  { month: "May", food: 209, transport: 130, shopping: 250 },
  { month: "June", food: 214, transport: 140, shopping: 190 },
];

const chartConfig = {
  food: {
    label: "Food & Dining",
    color: "hsl(var(--chart-1))",
  },
  transport: {
    label: "Transportation",
    color: "hsl(var(--chart-2))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-3))",
  },
};

export default function MonthlySpendingChart() {
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
          <Bar dataKey="food" stackId="a" fill="var(--color-food)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="transport" stackId="a" fill="var(--color-transport)" />
          <Bar dataKey="shopping" stackId="a" fill="var(--color-shopping)" radius={[4, 0, 0, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
