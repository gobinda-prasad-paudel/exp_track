import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import axios from "axios";
import { getCurrentBSDateString } from "@/lib/date-utils";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  List,
  Plus,
  Minus,
  BarChart3,
  Download
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";



export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<object>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/transactions/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ log response directly
        console.log("Transactions from backend:", res.data);

        // ✅ update state
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // // ✅ react to stats when it changes
  // useEffect(() => {
  //   if (stats) {
  //     console.log("Stats updated in state:", stats);
  //   }
  // }, [stats]);


  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
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
            <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">{getCurrentBSDateString()}</div>
            {user && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={`रु. ${stats.totalBalance?.toLocaleString()}`}
            change="+12.5%"
            changeType="positive"
            icon={Wallet}
          />

          <StatCard
            title="Total Income"
            value={`रु. ${stats.totalIncome?.toLocaleString()}`}
            change="+8.2%"
            changeType="positive"
            icon={TrendingUp}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            title="Total Expenses"
            value={`रु. ${stats.totalExpenses?.toLocaleString()}`}
            change="-3.1%"
            changeType="negative"
            icon={TrendingDown}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />

          <StatCard
            title="Transactions"
            value={stats.totalTransactions?.toString()}
            change="+15"
            changeType="positive"
            icon={List}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid="text-monthly-overview-title">Monthly Overview</CardTitle>
                    <Select defaultValue="kartik-2081">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kartik-2081">कार्तिक २०८१</SelectItem>
                        <SelectItem value="asoj-2081">असोज २०८१</SelectItem>
                        <SelectItem value="bhadra-2081">भदौ २०८१</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>Charts will be displayed here</p>
                      <p className="text-sm">This Month: रु. {stats.thisMonthIncome?.toLocaleString()} income, रु. {stats.thisMonthExpenses?.toLocaleString()} expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-category-breakdown-title">Expense Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>Category breakdown chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle data-testid="text-recent-transactions-title">Recent Transactions</CardTitle>
                  <Link href="/transactions" data-testid="link-view-all-transactions">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {stats.recentTransactions?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentTransactions.slice(0, 5).map((transaction: any) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                        data-testid={`recent-transaction-${transaction.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === "income"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                              }`}
                          >
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{transaction.category}</p>
                            <p className="text-xs text-muted-foreground">{transaction.bsDate}</p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}रु. {transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-quick-actions-title">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/income" data-testid="link-add-income">
                  <Button
                    variant="outline"
                    className="w-full h-16 flex items-center space-x-3 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Income</span>
                  </Button>
                </Link>

                <Link href="/expenses" data-testid="link-add-expense">
                  <Button
                    variant="outline"
                    className="w-full h-16 flex items-center space-x-3 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                  >
                    <Minus className="h-5 w-5" />
                    <span className="font-medium">Add Expense</span>
                  </Button>
                </Link>

                <Link href="/transactions" data-testid="link-view-report">
                  <Button
                    variant="outline"
                    className="w-full h-16 flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">View Report</span>
                  </Button>
                </Link>

                <Link href="/export-pdf" data-testid="link-export-pdf">
                  <Button
                    variant="outline"
                    className="w-full h-16 flex items-center space-x-3 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                  >
                    <Download className="h-5 w-5" />
                    <span className="font-medium">Export PDF</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
