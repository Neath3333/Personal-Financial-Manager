# Personal Finance Manager

A comprehensive Next.js web application for tracking personal income and expenses with manual data entry, dashboard analytics, and PDF export capabilities.

## Features

### Core MVP Features
- **User Authentication**: Secure registration and login system
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Categorization**: Organize transactions by predefined categories
- **Dashboard Analytics**: Visual representation of financial data with charts
- **Time-based Filtering**: View transactions by day, week, month, or year
- **PDF Export**: Generate downloadable financial reports

### Technical Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Responsive design
- RESTful API routes

## Project Structure

```
Personal-Finance-Manager/
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── api/           # API routes
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   └── page.tsx       # Dashboard page
│   ├── components/        # React components
│   │   ├── Dashboard.tsx
│   │   └── Navbar.tsx
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts
│   │   └── prisma.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Helper functions
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── app/layout.tsx     # Root layout
│   └── app/globals.css    # Global styles
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seed script
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Personal-Finance-Manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Create `.env.local` file and update with your configuration:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/personal_finance_db?schema=public"
     JWT_SECRET="your-super-secret-jwt-key-here"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your-nextauth-secret-here"
     ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed default categories
   npm run db:seed
   ```

### Running the Application

**Development Mode:**
```bash
npm run dev
```

The application will be available at http://localhost:3000

**Production Mode:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get user transactions (with filtering)
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard` - Get dashboard data and analytics

### Export
- `GET /api/export/pdf` - Export transactions as PDF

## Database Schema

### Users
- `id` (Primary Key)
- `name`
- `email`
- `password_hashed`

### Categories
- `id` (Primary Key)
- `name`
- `type` (Income/Expense)

### Transactions
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `category_id` (Foreign Key → Categories)
- `type` (Income/Expense)
- `amount`
- `date`
- `notes`

## Default Categories

### Income Categories
- Salary
- Freelance
- Investments
- Business
- Gifts
- Other Income

### Expense Categories
- Food & Dining
- Transportation
- Housing
- Utilities
- Healthcare
- Entertainment
- Shopping
- Education
- Personal Care
- Travel
- Insurance
- Debt Payments
- Savings
- Other Expenses

## Filtering Options

The application supports filtering by:
- **Day**: Current day's transactions
- **Week**: Current week's transactions
- **Month**: Current month's transactions
- **Year**: Current year's transactions
- **Custom Range**: Specific date ranges

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Rate limiting (recommended for production)

## Performance Requirements

- Dashboard updates within 2 seconds after adding a transaction
- Support for multiple concurrent users
- Efficient database queries with proper indexing

## Future Enhancements

### Planned Features
- Budget tracking with alerts
- Recurring transactions
- Multi-currency support
- Dark mode / theme customization
- Cloud sync for multiple devices
- Mobile app

### Optional Technical Improvements
- Redis caching for better performance
- Automated testing suite
- CI/CD pipeline
- Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.