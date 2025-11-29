# SDD: Personal Finance Manager

---

## 1. Introduction / Project Overview

**Project Name:** Personal Finance Manager  

**Purpose:**  
The Personal Finance Manager is an application designed to help users **track income and manage expenses manually**. The system automatically calculates totals, balances, and generates visual reports. Users can filter transactions by daily, weekly, monthly, or yearly periods to analyze spending patterns.  

**Target Users:**  
Individuals who want to **track, monitor, and analyze their personal finances** without connecting directly to a bank account.

**Scope:**  
- **Included:** Manual transaction input, dashboards with charts, filters, PDF export  
- **Excluded:** Bank integration, automatic bank transaction imports  

---

## 2. MVP Plan / Functional Requirements

**Core Features:**  

- **User Registration/Login:** Secure account creation and access  
- **Add/Edit/Delete Transactions:** Manually record income and expense transactions, including amount, category, date, and notes  
- **Categorize Transactions:** Organize transactions by categories such as Food, Bills, Salary, etc.  
- **Dashboard:** Displays total income, total expenses, balance, and charts for quick visualization  
- **Filter Spending by Time Frame:** View transactions and totals filtered by day, week, month, or year  
- **Export Data as PDF:** Generate PDF reports of transactions and summaries for record-keeping or sharing  

**Optional Features for Later:**  

- Budgets per category with alerts  
- Recurring transactions  
- Multi-currency support  
- Dark mode or theme customization  

---

## 3. User Flows / Use Cases

### 3.1 Add Transaction Flow
1. User logs in  
2. Clicks **“Add Transaction”**  
3. Selects transaction type (**Income/Expense**)  
4. Enters amount, category, date, and optional notes  
5. Saves → system automatically updates totals, balance, and charts  

### 3.2 Dashboard / View Records Flow
1. User opens the **Dashboard**  
2. Views total income, total expenses, and current balance  
3. Visualizes spending by category in charts  
4. Filters transactions by day, week, month, or year  

### 3.3 Optional Additional Flows
- **User Registration/Login Flow:** Register and log in to access personal account securely  
- **Edit/Delete Transaction Flow:** Modify or remove transactions; dashboard updates automatically  
- **Export PDF Flow:** Download filtered transaction reports in PDF format  

---

## 4. System Architecture / Components

| Component   | Description |
|------------|-------------|
| **Frontend** | Pages/screens: Login/Register, Dashboard, Add/Edit/Delete Transaction, Export PDF. Users manually input all data |
| **Backend** | APIs for authentication, transactions, dashboard, filtering, PDF export |
| **Database** | Tables: Users, Categories, Transactions; manually entered data only |

**Communication:**  
Frontend calls backend APIs → backend queries database → returns data → frontend renders charts and tables  

---

## 5. Database Design

### Users
- `id` (Primary Key)  
- `name`  
- `email`  
- `password_hashed`  

### Categories
- `id` (Primary Key)  
- `name`  

### Transactions
- `id` (Primary Key)  
- `user_id` (Foreign Key → Users)  
- `category_id` (Foreign Key → Categories)  
- `type` (Income/Expense)  
- `amount`  
- `date`  
- `notes`  

> **Note:** `user_id` ensures each transaction is linked to the correct user. `date` allows filtering by daily, weekly, monthly, or yearly periods.  

---

## 6. API Design

| Endpoint | Method | Description | Input | Output |
|----------|--------|-------------|-------|--------|
| /auth/register | POST | Register user | name, email, password | success/failure message |
| /auth/login | POST | User login | email, password | token/session |
| /transactions | GET | List transactions | optional filter (daily/week/month/year) | transaction list |
| /transactions | POST | Add transaction | type, amount, category, date, notes | created transaction |
| /transactions/:id | PUT | Edit transaction | transaction fields | updated transaction |
| /transactions/:id | DELETE | Delete transaction | transaction id | success/failure message |
| /dashboard | GET | Get totals and charts | optional filter | summary data + chart data |
| /export/pdf | GET | Export filtered transactions | filter | PDF file |

---

## 7. Non-functional Requirements

- **Performance:** Dashboard updates within 2 seconds after adding a transaction  
- **Security:** Passwords hashed, secure login, token-based authentication  
- **Scalability:** Support multiple users and concurrent sessions  
- **Usability:** Easy-to-use forms and clear charts  
- **Maintainability:** Well-structured code for easy future updates  

---

## 8. Success Criteria / Testing

- Users can register and log in successfully  
- Users can add, edit, and delete transactions  
- Dashboard shows correct totals, balances, and charts  
- Filtering by daily, weekly, monthly, or yearly works correctly  
- PDF exports match filtered data  
- All core flows tested manually and automatically  

---

## 9. Timeline / Milestones (Optional)

| Week | Tasks |
|------|-------|
| 1 | Project setup, database creation, auth API & pages |
| 2 | Transactions API, Add/Edit/Delete pages |
| 3 | Dashboard API + frontend, filtering implementation |
| 4 | PDF export, testing, bug fixes, deploy MVP |

---

## 10. Future Improvements (Optional)

- Budget tracking with alerts  
- Recurring transactions  
- Multi-currency support  
- Dark mode / themes  
- Cloud sync for multiple devices  
