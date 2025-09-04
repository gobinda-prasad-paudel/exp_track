import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Transaction API calls
export const transactionAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  
  create: async (transactionData: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string;
    bsDate: string;
  }) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  update: async (id: string, transactionData: any) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
  },
};

export default api;