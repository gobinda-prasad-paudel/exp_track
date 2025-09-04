# Expense Tracker Application

A comprehensive expense tracking application with separate frontend, backend, and admin panel.

## Architecture

- **Frontend**: React app running on port 5000
- **Backend**: Express.js API with MongoDB running on port 5001
- **Admin Panel**: Separate React app running on port 3001
- **Database**: MongoDB with real-time Socket.IO updates

## Features

### Frontend (Client App)
- User authentication (login/register)
- Expense and income tracking
- Bikram Sambat date system support
- Dashboard with analytics
- PDF export functionality
- Transaction management with CRUD operations

### Backend (API)
- Express.js REST API
- MongoDB with Mongoose ODM
- User and transaction management
- JWT authentication
- Real-time Socket.IO for admin updates
- CORS enabled for cross-origin requests

### Admin Panel
- Admin authentication (separate from users)
- Real-time dashboard with live transaction updates
- User management and analytics
- Transaction monitoring
- Socket.IO integration for live updates

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or connection string
- npm or yarn

### Installation

1. Install dependencies for all applications:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Admin app dependencies
cd ../admin-app
npm install
```

### Environment Setup

Create `.env` file in the backend directory:
```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-here
```

### Running the Applications

#### Option 1: Run individually

**Frontend (Port 5000):**
```bash
chmod +x run-frontend.sh
./run-frontend.sh
```

**Backend (Port 5001):**
```bash
chmod +x run-backend.sh
./run-backend.sh
```

**Admin Panel (Port 3001):**
```bash
chmod +x run-admin.sh
./run-admin.sh
```

#### Option 2: Run using npm scripts

**Frontend:**
```bash
cd client
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

**Admin Panel:**
```bash
cd admin-app
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get user statistics

### Admin
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/transactions` - Get all transactions (paginated)

## Real-time Features

The admin panel receives real-time updates via Socket.IO when:
- New transactions are created
- Transactions are updated
- Transactions are deleted

## Database Schema

### Users
- username, email, password
- firstName, lastName
- createdAt timestamps

### Transactions
- userId (reference to User)
- type (income/expense)
- amount, category, description
- date (Gregorian), bsDate (Bikram Sambat)
- createdAt, updatedAt timestamps

### Admins
- username, email, password
- firstName, lastName, role
- isActive status
- createdAt timestamps

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter, TanStack Query
- **Backend**: Express.js, MongoDB, Mongoose, Socket.IO, JWT
- **Admin**: React, TypeScript, Tailwind CSS, Socket.IO Client
- **Build Tools**: Vite, PostCSS, Autoprefixer

## Development

- All applications have hot reload enabled
- CORS is configured for development
- TypeScript support throughout
- ESLint and Prettier configuration included