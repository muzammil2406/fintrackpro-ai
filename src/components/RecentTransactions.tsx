import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Utensils, Car, ShoppingBag, Landmark, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { transactions, categories } from "@/lib/data";
import { format } from "date-fns";
import type { Category } from "@/types";

const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat;
    return acc;
}, {} as Record<string, Category>);

const iconMap: Record<string, React.ReactNode> = {
    'Food & Dining': <Utensils className="h-4 w-4" />,
    'Transportation': <Car className="h-4 w-4" />,
    'Shopping': <ShoppingBag className="h-4 w-4" />,
    'Salary': <Landmark className="h-4 w-4" />,
    'Freelance': <Briefcase className="h-4 w-4" />,
}

export default function RecentTransactions() {
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
    
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your 5 most recent transactions.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {format(new Date(transaction.date), "PPP")}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {iconMap[transaction.category] || null}
                        {transaction.category}
                    </Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
