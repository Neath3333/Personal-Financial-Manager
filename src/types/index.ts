export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  type: 'Income' | 'Expense';
  amount: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  category?: Category;
}

export interface DashboardData {
  totals: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  categoryBreakdown: {
    expenses: Array<{
      name: string;
      type: 'Expense';
      amount: number;
      count: number;
    }>;
    income: Array<{
      name: string;
      type: 'Income';
      amount: number;
      count: number;
    }>;
  };
  trendData: Array<{
    period: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  recentTransactions: Transaction[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: Omit<User, 'createdAt' | 'updatedAt'>;
  };
}

export type FilterType = 'day' | 'week' | 'month' | 'year' | undefined;