import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Smartphone, 
  Download,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description: "Get detailed insights into your income and expenses with beautiful charts and analytics."
  },
  {
    icon: TrendingUp,
    title: "Income Tracking",
    description: "Track all your income sources including salary, freelance, business, and investments."
  },
  {
    icon: TrendingDown,
    title: "Expense Management",
    description: "Categorize and monitor your expenses across different categories like food, transport, and bills."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is stored locally and remains completely private and secure."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Access your expense tracker from any device with our responsive web design."
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Export your transaction reports and financial summaries as PDF documents."
  }
];

const benefits = [
  "Bikram Sambat date system support",
  "Real-time financial calculations", 
  "Categorized transaction management",
  "Visual data representation with charts",
  "Monthly and yearly financial insights",
  "Offline functionality with local storage"
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
              data-testid="text-hero-title"
            >
              Track Your Finances with
              <span className="text-primary block">ExpenseTracker</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              data-testid="text-hero-description"
            >
              A modern, intuitive expense tracker built for Nepal with Bikram Sambat date support. 
              Take control of your finances with powerful analytics and beautiful insights.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup" data-testid="link-get-started">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" data-testid="link-sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
              Powerful Features for Complete Financial Control
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your finances effectively and make informed decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="text-benefits-title">
                Why Choose ExpenseTracker?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Built specifically for Nepali users with features that matter most for personal finance management.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                    data-testid={`benefit-item-${index}`}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">रु. 2,45,000</div>
                    <div className="text-muted-foreground">Current Balance</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-semibold text-green-600">रु. 3,50,000</div>
                      <div className="text-sm text-green-700">Total Income</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-semibold text-red-600">रु. 1,05,000</div>
                      <div className="text-sm text-red-700">Total Expenses</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    २०८१ साल कार्तिक १५ गते
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6" data-testid="text-cta-title">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of users who are already managing their finances better with ExpenseTracker.
            </p>
            <Link href="/signup" data-testid="link-cta-signup">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Start Tracking Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
