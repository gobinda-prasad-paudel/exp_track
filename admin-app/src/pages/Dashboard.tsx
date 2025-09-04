import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';
import { socketService } from '../lib/socket';
import { Users, CreditCard, DollarSign, TrendingUp, Bell } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  thisMonthUsers: number;
  thisMonthTransactions: number;
}

interface RecentTransaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RecentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Connect to socket for real-time updates
    socketService.connect();
    
    // Listen for real-time updates
    socketService.on('transaction-added', (data) => {
      setNotifications(prev => [`New transaction: ${data.transaction.type} of $${data.transaction.amount}`, ...prev.slice(0, 4)]);
      loadDashboardData(); // Refresh stats
    });

    socketService.on('transaction-updated', (data) => {
      setNotifications(prev => [`Transaction updated: ${data.transaction.type} of $${data.transaction.amount}`, ...prev.slice(0, 4)]);
      loadDashboardData(); // Refresh stats
    });

    socketService.on('transaction-deleted', (data) => {
      setNotifications(prev => [`Transaction deleted by ${data.user.firstName} ${data.user.lastName}`, ...prev.slice(0, 4)]);
      loadDashboardData(); // Refresh stats
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setStats(response.dashboard.stats);
        setRecentTransactions(response.dashboard.recentTransactions);
        setRecentUsers(response.dashboard.recentUsers);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Total Income',
      value: `$${(stats?.totalIncome || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Expenses',
      value: `$${(stats?.totalExpenses || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        {notifications.length > 0 && (
          <div className="relative">
            <Bell className="h-6 w-6 text-blue-600" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Recent Activity</h3>
          <div className="space-y-1">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="text-sm text-blue-700">
                • {notification}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.userId.firstName} {transaction.userId.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <div key={user._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}