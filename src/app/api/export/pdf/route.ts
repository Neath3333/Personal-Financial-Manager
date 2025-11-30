import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    let dateFilter: any = {};
    if (filter === 'day') {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      dateFilter = {
        date: {
          gte: startOfDay
        }
      };
    } else if (filter === 'week') {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = {
        date: {
          gte: weekAgo
        }
      };
    } else if (filter === 'month') {
      const today = new Date();
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      dateFilter = {
        date: {
          gte: monthAgo
        }
      };
    } else if (filter === 'year') {
      const today = new Date();
      const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      dateFilter = {
        date: {
          gte: yearAgo
        }
      };
    } else if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    // Fetch transactions with categories
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...dateFilter
      },
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Generate HTML for PDF
    const html = generatePDFHTML({
      user,
      transactions,
      totalIncome,
      totalExpenses,
      balance,
      filter,
      startDate,
      endDate
    });

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Return PDF as response
    const fileName = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

interface PDFData {
  user: any;
  transactions: any[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  filter: string;
  startDate: string | null;
  endDate: string | null;
}

function generatePDFHTML(data: PDFData): string {
  const { user, transactions, totalIncome, totalExpenses, balance, filter, startDate, endDate } = data;

  // Format filter description
  let filterDescription = 'All Time';
  if (filter === 'day') filterDescription = 'Today';
  else if (filter === 'week') filterDescription = 'This Week';
  else if (filter === 'month') filterDescription = 'This Month';
  else if (filter === 'year') filterDescription = 'This Year';
  else if (startDate && endDate) {
    filterDescription = `${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Financial Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1f2937;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #6b7280;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 20px;
        }
        .summary-box {
          flex: 1;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .summary-box.income {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
        }
        .summary-box.expense {
          background-color: #fef2f2;
          border-color: #fecaca;
        }
        .summary-box.balance {
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }
        .summary-box h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .summary-box .amount {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .income .amount { color: #059669; }
        .expense .amount { color: #dc2626; }
        .balance .amount { color: #1f2937; }
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .transactions-table th {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 8px;
          text-align: left;
          font-weight: 600;
          color: #374151;
        }
        .transactions-table td {
          border: 1px solid #e5e7eb;
          padding: 8px;
        }
        .type-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
        }
        .type-income {
          background-color: #dcfce7;
          color: #166534;
        }
        .type-expense {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .amount {
          text-align: right;
          font-weight: 600;
        }
        .amount.income { color: #059669; }
        .amount.expense { color: #dc2626; }
        .no-transactions {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          font-style: italic;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Personal Finance Report</h1>
        <p>${user.name} • ${filterDescription}</p>
        <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
      </div>

      <div class="summary">
        <div class="summary-box income">
          <h3>Total Income</h3>
          <p class="amount income">$${totalIncome.toFixed(2)}</p>
        </div>
        <div class="summary-box expense">
          <h3>Total Expenses</h3>
          <p class="amount expense">$${totalExpenses.toFixed(2)}</p>
        </div>
        <div class="summary-box balance">
          <h3>Balance</h3>
          <p class="amount balance">$${balance.toFixed(2)}</p>
        </div>
      </div>

      <div class="transactions">
        <h2>Transaction History (${transactions.length} transactions)</h2>

        ${transactions.length === 0 ?
          '<div class="no-transactions">No transactions found for the selected period.</div>' :
          `
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                  <td>${transaction.category.name}</td>
                  <td>
                    <span class="type-badge type-${transaction.type.toLowerCase()}">
                      ${transaction.type}
                    </span>
                  </td>
                  <td class="amount ${transaction.type.toLowerCase()}">
                    ${transaction.type === 'Income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                  </td>
                  <td>${transaction.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          `
        }
      </div>

      <div class="footer">
        <p>This report was generated from your Personal Finance Manager</p>
        <p>Page 1 of 1</p>
      </div>
    </body>
    </html>
  `;
}