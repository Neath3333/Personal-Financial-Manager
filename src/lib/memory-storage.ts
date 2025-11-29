// Temporary in-memory storage for demo purposes
// Replace with actual database when PostgreSQL is available

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
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
}

export interface Category {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  createdAt: Date;
}

// In-memory storage
export const memoryStorage = {
  users: [] as User[],
  transactions: [] as Transaction[],
  categories: [
    // Default income categories
    { id: 'cat_1', name: 'Salary', type: 'Income' as const, createdAt: new Date() },
    { id: 'cat_2', name: 'Freelance', type: 'Income' as const, createdAt: new Date() },
    { id: 'cat_3', name: 'Investments', type: 'Income' as const, createdAt: new Date() },
    { id: 'cat_4', name: 'Business', type: 'Income' as const, createdAt: new Date() },
    { id: 'cat_5', name: 'Gifts', type: 'Income' as const, createdAt: new Date() },
    { id: 'cat_6', name: 'Other Income', type: 'Income' as const, createdAt: new Date() },

    // Default expense categories
    { id: 'cat_7', name: 'Food & Dining', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_8', name: 'Transportation', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_9', name: 'Housing', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_10', name: 'Utilities', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_11', name: 'Healthcare', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_12', name: 'Entertainment', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_13', name: 'Shopping', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_14', name: 'Education', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_15', name: 'Personal Care', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_16', name: 'Travel', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_17', name: 'Insurance', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_18', name: 'Debt Payments', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_19', name: 'Savings', type: 'Expense' as const, createdAt: new Date() },
    { id: 'cat_20', name: 'Other Expenses', type: 'Expense' as const, createdAt: new Date() },
  ] as Category[],
};