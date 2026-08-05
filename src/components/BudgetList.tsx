"use client";

import { Progress } from "@/components/ui/progress";
import { useBudgets, useProfile } from "@/lib/supabase/hooks";
import { Utensils, Car, ShoppingBag, Ticket, FileText, HeartPulse } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ReactNode> = {
    'Food & Dining': <Utensils className="h-6 w-6 text-muted-foreground" />,
    'Transportation': <Car className="h-6 w-6 text-muted-foreground" />,
    'Shopping': <ShoppingBag className="h-6 w-6 text-muted-foreground" />,
    'Entertainment': <Ticket className="h-6 w-6 text-muted-foreground" />,
    'Bills & Utilities': <FileText className="h-6 w-6 text-muted-foreground" />,
    'Healthcare': <HeartPulse className="h-6 w-6 text-muted-foreground" />,
};

export default function BudgetList() {
    const { budgets, loading } = useBudgets();
    const { profile } = useProfile();
    const currency = profile?.currency ?? "USD";

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
        );
    }

    if (budgets.length === 0) {
        return (
            <p className="text-center text-muted-foreground py-8">
                No budgets yet. Create your first budget to track your spending goals.
            </p>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map(budget => {
                const percentage = budget.budgetLimit > 0 ? (budget.spent / budget.budgetLimit) * 100 : 0;
                const remaining = budget.budgetLimit - budget.spent;
                const overBudget = percentage >= 100;

                return (
                    <div key={budget.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {iconMap[budget.category]}
                                <h3 className="font-semibold">{budget.category}</h3>
                            </div>
                            <div className="font-bold">{formatCurrency(budget.budgetLimit)}</div>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className={overBudget ? "bg-red-500" : ""} />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Spent: {formatCurrency(budget.spent)}</span>
                            <span className={overBudget ? "text-red-500 font-semibold" : ""}>
                                {overBudget ? "Over budget" : `Remaining: ${formatCurrency(remaining)}`}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
