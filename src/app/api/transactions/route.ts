import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

// GET /api/transactions - List transactions
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

    // Apply date filters
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

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...dateFilter
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Add transaction
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { type, amount, categoryId, date, notes } = body;

    // Validate input
    if (!type || !amount || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Type, amount, and category are required' },
        { status: 400 }
      );
    }

    if (!['Income', 'Expense'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Type must be Income or Expense' },
        { status: 400 }
      );
    }

    // Verify category exists and matches transaction type
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 400 }
      );
    }

    if (category.type !== type) {
      return NextResponse.json(
        { success: false, message: 'Category type does not match transaction type' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: type as 'Income' | 'Expense',
        amount: parseFloat(amount),
        categoryId,
        date: date ? new Date(date) : new Date(),
        notes: notes || null
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}