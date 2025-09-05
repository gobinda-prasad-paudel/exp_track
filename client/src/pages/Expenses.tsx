import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Transaction, InsertTransaction } from "@shared/schema";
import axios from "axios";

export default function Expenses() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get<Transaction[]>("/api/transactions", {
        params: { userId: user?.id, type: "expense" },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response", res.data);
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error("Failed to load expense transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: InsertTransaction) => {
    try {
      if (editingTransaction) {
        await axios.put(`/api/transactions/${editingTransaction.id}`, data);
        setEditingTransaction(null);
      } else {
        await axios.post("/api/transactions", { ...data, type: "expense", userId: user?.id });
      }
      loadTransactions();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save expense transaction:", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      loadTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleCancel = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading expense data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-b border-border px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground" data-testid="text-expenses-title">
              Expense Management
            </h2>
            <p className="text-muted-foreground">Track and categorize all your expenses</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600" data-testid="text-total-expenses">
                रु. {totalExpenses.toLocaleString()}
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              data-testid="button-add-expense"
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="p-6 space-y-6">
        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={!!editingTransaction}
            />
          </motion.div>
        )}

        {/* Expense Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-expense-summary-title">Expense Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600" data-testid="text-total-amount">
                    रु. {totalExpenses.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-700">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-total-count">
                    {transactions.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Entries</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600" data-testid="text-average-amount">
                    रु. {transactions.length > 0 ? Math.round(totalExpenses / transactions.length).toLocaleString() : 0}
                  </div>
                  <div className="text-sm text-purple-700">Average Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Categories Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-category-overview-title">Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  transactions.reduce((acc, transaction) => {
                    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, amount]) => (
                  <div key={category} className="p-3 bg-muted rounded-lg" data-testid={`category-${category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}>
                    <div className="text-sm font-medium text-foreground">{category}</div>
                    <div className="text-lg font-bold text-red-600">रु. {amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
            title="Expense Transactions"
          />
        </motion.div>
      </div>
    </div>
  );
}
