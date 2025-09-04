import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { storageService } from "@/lib/storage";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Transaction, InsertTransaction } from "@shared/schema";

export default function Income() {
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

  const loadTransactions = () => {
    if (user) {
      const userTransactions = storageService.getUserTransactions(user.id);
      const incomeTransactions = userTransactions.filter(t => t.type === "income");
      setTransactions(incomeTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: InsertTransaction) => {
    if (editingTransaction) {
      await storageService.updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      await storageService.createTransaction({ ...data, type: "income" });
    }
    loadTransactions();
    setShowForm(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await storageService.deleteTransaction(id);
    loadTransactions();
  };

  const handleCancel = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading income data...</div>
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
            <h2 className="text-2xl font-semibold text-foreground" data-testid="text-income-title">
              Income Management
            </h2>
            <p className="text-muted-foreground">Track and manage all your income sources</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Income</div>
              <div className="text-2xl font-bold text-green-600" data-testid="text-total-income">
                रु. {totalIncome.toLocaleString()}
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              data-testid="button-add-income"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Income
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

        {/* Income Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-income-summary-title">Income Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-total-amount">
                    रु. {totalIncome.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600" data-testid="text-total-count">
                    {transactions.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Entries</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600" data-testid="text-average-amount">
                    रु. {transactions.length > 0 ? Math.round(totalIncome / transactions.length).toLocaleString() : 0}
                  </div>
                  <div className="text-sm text-purple-700">Average Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income List */}
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
            title="Income Transactions"
          />
        </motion.div>
      </div>
    </div>
  );
}
