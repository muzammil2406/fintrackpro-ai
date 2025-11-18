import { Progress } from "@/components/ui/progress";
import { budgets, categories } from "@/lib/data";
import { Utensils, Car, ShoppingBag, Ticket, FileText } from "lucide-react";
import type { Category } from "@/types";

const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat;
    return acc;
}, {} as Record<string, Category>);

const iconMap: Record<string, React.ReactNode> = {
    'Food & Dining': <Utensils className="h-6 w-6 text-muted-foreground" />,
    'Transportation': <Car className="h-6 w-6 text-muted-foreground" />,
    'Shopping': <ShoppingBag className="h-6 w-6 text-muted-foreground" />,
    'Entertainment': <Ticket className="h-6 w-6 text-muted-foreground" />,
    'Bills & Utilities': <FileText className="h-6 w-6 text-muted-foreground" />,
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function BudgetList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                const remaining = budget.limit - budget.spent;

                return (
                    <div key={budget.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {iconMap[budget.category]}
                                <h3 className="font-semibold">{budget.category}</h3>
                            </div>
                            <div className="font-bold">{formatCurrency(budget.limit)}</div>
                        </div>
                        <Progress value={percentage} />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Spent: {formatCurrency(budget.spent)}</span>
                            <span>Remaining: {formatCurrency(remaining)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
