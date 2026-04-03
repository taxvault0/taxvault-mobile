import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token expired - logout
      await SecureStore.deleteItemAsync('token');
      // You might want to navigate to login here
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyMfa: (data) => api.post('/auth/verify-mfa', data),
  setupMfa: () => api.post('/auth/setup-mfa'),
  enableMfa: (data) => api.post('/auth/enable-mfa', data),
  disableMfa: () => api.post('/auth/disable-mfa'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Receipt API
export const receiptAPI = {
  getReceipts: (params) => api.get('/receipts', { params }),
  getReceipt: (id) => api.get(`/receipts/${id}`),
  createReceipt: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        formData.append('receipt', {
          uri: data[key].uri,
          type: data[key].type,
          name: data[key].fileName || 'receipt.jpg',
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/receipts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateReceipt: (id, data) => api.put(`/receipts/${id}`, data),
  deleteReceipt: (id) => api.delete(`/receipts/${id}`),
  getCategories: () => api.get('/receipts/categories'),
  getSummary: (taxYear) => api.get('/receipts/summary', { params: { taxYear } }),
};

// Mileage API
export const mileageAPI = {
  getMileage: (taxYear) => api.get('/mileage', { params: { taxYear } }),
  addTrip: (data) => api.post('/mileage/trips', data),
  updateTrip: (tripId, data) => api.put(`/mileage/trips/${tripId}`, data),
  deleteTrip: (tripId) => api.delete(`/mileage/trips/${tripId}`),
  getSummary: (taxYear) => api.get('/mileage/summary', { params: { taxYear } }),
  updateSettings: (settings) => api.put('/mileage/settings', settings),
};

// Document API
export const documentAPI = {
  getDocuments: (params) => api.get('/documents', { params }),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'file') {
        formData.append('document', {
          uri: data[key].uri,
          type: data[key].type,
          name: data[key].fileName || 'document.pdf',
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  getTypes: () => api.get('/documents/types'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getDashboard: (taxYear) => api.get('/users/dashboard', { params: { taxYear } }),
  getStats: () => api.get('/users/stats'),
  
  // Client ID related endpoints
  getMyClientId: () => api.get('/users/me/client-id'),
  searchClientByClientId: (clientId) => api.get(`/users/client/${clientId}`),
};

// CA API
export const caAPI = {
  getClients: (params) => api.get('/ca/clients', { params }),
  getClient: (id) => api.get(`/ca/clients/${id}`),
  getClientDashboard: (id, taxYear) => api.get(`/ca/clients/${id}/dashboard`, { params: { taxYear } }),
  inviteCA: (data) => api.post('/ca/invite', data),
  revokeAccess: (id) => api.delete(`/ca/access/${id}`),
  
  // Client search by ID for CAs
  findClientById: (clientId) => api.get(`/ca/clients/search/by-id/${clientId}`),
};

export default api;



