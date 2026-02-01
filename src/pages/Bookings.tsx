import { useState } from 'react';
import { Calendar, TrendingUp, Truck, DollarSign, Search, Download } from 'lucide-react';
import { mockBookings } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = mockBookings.filter((booking) => {
    return (
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.fare, 0);
  const avgFare = totalRevenue / totalBookings;

  const truckTypeStats = mockBookings.reduce((acc, booking) => {
    acc[booking.truckType] = (acc[booking.truckType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking History & Analytics</h1>
        <p className="text-gray-600 mt-1">View booking history and platform analytics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalBookings}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedBookings}</p>
              <p className="text-xs text-green-600 mt-1">
                {((completedBookings / totalBookings) * 100).toFixed(0)}% completion rate
              </p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Fare</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${avgFare.toFixed(0)}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Truck Type Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings by Truck Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(truckTypeStats).map(([type, count]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">{type}</span>
                <span className="text-2xl font-bold text-blue-600">{count}</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(count / totalBookings) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Booking History</h2>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.route}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.truckOwnerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.driverName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.truckType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${booking.fare}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} type="job" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
