// import { Switch, Route, Redirect } from "wouter";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./lib/queryClient";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/context/AuthContext";
// import { Layout } from "@/components/Layout";
// import { useAuth } from "@/hooks/useAuth";

// // Pages
// import Home from "@/pages/Home";
// import Dashboard from "@/pages/Dashboard";
// import Income from "@/pages/Income";
// import Expenses from "@/pages/Expenses";
// import Transactions from "@/pages/Transactions";
// import ExportPDF from "@/pages/ExportPDF";
// import Login from "@/pages/Login";
// import Signup from "@/pages/Signup";
// import Profile from "@/pages/Profile";
// import NotFound from "@/pages/not-found";

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Redirect to="/login" />;
//   }

//   return <>{children}</>;
// }

// function Router() {
//   return (
//     <Layout>
//       <Switch>
//         <Route path="/" component={Home} />
//         <Route path="/login" component={Login} />
//         <Route path="/signup" component={Signup} />

//         <Route path="/dashboard">
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         </Route>

//         <Route path="/income">
//           <ProtectedRoute>
//             <Income />
//           </ProtectedRoute>
//         </Route>

//         <Route path="/expenses">
//           <ProtectedRoute>
//             <Expenses />
//           </ProtectedRoute>
//         </Route>

//         <Route path="/transactions">
//           <ProtectedRoute>
//             <Transactions />
//           </ProtectedRoute>
//         </Route>

//         <Route path="/export-pdf">
//           <ProtectedRoute>
//             <ExportPDF />
//           </ProtectedRoute>
//         </Route>

//         <Route path="/profile">
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         </Route>

//         <Route component={NotFound} />
//       </Switch>
//     </Layout>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <AuthProvider>
//           <Toaster />
//           <Router />
//         </AuthProvider>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { Switch, Route, Redirect } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
// import { useAuth } from "@/lib/useAuth";
import { Toaster } from "react-hot-toast";


// Pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Income from "@/pages/Income";
import Expenses from "@/pages/Expenses";
import Transactions from "@/pages/Transactions";
import ExportPDF from "@/pages/ExportPDF";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/constants";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />

        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/income">
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        </Route>

        <Route path="/expenses">
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        </Route>

        <Route path="/transactions">
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        </Route>

        <Route path="/export-pdf">
          <ProtectedRoute>
            <ExportPDF />
          </ProtectedRoute>
        </Route>

        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;

