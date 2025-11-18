import type { Transaction, Budget, Category } from '@/types';

export const categories: Category[] = [
  // Expenses
  { id: 'cat1', userId: 'user1', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#FF6384', isDefault: true },
  { id: 'cat2', userId: 'user1', name: 'Transportation', type: 'expense', icon: 'Car', color: '#36A2EB', isDefault: true },
  { id: 'cat3', userId: 'user1', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#FFCE56', isDefault: true },
  { id: 'cat4', userId: 'user1', name: 'Entertainment', type: 'expense', icon: 'Ticket', color: '#4BC0C0', isDefault: true },
  { id: 'cat5', userId: 'user1', name: 'Bills & Utilities', type: 'expense', icon: 'FileText', color: '#9966FF', isDefault: true },
  { id: 'cat6', userId: 'user1', name: 'Healthcare', type: 'expense', icon: 'HeartPulse', color: '#FF9F40', isDefault: true },
  // Income
  { id: 'cat7', userId: 'user1', name: 'Salary', type: 'income', icon: 'Landmark', color: '#2ECC71', isDefault: true },
  { id: 'cat8', userId: 'user1', name: 'Freelance', type: 'income', icon: 'Briefcase', color: '#3498DB', isDefault: true },
];

export const transactions: Transaction[] = [
  { id: 't1', userId: 'user1', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: new Date(new Date().setDate(1)).toISOString(), paymentMethod: 'Bank Transfer', createdAt: new Date().toISOString() },
  { id: 't2', userId: 'user1', type: 'expense', amount: 75.50, category: 'Food & Dining', description: 'Dinner with friends', date: new Date(new Date().setDate(2)).toISOString(), paymentMethod: 'Credit Card', createdAt: new Date().toISOString() },
  { id: 't3', userId: 'user1', type: 'expense', amount: 120, category: 'Shopping', description: 'New Shoes', date: new Date(new Date().setDate(3)).toISOString(), paymentMethod: 'Credit Card', createdAt: new Date().toISOString() },
  { id: 't4', userId: 'user1', type: 'expense', amount: 50, category: 'Transportation', description: 'Monthly metro pass', date: new Date(new Date().setDate(4)).toISOString(), paymentMethod: 'Cash', createdAt: new Date().toISOString() },
  { id: 't5', userId: 'user1', type: 'expense', amount: 200, category: 'Bills & Utilities', description: 'Electricity Bill', date: new Date(new Date().setDate(5)).toISOString(), paymentMethod: 'Bank Transfer', createdAt: new Date().toISOString() },
  { id: 't6', userId: 'user1', type: 'expense', amount: 45, category: 'Entertainment', description: 'Movie tickets', date: new Date(new Date().setDate(6)).toISOString(), paymentMethod: 'Credit Card', createdAt: new Date().toISOString() },
  { id: 't7', userId: 'user1', type: 'expense', amount: 30.25, category: 'Food & Dining', description: 'Groceries', date: new Date(new Date().setDate(7)).toISOString(), paymentMethod: 'Debit Card', createdAt: new Date().toISOString() },
  { id: 't8', userId: 'user1', type: 'income', amount: 500, category: 'Freelance', description: 'Web design project', date: new Date(new Date().setDate(8)).toISOString(), paymentMethod: 'PayPal', createdAt: new Date().toISOString() },
  { id: 't9', userId: 'user1', type: 'expense', amount: 85, category: 'Healthcare', description: 'Pharmacy', date: new Date(new Date().setDate(9)).toISOString(), paymentMethod: 'Debit Card', createdAt: new Date().toISOString() },
  { id: 't10', userId: 'user1', type: 'expense', amount: 15.99, category: 'Shopping', description: 'New book', date: new Date(new Date().setDate(10)).toISOString(), paymentMethod: 'Credit Card', createdAt: new Date().toISOString() },
];

export const budgets: Budget[] = [
  { id: 'b1', userId: 'user1', category: 'Food & Dining', limit: 500, spent: 105.75, month: new Date().getMonth() + 1, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
  { id: 'b2', userId: 'user1', category: 'Shopping', limit: 300, spent: 135.99, month: new Date().getMonth() + 1, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
  { id: 'b3', userId: 'user1', category: 'Transportation', limit: 100, spent: 50, month: new Date().getMonth() + 1, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
  { id: 'b4', userId: 'user1', category: 'Entertainment', limit: 150, spent: 45, month: new Date().getMonth() + 1, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
  { id: 'b5', userId: 'user1', category: 'Bills & Utilities', limit: 250, spent: 200, month: new Date().getMonth() + 1, year: new Date().getFullYear(), createdAt: new Date().toISOString() },
];

export const userProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  currency: 'USD',
  monthlyIncome: 5500,
  createdAt: new Date().toISOString(),
};
