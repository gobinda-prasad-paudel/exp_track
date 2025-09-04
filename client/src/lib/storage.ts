import { User, Transaction, InsertUser, InsertTransaction } from "@shared/schema";
import { STORAGE_KEYS } from "./constants";
import { adToBs, formatBSDate } from "./date-utils";

class StorageService {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  private setToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  // User management
  getUsers(): User[] {
    return this.getFromStorage(STORAGE_KEYS.USERS, []);
  }

  getCurrentUser(): User | null {
    return this.getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  }

  async createUser(userData: InsertUser): Promise<User | null> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users.some(user => user.email === userData.email || user.username === userData.username)) {
        return null;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      this.setToStorage(STORAGE_KEYS.USERS, users);
      this.setToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
      
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        this.setToStorage(STORAGE_KEYS.CURRENT_USER, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error logging in user:", error);
      return false;
    }
  }

  logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Transaction management
  getTransactions(): Transaction[] {
    return this.getFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
  }

  getUserTransactions(userId: string): Transaction[] {
    return this.getTransactions().filter(transaction => transaction.userId === userId);
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;

      const transactions = this.getTransactions();
      const date = new Date(transactionData.date);
      const bsDate = adToBs(date);
      
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        ...transactionData,
        bsDate: formatBSDate(bsDate),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      transactions.push(newTransaction);
      this.setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
      
      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | null> {
    try {
      const transactions = this.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      
      if (index === -1) return null;

      const updatedTransaction = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (updates.date) {
        const date = new Date(updates.date);
        const bsDate = adToBs(date);
        updatedTransaction.bsDate = formatBSDate(bsDate);
      }

      transactions[index] = updatedTransaction;
      this.setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
      
      return updatedTransaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return null;
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const transactions = this.getTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      
      if (filteredTransactions.length === transactions.length) {
        return false; // Transaction not found
      }

      this.setToStorage(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  }

  // Analytics
  getUserStats(userId: string) {
    const transactions = this.getUserTransactions(userId);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthIncome = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === "income" && 
               tDate.getMonth() === currentMonth && 
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === "expense" && 
               tDate.getMonth() === currentMonth && 
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      thisMonthIncome,
      thisMonthExpenses,
      totalTransactions: transactions.length,
      recentTransactions: transactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    };
  }
}

export const storageService = new StorageService();
