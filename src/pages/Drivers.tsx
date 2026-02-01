import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Star,
  UserCheck,
  UserX,
  Plus,
  Truck,
  CheckCircle,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { mockDrivers, mockTruckOwners } from '../data/mockData';
import type { Driver, TruckOwner } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    truckOwnerId: '',
  });

  const filteredDrivers = drivers.filter((driver: Driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleActivate = (driverId: string) => {
    setDrivers(drivers.map((driver: Driver) =>
      driver.id === driverId ? { ...driver, status: 'available' } : driver
    ));
  };

  const handleDeactivate = (driverId: string) => {
    setDrivers(drivers.map((driver: Driver) =>
      driver.id === driverId ? { ...driver, status: 'inactive' } : driver
    ));
  };

  const handleAddDriver = () => {
    if (newDriver.name && newDriver.email && newDriver.phone && newDriver.licenseNumber && newDriver.truckOwnerId) {
      const truckOwner = mockTruckOwners.find((o: TruckOwner) => o.id === newDriver.truckOwnerId);

      const driver: Driver = {
        id: `D${String(drivers.length + 1).padStart(3, '0')}`,
        ...newDriver,
        truckOwnerName: truckOwner?.company || '',
        assignedJobs: 0,
        completedJobs: 0,
        status: 'available',
        rating: 0,
      };

      setDrivers([driver, ...drivers]);
      setNewDriver({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        truckOwnerId: '',
      });
      setShowAddModal(false);
    }
  };

  const statCards = [
    {
      name: 'Total Drivers',
      value: drivers.length,
      icon: Truck,
      gradient: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-50'
    },
    {
      name: 'Available',
      value: drivers.filter((d: Driver) => d.status === 'available').length,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      iconColor: 'text-green-50',
      valueColor: 'text-green-600'
    },
    {
      name: 'On Job',
      value: drivers.filter((d: Driver) => d.status === 'on-job').length,
      icon: MapPin,
      gradient: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-50',
      valueColor: 'text-blue-600'
    },
    {
      name: 'Inactive',
      value: drivers.filter((d: Driver) => d.status === 'inactive').length,
      icon: AlertCircle,
      gradient: 'from-gray-500 to-gray-600',
      iconColor: 'text-gray-50',
      valueColor: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Driver Management
          </h1>
          <p className="text-gray-600 mt-2">View and manage all drivers on the platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.name}</p>
                  <p className={`text-3xl font-bold ${card.valueColor || 'text-gray-900'}`}>{card.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-10 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="on-job">On Job</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">License</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Truck Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      <div className="text-xs text-gray-500">{driver.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{driver.licenseNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.truckOwnerName}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {driver.assignedJobs}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.completedJobs}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{driver.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={driver.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {driver.status === 'inactive' && (
                        <button
                          onClick={() => handleActivate(driver.id)}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-all"
                          title="Activate Driver"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                      )}
                      {driver.status !== 'inactive' && (
                        <button
                          onClick={() => handleDeactivate(driver.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                          title="Deactivate Driver"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No drivers found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Driver Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Driver"
        size="md"
      >
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                placeholder="+1-555-0000"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              License Number *
            </label>
            <input
              type="text"
              value={newDriver.licenseNumber}
              onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
              placeholder="CDL-123456"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Truck Owner *
            </label>
            <select
              value={newDriver.truckOwnerId}
              onChange={(e) => setNewDriver({ ...newDriver, truckOwnerId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Select Truck Owner</option>
              {mockTruckOwners.filter(o => o.status === 'approved').map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.company} - {owner.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAddModal(false);
              setNewDriver({
                name: '',
                email: '',
                phone: '',
                licenseNumber: '',
                truckOwnerId: '',
              });
            }}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAddDriver}
            disabled={!newDriver.name || !newDriver.email || !newDriver.phone || !newDriver.licenseNumber || !newDriver.truckOwnerId}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add Driver
          </button>
        </div>
      </Modal>
    </div>
  );
}
