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
    DashboardStats
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

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
    login: (credentials: any) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),

    // Stats
    getStats: () => api.get<DashboardStats>('/stats'),

    // Settings
    getSettings: () => api.get<Settings>('/settings'),
    updateSettings: (settings: Partial<Settings>) => api.put<Settings>('/settings', settings),

    // Users
    getUsers: () => api.get<User[]>('/users'),
    getUser: (id: string) => api.get<User>(`/users/${id}`),
    createUser: (user: Partial<User>) => api.post<User>('/users', user),
    updateUser: (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
    deleteUser: (id: string) => api.delete(`/users/${id}`),

    // TruckOwners
    getTruckOwners: () => api.get<TruckOwner[]>('/truckowners'),
    getTruckOwner: (id: string) => api.get<TruckOwner>(`/truckowners/${id}`),
    createTruckOwner: (owner: Partial<TruckOwner>) => api.post<TruckOwner>('/truckowners', owner),
    updateTruckOwner: (id: string, owner: Partial<TruckOwner>) => api.put<TruckOwner>(`/truckowners/${id}`, owner),
    deleteTruckOwner: (id: string) => api.delete(`/truckowners/${id}`),

    // Drivers
    getDrivers: () => api.get<Driver[]>('/drivers'),
    getDriver: (id: string) => api.get<Driver>(`/drivers/${id}`),
    createDriver: (driver: Partial<Driver>) => api.post<Driver>('/drivers', driver),
    updateDriver: (id: string, driver: Partial<Driver>) => api.put<Driver>(`/drivers/${id}`, driver),
    deleteDriver: (id: string) => api.delete(`/drivers/${id}`),

    // Jobs
    getJobs: () => api.get<Job[]>('/jobs'),
    getJob: (id: string) => api.get<Job>(`/jobs/${id}`),
    createJob: (job: Partial<Job>) => api.post<Job>('/jobs', job),
    updateJob: (id: string, job: Partial<Job>) => api.put<Job>(`/jobs/${id}`, job),
    deleteJob: (id: string) => api.delete(`/jobs/${id}`),

    // FareStructures
    getFares: () => api.get<FareStructure[]>('/farestructures'),
    createFare: (fare: Partial<FareStructure>) => api.post<FareStructure>('/farestructures', fare),
    updateFare: (id: string, fare: Partial<FareStructure>) => api.put<FareStructure>(`/farestructures/${id}`, fare),
    deleteFare: (id: string) => api.delete(`/farestructures/${id}`),

    // Bookings
    getBookings: () => api.get<Booking[]>('/bookings'),
    createBooking: (booking: Partial<Booking>) => api.post<Booking>('/bookings', booking),
    updateBooking: (id: string, booking: Partial<Booking>) => api.put<Booking>(`/bookings/${id}`, booking),
    deleteBooking: (id: string) => api.delete(`/bookings/${id}`),

    // Payments
    getPayments: () => api.get<Payment[]>('/payments'),
    createPayment: (payment: Partial<Payment>) => api.post<Payment>('/payments', payment),
    updatePayment: (id: string, payment: Partial<Payment>) => api.put<Payment>(`/payments/${id}`, payment),
    deletePayment: (id: string) => api.delete(`/payments/${id}`),

    // Notifications
    getNotifications: () => api.get<Notification[]>('/notifications'),
    createNotification: (notification: Partial<Notification>) => api.post<Notification>('/notifications', notification),
    updateNotification: (id: string, notification: Partial<Notification>) => api.put<Notification>(`/notifications/${id}`, notification),
    deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

export default api;
