export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalBookings: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface TruckOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  registrationDate: string;
  totalTrucks: number;
  totalDrivers: number;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  rating: number;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  truckOwnerId: string;
  truckOwnerName: string;
  assignedJobs: number;
  completedJobs: number;
  status: 'available' | 'on-job' | 'inactive';
  rating: number;
}

export interface Job {
  id: string;
  userId: string;
  userName: string;
  truckOwnerId: string;
  truckOwnerName: string;
  driverId?: string;
  driverName?: string;
  pickupLocation: string;
  deliveryLocation: string;
  truckType: string;
  requestedDate: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
}

export interface FareStructure {
  id: string;
  truckType: string;
  minFare: number;
  maxFare: number;
  perKmRate: number;
  basePrice: number;
}

export interface Booking {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  truckOwnerId: string;
  truckOwnerName: string;
  driverId: string;
  driverName: string;
  date: string;
  fare: number;
  status: 'completed' | 'cancelled';
  route: string;
  truckType: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  disputeStatus?: 'none' | 'raised' | 'resolved';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: 'all' | 'users' | 'truck-owners' | 'drivers';
  createdDate: string;
  status: 'sent' | 'draft';
}

export interface Settings {
  truckTypes: string[];
  jobCategories: string[];
  defaultFareMultiplier: number;
  platformCommission: number;
  supportEmail: string;
  supportPhone: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalTruckOwners: number;
  totalDrivers: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
  pendingPayments: number;
}
