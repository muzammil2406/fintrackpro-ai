"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ListFilter, PlusCircle, Search } from "lucide-react";
import TransactionList from "@/components/TransactionList";
import AddTransactionForm from "@/components/AddTransactionForm";

export default function TransactionsPage() {
  const [filters, setFilters] = useState<{ types: ('income' | 'expense')[]; searchTerm: string }>({ types: ['income', 'expense'], searchTerm: '' });

  const handleFilterChange = (type: 'income' | 'expense') => {
    setFilters(prev => {
      const newTypes = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      return { ...prev, types: newTypes as ('income' | 'expense')[] };
    });
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: event.target.value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          View and manage all your income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.types.includes('income')}
                  onCheckedChange={() => handleFilterChange('income')}
                >
                  Income
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.types.includes('expense')}
                  onCheckedChange={() => handleFilterChange('expense')}
                >
                  Expense
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="sm" className="h-10 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Transaction
                        </span>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Add New Transaction</SheetTitle>
                    <SheetDescription>
                        Fill in the details of your income or expense.
                    </SheetDescription>
                    </SheetHeader>
                    <AddTransactionForm />
                </SheetContent>
            </Sheet>
          </div>
        </div>
        <TransactionList filters={filters} />
      </CardContent>
    </Card>
  );
}
