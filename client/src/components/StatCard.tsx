import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  testId?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  testId
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="stat-card bg-card rounded-lg border border-border p-6 shadow-sm"
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className="text-2xl font-bold text-foreground"
            data-testid={testId ? `text-${testId}-value` : undefined}
          >
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`${iconColor} text-lg h-6 w-6`} />
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-4 text-sm">
          <span
            className={`font-medium ${changeType === "positive" ? "text-green-500" : "text-red-500"
              }`}
          >
            {change}
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      )}
    </motion.div>
  );
}
