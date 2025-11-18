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
import { categories } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SheetClose } from "./ui/sheet"

const formSchema = z.object({
  limit: z.coerce.number().min(1, "Budget limit must be greater than 0."),
  category: z.string({ required_error: "Please select a category." }),
})

export default function AddBudgetForm() {
    const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        limit: 100,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
        title: "Budget Added",
        description: `A budget for ${values.category} of $${values.limit} has been successfully added.`,
      })
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
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Limit</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <SheetClose asChild>
          <Button type="submit" className="w-full">Add Budget</Button>
        </SheetClose>
      </form>
    </Form>
  )
}
