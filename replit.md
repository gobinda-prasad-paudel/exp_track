# ExpenseTracker

## Overview

ExpenseTracker is a comprehensive expense tracking application with separate frontend, backend, and admin panel. The application supports both Gregorian and Bikram Sambat date systems, providing expense and income tracking with categorization, analytics, PDF export capabilities, and real-time admin monitoring. Built with a modern architecture featuring separate URLs and CORS-enabled communication between services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for authentication state and React Hook Form for form management
- **Data Fetching**: TanStack Query for server state management and caching
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server**: Express.js with REST API on port 5001
- **Database**: MongoDB with Mongoose ODM for document-based storage
- **Real-time**: Socket.IO for live admin updates and notifications
- **CORS**: Enabled for cross-origin requests between frontend and backend
- **Security**: JWT authentication with bcrypt password hashing

### Data Storage Solutions
- **Primary Storage**: MongoDB database with collections for Users, Transactions, and Admins
- **Session Management**: JWT tokens stored in localStorage for client-side authentication
- **Schema Validation**: Mongoose schemas with built-in validation
- **Real-time Updates**: Socket.IO for live data synchronization to admin panel

### Authentication and Authorization
- **User Authentication**: JWT-based authentication with email/password login via API
- **Admin Authentication**: Separate admin authentication system with role-based access
- **API Security**: JWT tokens in Authorization headers for protected routes
- **Frontend Auth**: React Context with axios interceptors for token management
- **Admin Auth**: Separate authentication context for admin panel access

### Component Architecture
- **Design System**: shadcn/ui components with Radix UI primitives
- **Layout System**: Responsive layout with sidebar navigation and top navbar
- **Form Handling**: React Hook Form with Zod validation schemas
- **Data Visualization**: Custom stat cards and transaction lists with sorting/filtering

### Date System Support
- **Dual Calendar**: Support for both Gregorian and Bikram Sambat date systems
- **Date Conversion**: Custom utilities for AD to BS date conversion
- **Localization**: Nepali numerals and month names for BS dates

### Transaction Management
- **Categories**: Predefined income and expense categories with icon mapping
- **CRUD Operations**: Full create, read, update, delete functionality
- **Filtering**: Advanced filtering by date range, type, and category
- **Search**: Text-based search across transaction descriptions and categories

### Export Features
- **PDF Generation**: jsPDF integration for transaction reports
- **Report Customization**: Configurable date ranges and transaction types
- **Summary Statistics**: Automated calculation of totals and balances

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with DOM rendering, TypeScript support
- **Vite**: Build tool with React plugin and runtime error overlay
- **TanStack Query**: Server state management and caching

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for enhanced user experience

### Backend Services
- **MongoDB**: Document database for flexible data storage
- **Mongoose**: ODM for MongoDB with schema validation and middleware
- **Express.js**: Web application framework for Node.js
- **Socket.IO**: Real-time bidirectional event-based communication
- **Axios**: HTTP client for frontend API communication

### Form and Validation
- **React Hook Form**: Form library with validation support
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development environment integration and cartographer

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility
- **class-variance-authority**: Component variant management
- **nanoid**: Unique ID generation for client-side operations

### PDF and Export
- **jsPDF**: Client-side PDF generation for transaction reports

## Application Architecture

### Multi-Application Setup
- **Frontend App**: React application on port 5000 (client/)
- **Backend API**: Express.js server on port 5001 (backend/)
- **Admin Panel**: Separate React application on port 3001 (admin-app/)

### Communication Flow
- Frontend communicates with Backend via axios HTTP requests with CORS
- Admin Panel connects to Backend via axios and Socket.IO for real-time updates
- All applications run independently with separate build processes

### Real-time Features
- **Socket.IO Integration**: Admin panel receives live transaction updates
- **Event Broadcasting**: Backend emits events when transactions are created, updated, or deleted
- **Live Dashboard**: Admin dashboard shows real-time statistics and notifications

### Development Scripts
- `./run-frontend.sh`: Start frontend on port 5000
- `./run-backend.sh`: Start backend API on port 5001  
- `./run-admin.sh`: Start admin panel on port 3001

### API Architecture
- **RESTful Design**: Standard HTTP methods for CRUD operations
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Consistent error responses with proper status codes
- **CORS Configuration**: Enabled for development with proper headers

### Database Schema
- **Users**: Authentication and profile information
- **Transactions**: Financial data with Bikram Sambat date support
- **Admins**: Administrative user management with role-based access