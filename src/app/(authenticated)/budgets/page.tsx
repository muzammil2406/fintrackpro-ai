import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BudgetList from "@/components/BudgetList";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import AddBudgetForm from "@/components/AddBudgetForm";

export default function BudgetsPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Budgets</CardTitle>
                        <CardDescription>
                            Set and track your monthly spending goals.
                        </CardDescription>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="sm" className="gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Budget
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add New Budget</SheetTitle>
                                <SheetDescription>
                                    Create a new budget to track your spending for a category.
                                </SheetDescription>
                            </SheetHeader>
                            <AddBudgetForm />
                        </SheetContent>
                    </Sheet>
                </div>
            </CardHeader>
            <CardContent>
                <BudgetList />
            </CardContent>
        </Card>
    );
}
