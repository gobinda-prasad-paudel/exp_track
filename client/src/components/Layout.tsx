import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isUnprotectedPage = ["/", "/login", "/signup"].includes(location);


  return (
    <div className="min-h-screen bg-background">
      {isUnprotectedPage ? (
        <div className="flex flex-col min-h-screen">
          <TopNavbar />
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      ) : (
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
}
