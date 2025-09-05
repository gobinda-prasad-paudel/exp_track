import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCurrentBSDateString } from "@/lib/date-utils";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Settings,
  Shield,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { logout } = useAuth(); // ✅ only keep logout
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  });

  // ✅ fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUser = response.data.user;

        setUser(currentUser);
        setStats("userStats"); // replace with real stats later
        form.reset({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username,
          email: currentUser.email,
        });
        console.log("User", currentUser)
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(`/api/auth/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);

      form.reset({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
      });

      useToast({
        title: "Profile updated!",
        description: "Your profile information has been updated successfully.",
        variant: "success",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      useToast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
  };

  const handleDataExport = async () => {
    if (!user) return;
    try {
      const response = await axios.post(
        "/api/export/json",
        { userId: user.id },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense-tracker-data-${new Date()
        .toISOString()
        .split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      useToast({
        title: "Data exported",
        description: "Your data has been exported successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Export error:", err);
      useToast({
        title: "Export failed",
        description: "Could not export your data.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    useToast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      varient: "success"
    });
  };

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">
            Loading profile...
          </div>
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
            <h2 className="text-2xl font-semibold text-foreground" data-testid="text-profile-title">
              Profile Settings
            </h2>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" data-testid="badge-bs-date">
              {getCurrentBSDateString()}
            </Badge>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium" data-testid="text-user-avatar">
                {user?.firstName[0]}{user?.lastName[0]}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2" data-testid="text-profile-info-title">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  data-testid="button-edit-profile"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className={form.formState.errors.firstName ? "border-destructive" : ""}
                        data-testid="input-first-name"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive" data-testid="error-first-name">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className={form.formState.errors.lastName ? "border-destructive" : ""}
                        data-testid="input-last-name"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive" data-testid="error-last-name">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...form.register("username")}
                        className={form.formState.errors.username ? "border-destructive" : ""}
                        data-testid="input-username"
                      />
                      {form.formState.errors.username && (
                        <p className="text-sm text-destructive" data-testid="error-username">
                          {form.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        className={form.formState.errors.email ? "border-destructive" : ""}
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive" data-testid="error-email">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      data-testid="button-save-profile"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                      </div>
                      <p className="text-foreground font-medium" data-testid="text-full-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                      </div>
                      <p className="text-foreground font-medium" data-testid="text-email">
                        {user?.email}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Username</span>
                      </div>
                      <p className="text-foreground font-medium" data-testid="text-username">
                        {user?.username}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                      </div>
                      <p className="text-foreground font-medium" data-testid="text-member-since">
                        {new Date(user?.dateOfJoin)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" data-testid="text-financial-overview-title">
                <BarChart3 className="h-5 w-5" />
                <span>Financial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600" data-testid="text-total-income">
                    रु. {stats.totalIncome?.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Income</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600" data-testid="text-total-expenses">
                    रु. {stats.totalExpenses?.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-700">Total Expenses</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-net-balance">
                    रु. {stats.totalBalance?.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Net Balance</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground" data-testid="text-total-transactions">
                    {stats?.totalTransactions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>

                <div>
                  <div className="text-lg font-semibold text-foreground" data-testid="text-this-month-income">
                    रु. {stats.thisMonthIncome?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">This Month Income</div>
                </div>

                <div>
                  <div className="text-lg font-semibold text-foreground" data-testid="text-this-month-expenses">
                    रु. {stats.thisMonthExpenses?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">This Month Expenses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" data-testid="text-data-management-title">
                <Shield className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Export Your Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your transaction data as a JSON file
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDataExport}
                    data-testid="button-export-data"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Data Privacy</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is stored locally and never sent to external servers
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-account-actions-title">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  disabled
                  data-testid="button-delete-account"
                >
                  Delete Account (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
