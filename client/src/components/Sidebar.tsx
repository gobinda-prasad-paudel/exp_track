import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/constants";
import { getCurrentBSDateString } from "@/lib/date-utils";
import {
  Wallet,
  BarChart3,
  TrendingUp,
  TrendingDown,
  List,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/income", label: "Income", icon: TrendingUp },
  { path: "/expenses", label: "Expenses", icon: TrendingDown },
  { path: "/transactions", label: "Transactions", icon: List },
  { path: "/export-pdf", label: "Export PDF", icon: FileText },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-card border-r border-border shadow-sm"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">ExpenseTracker</h1>
        </div>
        <div className="mt-4 text-sm text-muted-foreground" data-testid="text-bs-date">
          {getCurrentBSDateString()}
        </div>
        {user && (
          <div className="mt-2 text-sm text-foreground" data-testid="text-username">
            Welcome, {user.firstName}
          </div>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className={`sidebar-nav-link flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${isActive
                    ? "active bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <Link href="/profile" data-testid="link-profile">
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className={`sidebar-nav-link flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${location === "/profile"
                  ? "active bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onClick={logout}
            data-testid="button-logout"
            className="sidebar-nav-link w-full flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </nav>
    </motion.aside>
  );
}
