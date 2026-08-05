"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useTransactions, useCategories } from "@/lib/supabase/hooks"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExpenseBreakdownChart() {
  const id = "pie-interactive"
  const { transactions, loading } = useTransactions();
  const { categories } = useCategories();
  const [active, setActive] = React.useState(0);

  const categoryMap = React.useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = cat;
      return acc;
    }, {} as Record<string, { color: string }>);
  }, [categories]);

  const expenseData = React.useMemo(() => {
    const now = new Date();
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
      .reduce((acc, t) => {
        const existing = acc.find(item => item.name === t.category);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({ name: t.category, value: t.amount, fill: categoryMap[t.category]?.color || '#8884d8' });
        }
        return acc;
      }, [] as { name: string; value: number; fill: string }[]);
  }, [transactions, categoryMap]);

  const chartConfig = React.useMemo<Record<string, { label: string; color: string }>>(() => {
    return expenseData.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    }, {});
  }, [expenseData]);

  const totalValue = React.useMemo(() => {
    return expenseData.reduce((acc, curr) => acc + curr.value, 0)
  }, [expenseData]);

  if (loading) return <Skeleton className="mx-auto aspect-square h-[300px]" />;

  if (expenseData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expenses this month.
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={expenseData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={active}
          activeShape={(props: PieSectorDataItem) => (
            <Sector
              {...props}
              outerRadius={props.outerRadius ? props.outerRadius + 8 : 0}
              fill={props.fill}
            />
          )}
          onMouseOver={(_, index) => setActive(index)}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                const { cx, cy } = viewBox
                const Tspan = "tspan" as keyof JSX.IntrinsicElements
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <Tspan
                      x={cx}
                      y={(cy || 0) - 10}
                      className="fill-muted-foreground text-sm"
                    >
                      Expenses
                    </Tspan>
                    <Tspan
                      x={cx}
                      y={(cy || 0) + 12}
                      className="fill-foreground text-xl font-bold"
                    >
                      {totalValue.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
