import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@shared/schema";
import { CATEGORY_ICONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  title?: string;
  limit?: number;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  showActions = false,
  title = "Transactions",
  limit
}: TransactionListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete?.(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getIconClass = (category: string): string => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || "fas fa-circle";
  };

  if (displayTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-transactions-title">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground" data-testid="text-no-transactions">
              No transactions found
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="text-transactions-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="transaction-item flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors duration-200"
                data-testid={`transaction-item-${transaction.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground truncate" data-testid={`text-category-${transaction.id}`}>
                        {transaction.category}
                      </p>
                      <Badge 
                        variant={transaction.type === "income" ? "default" : "secondary"}
                        data-testid={`badge-type-${transaction.id}`}
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate" data-testid={`text-description-${transaction.id}`}>
                      {transaction.description || "No description"}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-date-${transaction.id}`}>
                      {transaction.bsDate} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`font-semibold text-lg ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                    data-testid={`text-amount-${transaction.id}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}रु. {transaction.amount.toLocaleString()}
                  </span>

                  {showActions && (
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit?.(transaction)}
                        data-testid={`button-edit-${transaction.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={
                          deleteConfirm === transaction.id
                            ? "text-destructive hover:text-destructive"
                            : ""
                        }
                        onClick={() => handleDelete(transaction.id)}
                        data-testid={`button-delete-${transaction.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleteConfirm === transaction.id && (
                          <span className="ml-1 text-xs">Confirm?</span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
