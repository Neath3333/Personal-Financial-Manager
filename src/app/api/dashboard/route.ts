import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { memoryStorage } from '@/lib/memory-storage';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter: any = {};

    // Apply date filters (same logic as transactions)
    if (filter) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filter) {
        case 'day':
          dateFilter.date = {
            gte: startOfDay,
            lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'week':
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
          dateFilter.date = {
            gte: startOfWeek,
            lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'month':
          dateFilter.date = {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
            lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
          };
          break;
        case 'year':
          dateFilter.date = {
            gte: new Date(now.getFullYear(), 0, 1),
            lte: new Date(now.getFullYear(), 11, 31)
          };
          break;
      }
    } else if (startDate || endDate) {
      if (startDate && endDate) {
        dateFilter.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      } else if (startDate) {
        dateFilter.date = {
          gte: new Date(startDate)
        };
      } else if (endDate) {
        dateFilter.date = {
          lte: new Date(endDate)
        };
      }
    }

    // Get all transactions for the user within the date range
    const transactions = memoryStorage.transactions
      .filter(t => t.userId === user.id)
      .filter(t => {
        if (Object.keys(dateFilter).length === 0) return true;

        const transactionDate = new Date(t.date);

        if (dateFilter.date?.gte && dateFilter.date?.lte) {
          return transactionDate >= dateFilter.date.gte && transactionDate <= dateFilter.date.lte;
        } else if (dateFilter.date?.gte) {
          return transactionDate >= dateFilter.date.gte;
        } else if (dateFilter.date?.lte) {
          return transactionDate <= dateFilter.date.lte;
        }

        return true;
      })
      .map(t => ({
        ...t,
        category: memoryStorage.categories.find(c => c.id === t.categoryId)
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate totals
    const totals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'Income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    totals.balance = totals.totalIncome - totals.totalExpenses;

    // Calculate category breakdowns
    const categoryBreakdown = transactions.reduce((acc, transaction) => {
      if (!transaction.category) return acc;

      const categoryName = transaction.category.name;
      const key = `${transaction.type}_${categoryName}`;

      if (!acc[key]) {
        acc[key] = {
          name: categoryName,
          type: transaction.type,
          amount: 0,
          count: 0
        };
      }

      acc[key].amount += transaction.amount;
      acc[key].count += 1;

      return acc;
    }, {} as Record<string, any>);

    // Convert to arrays for charts
    const expenseCategories = Object.values(categoryBreakdown)
      .filter((item: any) => item.type === 'Expense')
      .sort((a: any, b: any) => b.amount - a.amount);

    const incomeCategories = Object.values(categoryBreakdown)
      .filter((item: any) => item.type === 'Income')
      .sort((a: any, b: any) => b.amount - a.amount);

    // Get daily/weekly/monthly trend data
    const trendData = calculateTrendData(transactions, filter);

    const response = {
      success: true,
      data: {
        totals,
        categoryBreakdown: {
          expenses: expenseCategories,
          income: incomeCategories
        },
        trendData,
        recentTransactions: transactions.slice(0, 5) // Last 5 transactions
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate trend data
function calculateTrendData(transactions: any[], filter: string | null) {
  const trendData: any[] = [];
  const groupedTransactions: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach(transaction => {
    let key: string;
    const date = new Date(transaction.date);

    switch (filter) {
      case 'day':
        // Group by hour for daily view
        key = `${date.getHours()}:00`;
        break;
      case 'week':
        // Group by day for weekly view
        key = date.toLocaleDateString();
        break;
      case 'month':
        // Group by day for monthly view
        key = date.toLocaleDateString();
        break;
      case 'year':
        // Group by month for yearly view
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        break;
      default:
        // Default to daily
        key = date.toLocaleDateString();
    }

    if (!groupedTransactions[key]) {
      groupedTransactions[key] = { income: 0, expenses: 0 };
    }

    if (transaction.type === 'Income') {
      groupedTransactions[key].income += transaction.amount;
    } else {
      groupedTransactions[key].expenses += transaction.amount;
    }
  });

  // Convert to array format for charts
  Object.keys(groupedTransactions).forEach(key => {
    trendData.push({
      period: key,
      income: groupedTransactions[key].income,
      expenses: groupedTransactions[key].expenses,
      net: groupedTransactions[key].income - groupedTransactions[key].expenses
    });
  });

  return trendData.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
}