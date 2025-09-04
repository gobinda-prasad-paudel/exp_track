import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { storageService } from "@/lib/storage";
import { generateTransactionsPDF, downloadPDF } from "@/lib/pdf-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import { Transaction } from "@shared/schema";

export default function ExportPDF() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [includeIncome, setIncludeIncome] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, dateFrom, dateTo, typeFilter, categoryFilter, includeIncome, includeExpenses]);

  const loadTransactions = () => {
    if (user) {
      const userTransactions = storageService.getUserTransactions(user.id);
      setTransactions(userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateTo));
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Filter by include settings
    if (!includeIncome) {
      filtered = filtered.filter(t => t.type !== "income");
    }
    if (!includeExpenses) {
      filtered = filtered.filter(t => t.type !== "expense");
    }

    setFilteredTransactions(filtered);
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(transactions.map(t => t.category))).sort();
  };

  const getExportStats = () => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      totalTransactions: filteredTransactions.length,
      recentTransactions: filteredTransactions.slice(0, 10),
    };
  };

  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export with current filters",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const stats = getExportStats();
      const doc = await generateTransactionsPDF(filteredTransactions, stats);

      const filename = `expense-report-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(doc, filename);

      toast({
        title: "Success",
        description: `PDF exported successfully with ${filteredTransactions.length} transactions`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setIncludeIncome(true);
    setIncludeExpenses(true);
  };

  const stats = getExportStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading export data...</div>
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
            <h2 className="text-2xl font-semibold text-foreground" data-testid="text-export-title">
              Export PDF Report
            </h2>
            <p className="text-muted-foreground">Generate and download detailed financial reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting || filteredTransactions.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="button-export-pdf"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="p-6 space-y-6">
        {/* Export Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-lg font-bold text-green-600" data-testid="text-export-income">
                      रु. {stats.totalIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">Total Income</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-lg font-bold text-red-600" data-testid="text-export-expenses">
                      रु. {stats.totalExpenses.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-700">Total Expenses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className={`text-lg font-bold ${stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-export-balance">
                      रु. {stats.totalBalance.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Net Balance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-lg font-bold text-purple-600" data-testid="text-export-count">
                      {stats.totalTransactions}
                    </div>
                    <div className="text-sm text-purple-700">Transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" data-testid="text-export-options-title">
                <Filter className="h-5 w-5" />
                <span>Export Filters & Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div>
                <Label className="text-base font-medium mb-3 block">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">From Date</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      data-testid="input-date-from"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">To Date</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      data-testid="input-date-to"
                    />
                  </div>
                </div>
              </div>

              {/* Type and Category Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select value={typeFilter} onValueChange={(value: "all" | "income" | "expense") => setTypeFilter(value)}>
                    <SelectTrigger data-testid="select-export-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income Only</SelectItem>
                      <SelectItem value="expense">Expenses Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger data-testid="select-export-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Include Options */}
              <div>
                <Label className="text-base font-medium mb-3 block">Include in Report</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeIncome"
                      checked={includeIncome}
                      onCheckedChange={setIncludeIncome}
                      data-testid="checkbox-include-income"
                    />
                    <Label htmlFor="includeIncome">Income Transactions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeExpenses"
                      checked={includeExpenses}
                      onCheckedChange={setIncludeExpenses}
                      data-testid="checkbox-include-expenses"
                    />
                    <Label htmlFor="includeExpenses">Expense Transactions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={includeSummary}
                      onCheckedChange={setIncludeSummary}
                      data-testid="checkbox-include-summary"
                    />
                    <Label htmlFor="includeSummary">Summary Statistics</Label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  data-testid="button-reset-filters"
                >
                  Reset Filters
                </Button>
                <div className="text-sm text-muted-foreground" data-testid="text-filtered-count">
                  {filteredTransactions.length} transactions will be exported
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-instructions-title">Export Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p>Configure your desired filters and date range above</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p>Review the preview statistics to ensure the data is correct</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p>Click "Export PDF" to generate and download your financial report</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p>The PDF will include transaction details, Bikram Sambat dates, and summary statistics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
