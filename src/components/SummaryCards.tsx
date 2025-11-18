import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { transactions, budgets } from "@/lib/data";

export default function SummaryCards() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const summaryData = [
    {
      title: "Total Income",
      amount: formatCurrency(totalIncome),
      icon: <ArrowUp className="w-5 h-5 text-green-500" />,
      change: "+2.5% this month",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(totalExpenses),
      icon: <ArrowDown className="w-5 h-5 text-red-500" />,
      change: "+5.1% this month",
    },
    {
      title: "Net Savings",
      amount: formatCurrency(netSavings),
      icon: <DollarSign className="w-5 h-5 text-blue-500" />,
      change: netSavings >= 0 ? "In savings" : "In deficit",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.amount}</div>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </CardContent>
        </Card>
      ))}
       <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <Target className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}</div>
            <Progress value={budgetUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>
    </div>
  );
}