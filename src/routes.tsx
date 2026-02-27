import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Root from './components/Root';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import TruckOwners from './pages/TruckOwners';
import TruckOwnerDetails from './pages/TruckOwnerDetails';
import AddTruckOwner from './pages/AddTruckOwner';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Fares from './pages/Fares';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'users',
        children: [
          { index: true, element: <Users /> },
          { path: ':id', element: <UserDetails /> }
        ]
      },
      {
        path: 'truck-owners',
        children: [
          { index: true, element: <TruckOwners /> },
          { path: 'add', element: <AddTruckOwner /> },
          { path: ':id', element: <TruckOwnerDetails /> }
        ]
      },
      {
        path: 'drivers',
        children: [
          { index: true, element: <Drivers /> },
          { path: ':id', element: <DriverDetails /> }
        ]
      },
      {
        path: 'jobs',
        children: [
          { index: true, element: <Jobs /> },
          { path: ':id', element: <JobDetails /> }
        ]
      },
      { path: 'fares', element: <Fares /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'payments', element: <Payments /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
