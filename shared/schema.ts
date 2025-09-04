import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  createdAt: z.string(),
});

export const incomeCategories = [
  "Salary",
  "Freelance", 
  "Business",
  "Investment",
  "Rental",
  "Gift",
  "Bonus",
  "Pension",
  "Other",
] as const;

export const expenseCategories = [
  "Food & Dining",
  "Transportation", 
  "Education",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Other",
] as const;

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category: z.string(),
  description: z.string().optional(),
  date: z.string(), // ISO date string
  bsDate: z.string(), // Bikram Sambat date string
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export const insertTransactionSchema = transactionSchema.omit({ 
  id: true, 
  userId: true, 
  createdAt: true, 
  updatedAt: true 
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type IncomeCategory = typeof incomeCategories[number];
export type ExpenseCategory = typeof expenseCategories[number];
