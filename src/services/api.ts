import axios from 'axios';
import {
  User,
  TruckOwner,
  Driver,
  Job,
  FareStructure,
  Booking,
  Payment,
  Notification,
  Settings,
  DashboardStats,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: (credentials: any) => api.post('/auth/admin/login', credentials),
  getMe: () => api.get('/auth/me'),

  // Admin dashboard (new)
  getAdminDashboard: () => api.get<{ success: boolean; data: any }>('/admin/dashboard'),

  // Legacy stats (for existing dashboard cards based on jobs/payments)
  getStats: () => api.get<DashboardStats>('/stats'),

  // Settings (legacy)
  getSettings: () => api.get<Settings>('/settings'),
  updateSettings: (settings: Partial<Settings>) => api.put<Settings>('/settings', settings),

  // Users (legacy)
  getUsers: () => api.get<User[]>('/users'),
  getUser: (id: string) => api.get<User>(`/users/${id}`),
  createUser: (user: Partial<User>) => api.post<User>('/users', user),
  updateUser: (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
  deleteUser: (id: string) => api.delete(`/users/${id}`),

  // TruckOwners (new admin endpoints)
  getTruckOwners: (status: string = 'all') =>
    api.get<{ success: boolean; data: TruckOwner[] }>(`/admin/truck-owners`, {
      params: { status },
    }),
  getTruckOwner: (id: string) =>
    api.get<{ success: boolean; data: any }>(`/admin/truck-owners/${id}`),
  approveTruckOwner: (id: string) =>
    api.patch<{ success: boolean; data: any }>(`/admin/truck-owners/${id}/approve`),
  rejectTruckOwner: (id: string) =>
    api.patch<{ success: boolean; data: any }>(`/admin/truck-owners/${id}/reject`),
  suspendTruckOwner: (id: string) =>
    api.patch<{ success: boolean; data: any }>(`/admin/truck-owners/${id}/suspend`),

  // Drivers (new admin endpoint list)
  getDrivers: () => api.get<{ success: boolean; data: Driver[] }>('/admin/drivers'),

  // Jobs (legacy)
  getJobs: () => api.get<Job[]>('/jobs'),
  getJob: (id: string) => api.get<Job>(`/jobs/${id}`),
  createJob: (job: Partial<Job>) => api.post<Job>('/jobs', job),
  updateJob: (id: string, job: Partial<Job>) => api.put<Job>(`/jobs/${id}`, job),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),

  // FareStructures (legacy)
  getFares: () => api.get<FareStructure[]>('/farestructures'),
  createFare: (fare: Partial<FareStructure>) => api.post<FareStructure>('/farestructures', fare),
  updateFare: (id: string, fare: Partial<FareStructure>) =>
    api.put<FareStructure>(`/farestructures/${id}`, fare),
  deleteFare: (id: string) => api.delete(`/farestructures/${id}`),

  // Bookings (admin view)
  getBookings: () => api.get<{ success: boolean; data: Booking[] }>('/admin/bookings'),

  // Payments (legacy)
  getPayments: () => api.get<Payment[]>('/payments'),
  createPayment: (payment: Partial<Payment>) => api.post<Payment>('/payments', payment),
  updatePayment: (id: string, payment: Partial<Payment>) =>
    api.put<Payment>(`/payments/${id}`, payment),
  deletePayment: (id: string) => api.delete(`/payments/${id}`),

  // Notifications (legacy)
  getNotifications: () => api.get<Notification[]>('/notifications'),
  createNotification: (notification: Partial<Notification>) =>
    api.post<Notification>('/notifications', notification),
  updateNotification: (id: string, notification: Partial<Notification>) =>
    api.put<Notification>(`/notifications/${id}`, notification),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),

  // Categories (admin CRUD)
  getCategories: () => api.get<{ success: boolean; data: any[] }>('/admin/categories'),
  createCategory: (payload: any) =>
    api.post<{ success: boolean; data: any }>('/admin/categories', payload),
  updateCategory: (id: string, payload: any) =>
    api.put<{ success: boolean; data: any }>(`/admin/categories/${id}`, payload),
  deleteCategory: (id: string) =>
    api.delete<{ success: boolean; data: null }>(`/admin/categories/${id}`),
};

export default api;
