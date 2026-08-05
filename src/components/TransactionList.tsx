"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Utensils, Car, ShoppingBag, Landmark, Briefcase, FileText, Ticket, HeartPulse } from "lucide-react";
import { useTransactions, useProfile } from "@/lib/supabase/hooks";
import { deleteTransaction } from "@/lib/supabase/hooks";
import { format } from "date-fns";
import type { Transaction } from "@/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import EditTransactionForm from "./EditTransactionForm";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ReactNode> = {
    'Food & Dining': <Utensils className="h-4 w-4 text-muted-foreground" />,
    'Transportation': <Car className="h-4 w-4 text-muted-foreground" />,
    'Shopping': <ShoppingBag className="h-4 w-4 text-muted-foreground" />,
    'Entertainment': <Ticket className="h-4 w-4 text-muted-foreground" />,
    'Bills & Utilities': <FileText className="h-4 w-4 text-muted-foreground" />,
    'Healthcare': <HeartPulse className="h-4 w-4 text-muted-foreground" />,
    'Salary': <Landmark className="h-4 w-4 text-muted-foreground" />,
    'Freelance': <Briefcase className="h-4 w-4 text-muted-foreground" />,
}

interface TransactionListProps {
    filters?: {
        types: ('income' | 'expense')[];
        searchTerm: string;
    };
}

export default function TransactionList({ filters }: TransactionListProps) {
    const { toast } = useToast();
    const { transactions, loading, refresh } = useTransactions();
    const { profile } = useProfile();
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

    const currency = profile?.currency ?? "USD";

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount);
    };
    
    const handleDelete = async () => {
        if (!transactionToDelete) return;
        try {
            await deleteTransaction(transactionToDelete.id);
            toast({
                title: "Transaction Deleted",
                description: `"${transactionToDelete.description}" has been deleted.`,
            });
            refresh();
        } catch (err: any) {
            toast({
                title: "Failed to delete transaction",
                description: err.message ?? "Something went wrong.",
                variant: "destructive",
            });
        }
        setTransactionToDelete(null);
    };

    const handleEditSuccess = () => {
        setTransactionToEdit(null);
        refresh();
    }

    const allTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .filter(t => {
            const typeMatch = filters ? filters.types.includes(t.type) : true;
            const searchMatch = filters ? t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) : true;
            return typeMatch && searchMatch;
        });

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    return (
        <>
            {allTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                    No transactions found. Add your first one with the button above.
                </p>
            ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:block p-2 bg-muted rounded-md">
                                        {iconMap[transaction.category] || <Landmark className="h-4 w-4 text-muted-foreground" />}
                                    </div>
                                    <div>
                                        {transaction.description}
                                        <div className="text-sm text-muted-foreground md:hidden">
                                            {format(new Date(transaction.date), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant="outline">{transaction.category}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {format(new Date(transaction.date), "PPP")}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : ''}`}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setTransactionToEdit(transaction)}>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => setTransactionToDelete(transaction)} className="text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            )}
            <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the transaction
                        for &quot;{transactionToDelete?.description}&quot;.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Sheet open={!!transactionToEdit} onOpenChange={() => setTransactionToEdit(null)}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>
                            Update the details of your transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {transactionToEdit && <EditTransactionForm transaction={transactionToEdit} onSuccess={handleEditSuccess} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
