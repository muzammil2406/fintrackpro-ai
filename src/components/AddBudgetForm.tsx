"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/lib/supabase/hooks"
import { addBudget } from "@/lib/supabase/hooks"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  budgetLimit: z.coerce.number().min(1, "Budget limit must be greater than 0."),
  category: z.string({ required_error: "Please select a category." }),
})

interface AddBudgetFormProps {
  onSuccess?: () => void;
}

export default function AddBudgetForm({ onSuccess }: AddBudgetFormProps) {
    const { toast } = useToast();
    const { categories } = useCategories();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        budgetLimit: 100,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const now = new Date();
      await addBudget({
        category: values.category,
        budgetLimit: values.budgetLimit,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      toast({
        title: "Budget Added",
        description: `A budget for ${values.category} of $${values.budgetLimit} has been successfully added.`,
      });
      form.reset();
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Failed to add budget",
        description: err.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Limit</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="100.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Add Budget</Button>
      </form>
    </Form>
  )
}
