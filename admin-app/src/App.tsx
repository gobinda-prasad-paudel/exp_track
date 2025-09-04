import { Switch, Route, Redirect } from 'wouter';
import { AdminAuthProvider } from './lib/auth';
import { useAdminAuth } from './hooks/useAdminAuth';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';
import TransactionsPage from './pages/Transactions';
import Sidebar from './components/Sidebar';

function AppContent() {
  const { admin, isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/transactions" component={TransactionsPage} />
          <Route>
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}

export default App;