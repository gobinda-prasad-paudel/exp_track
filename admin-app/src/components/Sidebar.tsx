import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();
  const { admin, logout } = useAdminAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-600">Expense Tracker</p>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <div className="text-sm text-gray-600">Logged in as</div>
          <div className="font-medium text-gray-900">
            {admin?.firstName} {admin?.lastName}
          </div>
          <div className="text-sm text-gray-500">{admin?.email}</div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === '/dashboard' && location === '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}