"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { categories, transactions } from "@/lib/data"
import type { Category } from "@/types"

const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat;
    return acc;
}, {} as Record<string, Category>);

const expenseData = transactions
  .filter(t => t.type === 'expense')
  .reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount, fill: categoryMap[t.category]?.color || '#8884d8' });
    }
    return acc;
  }, [] as { name: string; value: number; fill: string }[]);


const chartConfig: Record<string, { label: string; color: string }> = expenseData.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
    acc[item.name] = {
        label: item.name,
        color: item.fill,
    };
    return acc;
}, {});

export default function ExpenseBreakdownChart() {
  const id = "pie-interactive"
  const [active, setActive] = React.useState(0);

  const totalValue = React.useMemo(() => {
    return expenseData.reduce((acc, curr) => acc + curr.value, 0)
  }, []);

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
