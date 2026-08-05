import type { Transaction, Budget, Category, UserProfile } from '@/types';

export function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    description: row.description,
    date: row.date,
    paymentMethod: row.payment_method,
    receipt: row.receipt ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapBudget(row: any): Budget {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    budgetLimit: Number(row.budget_limit),
    spent: Number(row.spent),
    month: row.month,
    year: row.year,
    createdAt: row.created_at,
  };
}

export function mapCategory(row: any): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default,
  };
}

export function mapProfile(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    currency: row.currency,
    monthlyIncome: Number(row.monthly_income),
    createdAt: row.created_at,
  };
}
