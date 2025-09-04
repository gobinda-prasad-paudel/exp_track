import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAPI } from './api';

interface Admin {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (adminData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('admin-token');
    const adminData = localStorage.getItem('admin-user');
    
    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
      } catch (error) {
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-user');
        setAdmin(null);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await adminAPI.login(email, password);
      if (response.success) {
        localStorage.setItem('admin-token', response.token);
        localStorage.setItem('admin-user', JSON.stringify(response.admin));
        setAdmin(response.admin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (adminData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> => {
    try {
      const response = await adminAPI.register(adminData);
      if (response.success) {
        localStorage.setItem('admin-token', response.token);
        localStorage.setItem('admin-user', JSON.stringify(response.admin));
        setAdmin(response.admin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        register,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}