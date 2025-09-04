import { incomeCategories, expenseCategories } from "@shared/schema";

export const INCOME_CATEGORIES = incomeCategories;
export const EXPENSE_CATEGORIES = expenseCategories;

export const CATEGORY_ICONS = {
  // Income category icons
  "Salary": "fas fa-briefcase",
  "Freelance": "fas fa-laptop",
  "Business": "fas fa-building",
  "Investment": "fas fa-chart-line",
  "Rental": "fas fa-home",
  "Gift": "fas fa-gift",
  "Bonus": "fas fa-star",
  "Pension": "fas fa-user-clock",
  "Other": "fas fa-plus-circle",

  // Expense category icons
  "Food & Dining": "fas fa-utensils",
  "Transportation": "fas fa-car",
  "Education": "fas fa-graduation-cap",
  "Shopping": "fas fa-shopping-bag",
  "Entertainment": "fas fa-film",
  "Bills & Utilities": "fas fa-bolt",
  "Healthcare": "fas fa-heartbeat",
  "Travel": "fas fa-plane",
} as const;

export const STORAGE_KEYS = {
  USERS: "expense_tracker_users",
  TRANSACTIONS: "expense_tracker_transactions",
  CURRENT_USER: "expense_tracker_current_user",
} as const;
