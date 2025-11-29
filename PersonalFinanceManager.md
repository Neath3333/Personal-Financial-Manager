# Personal Finance Manager Project

**Project Type**: Learning / Personal Project | **Framework**: Next.js + Tailwind CSS + Prisma | **Status**: Planning Complete

---

## Project Overview

The Personal Finance Manager is a tool for **manually tracking income and expenses**, managing budgets, and generating reports. Users can filter transactions by **daily, weekly, monthly, or yearly** periods. Totals, balances, and charts are calculated automatically.

**Target Users**: People who want to **track and analyze personal finances manually**.

**Scope**:  
- **Included**: Manual transaction input, dashboard, charts, filtering, PDF export  
- **Excluded**: Bank integration or automatic transaction import  

---

## Learning Objectives

This project focuses on learning:

- **Fullstack Development**: Next.js frontend, API routes backend, PostgreSQL database with Prisma  
- **Structured Planning & Documentation**: SDD, database design, API design  
- **Incremental Development**: Step-by-step feature implementation  
- **Data Management**: CRUD operations, filtering, reporting  
- **UX/UI Design**: Responsive dashboards with charts  
- **PDF Export & Reporting**: Generating user reports  

---

## Project Structure

personal-finance-manager/
├── prisma/
│ └── schema.prisma # Database schema
├── pages/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── login.js
│ │ │ └── register.js
│ │ ├── transactions.js
│ │ ├── dashboard.js
│ │ └── export.js
│ ├── index.js # Dashboard page
│ ├── login.js
│ └── register.js
├── components/
│ ├── TransactionForm.js
│ ├── TransactionList.js
│ └── DashboardCharts.js
├── styles/
│ └── globals.css
├── utils/
│ └── api.js
├── package.json
└── README.md

---

## MVP Plan

### Core Features

- User registration/login (JWT authentication)  
- Add/Edit/Delete income and expense transactions  
- Categorize transactions (Food, Bills, Salary, etc.)  
- Dashboard with totals, balance, and charts  
- Filter transactions by daily, weekly, monthly, yearly  
- Export filtered data as PDF  

### Optional Features

- Budgets per category with alerts  
- Recurring transactions  
- Multi-currency support  
- Dark mode / theme customization  

---

## User Flows

### Add Transaction Flow
1. User logs in  
2. Clicks **Add Transaction**  
3. Selects type (Income/Expense)  
4. Enters amount, category, date, notes  
5. Saves → system updates totals, balance, and charts  

### Dashboard / View Records Flow
1. User opens dashboard  
2. Views totals and balance  
3. Views charts of spending by category  
4. Filters transactions by day/week/month/year  

### Optional Flows
- Edit/Delete Transaction  
- Export PDF  
- Registration/Login  

---

## System Architecture / Components

Frontend (Next.js + Tailwind CSS)
|
v
API Routes (Next.js backend)
|
v
Database (PostgreSQL + Prisma)

yaml
Copy code

| Component | Description |
|-----------|-------------|
| Frontend  | Pages: Login/Register, Dashboard, Add/Edit/Delete Transaction, Export PDF |
| Backend   | API Routes: authentication, transactions, dashboard, PDF export |
| Database  | Tables: Users, Categories, Transactions |

---

## Database Design

### Users
- `id` (PK)  
- `name`  
- `email`  
- `password_hashed`  

### Categories
- `id` (PK)  
- `name`  

### Transactions
- `id` (PK)  
- `user_id` (FK → Users)  
- `category_id` (FK → Categories)  
- `type` (Income/Expense)  
- `amount`  
- `date`  
- `notes`  

> `user_id` ensures transactions are linked to specific users. `date` supports filtering for daily, weekly, monthly, or yearly views.

---

## API Design

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register a new user |
| /api/auth/login    | POST | User login |
| /api/transactions  | GET  | List transactions (filterable) |
| /api/transactions  | POST | Add transaction |
| /api/transactions/[id] | PUT | Edit transaction |
| /api/transactions/[id] | DELETE | Delete transaction |
| /api/dashboard     | GET  | Get totals & charts |
| /api/export/pdf    | GET  | Export filtered transactions |

---

## Development Workflow

### Phase 1: Project Setup
- Initialize Next.js project  
- Setup Tailwind CSS  
- Setup Prisma and database  

### Phase 2: Authentication
- Implement registration/login API routes  
- Build login/register pages  

### Phase 3: Transaction Management
- Add/Edit/Delete API routes  
- Build Transaction Form & List components  

### Phase 4: Dashboard
- Build dashboard components with charts  
- Implement filtering by time period  

### Phase 5: PDF Export
- Implement export API route  
- Generate PDF for filtered transactions  

### Phase 6: Testing & Validation
- Manual testing of all features  
- Verify totals, balance, charts, filters, and PDF export  

---

## Non-functional Requirements

- **Performance:** Dashboard updates <2s  
- **Security:** JWT authentication, hashed passwords  
- **Scalability:** Multi-user support  
- **Usability:** Clean, responsive UI  
- **Maintainability:** Modular, readable code  

---

## Timeline / Milestones

| Week | Tasks |
|------|-------|
| 1 | Project setup, database schema, auth pages/API |
| 2 | Transactions CRUD API & frontend |
| 3 | Dashboard & filtering |
| 4 | PDF export, testing, deploy MVP |

---

## Future Improvements

- Budgets per category with alerts  
- Recurring transactions  
- Multi-currency support  
- Dark mode  
- Cloud sync  

---

## Learning Outcomes

- Fullstack development (Next.js + API + database)  
- Structured planning and SDD documentation  
- Incremental implementation and testing  
- UX/UI dashboard design with charts and PDF export  
- Progressive enhancement workflow  

---

**Project Status**: Planning Complete  
**Primary Focus**: Fullstack SDD Implementation  
**Estimated Completion**: 4–5 weeks (MVP)