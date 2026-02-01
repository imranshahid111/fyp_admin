import { useState, ChangeEvent } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Star, Ban, Plus, Clock, Users } from 'lucide-react';
import { mockTruckOwners } from '../data/mockData';
import type { TruckOwner } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function TruckOwners() {
  const [truckOwners, setTruckOwners] = useState<TruckOwner[]>(mockTruckOwners);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    totalTrucks: 0,
    totalDrivers: 0,
  });
  const [error, setError] = useState<string>('');

  // Filtered truck owners based on search term and status filter
  const filteredTruckOwners = truckOwners.filter((owner: TruckOwner) => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Approve, reject, and deactivate truck owners
  const handleApprove = (ownerId: string) => {
    setTruckOwners(truckOwners.map((owner: TruckOwner) =>
      owner.id === ownerId ? { ...owner, status: 'approved' } : owner
    ));
  };

  const handleReject = (ownerId: string) => {
    setTruckOwners(truckOwners.map((owner: TruckOwner) =>
      owner.id === ownerId ? { ...owner, status: 'rejected' } : owner
    ));
  };

  const handleDeactivate = (ownerId: string) => {
    setTruckOwners(truckOwners.map((owner: TruckOwner) =>
      owner.id === ownerId ? { ...owner, status: 'inactive' } : owner
    ));
  };

  // Add new truck owner and reset form state
  const handleAddOwner = () => {
    if (newOwner.name && newOwner.email && newOwner.phone && newOwner.company) {
      const owner: TruckOwner = {
        id: `TO${String(truckOwners.length + 1).padStart(3, '0')}`,
        ...newOwner,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        rating: 0,
      };

      setTruckOwners([owner, ...truckOwners]);
      setNewOwner({
        name: '',
        email: '',
        phone: '',
        company: '',
        totalTrucks: 0,
        totalDrivers: 0,
      });
      setError('');
      setShowAddModal(false);
    } else {
      setError('Please fill out all fields correctly.');
    }
  };

  const pendingCount = truckOwners.filter((o: TruckOwner) => o.status === 'pending').length;
  const approvedCount = truckOwners.filter((o: TruckOwner) => o.status === 'approved').length;

  const statCards = [
    {
      name: 'Total Owners',
      value: truckOwners.length,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-50',
      show: true
    },
    {
      name: 'Pending Approval',
      value: pendingCount,
      icon: Clock,
      gradient: 'from-orange-500 to-amber-600',
      iconColor: 'text-orange-50',
      show: pendingCount > 0,
      valueColor: 'text-orange-600'
    },
    {
      name: 'Approved',
      value: approvedCount,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      iconColor: 'text-green-50',
      show: true,
      valueColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Truck Owner Management
          </h1>
          <p className="text-gray-600 mt-2">Manage truck owners and their registrations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Truck Owner
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.filter(card => card.show).map((card) => {
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
              placeholder="Search by name, email, or company..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Truck Owners Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trucks</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Drivers</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTruckOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{owner.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{owner.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{owner.company}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{owner.email}</div>
                    <div className="text-xs text-gray-500">{owner.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{owner.totalTrucks}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{owner.totalDrivers}</td>
                  <td className="px-6 py-4">
                    {owner.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{owner.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={owner.status} type="approval" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {owner.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(owner.id)}
                            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(owner.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {owner.status === 'approved' && (
                        <button
                          onClick={() => handleDeactivate(owner.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                          title="Deactivate"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTruckOwners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No truck owners found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Truck Owner Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Truck Owner"
        size="md"
      >
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={newOwner.name}
              onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={newOwner.company}
              onChange={(e) => setNewOwner({ ...newOwner, company: e.target.value })}
              placeholder="Enter company name"
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
                value={newOwner.email}
                onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
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
                value={newOwner.phone}
                onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                placeholder="+1-555-0000"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Trucks
              </label>
              <input
                type="number"
                min="0"
                value={newOwner.totalTrucks}
                onChange={(e) => setNewOwner({ ...newOwner, totalTrucks: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Drivers
              </label>
              <input
                type="number"
                min="0"
                value={newOwner.totalDrivers}
                onChange={(e) => setNewOwner({ ...newOwner, totalDrivers: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAddModal(false);
              setNewOwner({
                name: '',
                email: '',
                phone: '',
                company: '',
                totalTrucks: 0,
                totalDrivers: 0,
              });
              setError('');
            }}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAddOwner}
            disabled={!newOwner.name || !newOwner.email || !newOwner.phone || !newOwner.company}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add Truck Owner
          </button>
        </div>
      </Modal>
    </div>
  );
}
