import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance for admin
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth API calls
export const adminAPI = {
  login: async (email: string, password: string) => {
    const response = await adminApiClient.post('/admin/login', { email, password });
    return response.data;
  },
  
  register: async (adminData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await adminApiClient.post('/admin/register', adminData);
    return response.data;
  },
  
  getDashboard: async () => {
    const response = await adminApiClient.get('/admin/dashboard');
    return response.data;
  },
  
  getUsers: async (page = 1, limit = 10) => {
    const response = await adminApiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getTransactions: async (page = 1, limit = 20) => {
    const response = await adminApiClient.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default adminApiClient;