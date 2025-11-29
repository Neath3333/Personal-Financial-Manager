import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default categories for the application
const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'Income' },
  { name: 'Freelance', type: 'Income' },
  { name: 'Investments', type: 'Income' },
  { name: 'Business', type: 'Income' },
  { name: 'Gifts', type: 'Income' },
  { name: 'Other Income', type: 'Income' },

  // Expense categories
  { name: 'Food & Dining', type: 'Expense' },
  { name: 'Transportation', type: 'Expense' },
  { name: 'Housing', type: 'Expense' },
  { name: 'Utilities', type: 'Expense' },
  { name: 'Healthcare', type: 'Expense' },
  { name: 'Entertainment', type: 'Expense' },
  { name: 'Shopping', type: 'Expense' },
  { name: 'Education', type: 'Expense' },
  { name: 'Personal Care', type: 'Expense' },
  { name: 'Travel', type: 'Expense' },
  { name: 'Insurance', type: 'Expense' },
  { name: 'Debt Payments', type: 'Expense' },
  { name: 'Savings', type: 'Expense' },
  { name: 'Other Expenses', type: 'Expense' }
];

async function main() {
  console.log('Start seeding...');

  // Clean existing categories
  await prisma.category.deleteMany();
  console.log('Cleared existing categories');

  // Insert default categories
  for (const category of defaultCategories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log(`Seeded ${defaultCategories.length} categories`);
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });