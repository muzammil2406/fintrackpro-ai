export type Transaction = {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO 8601 string
  paymentMethod: string;
  receipt?: string; // URL to receipt image
  createdAt: string; // ISO 8601 string
};

export type Budget = {
  id: string;
  userId: string;
  category: string;
  budgetLimit: number;
  spent: number;
  month: number; // 1-12
  year: number;
  createdAt: string; // ISO 8601 string
};

export type Category = {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string; // lucide-react icon name
  color: string; // hex color
  isDefault: boolean;
};

export type Insight = {
  id: string;
  userId: string;
  type: 'spending pattern' | 'budget optimization' | 'anomaly detection' | 'prediction' | 'recommendation';
  category: string;
  message: string;
  severity: 'warning' | 'tip' | 'info';
  recommendation: string;
  generatedAt: string; // ISO 8601 string
  isRead: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  currency: string;
  monthlyIncome: number;
  createdAt: string;
};
