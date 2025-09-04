# ExpenseTracker

## Overview

ExpenseTracker is a modern web application for personal finance management that supports both Gregorian and Bikram Sambat date systems. The application provides comprehensive expense and income tracking with categorization, analytics, and PDF export capabilities. Built with a focus on local data storage for privacy, it features a responsive design with a dashboard for financial insights and transaction management.

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
- **Server**: Express.js with TypeScript for API endpoints
- **Database**: Configured for PostgreSQL with Neon Database serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Primary Storage**: In-memory storage implementation with plans for PostgreSQL migration
- **Local Storage**: Browser localStorage for client-side data persistence
- **Schema Management**: Shared TypeScript schemas using Zod for validation
- **Migration Support**: Drizzle Kit for database schema migrations

### Authentication and Authorization
- **Authentication**: Custom email/password authentication with session management
- **User Management**: Local user registration and login with encrypted storage
- **Session Handling**: Server-side session management with PostgreSQL backend
- **Authorization**: Route-based protection with authentication context

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
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Express.js**: Web application framework for Node.js

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