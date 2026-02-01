import { useState } from 'react';
import { Search, Filter, Eye, UserPlus, MapPin, Star } from 'lucide-react';
import { mockJobs, mockDrivers } from '../data/mockData';
import type { Job } from '../types';
import StatusBadge from '../components/StatusBadge';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAssignDriver = (jobId: string, driverId: string) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    if (driver) {
      setJobs(jobs.map(job =>
        job.id === jobId
          ? { ...job, driverId, driverName: driver.name, status: 'assigned' as const }
          : job
      ));
      setSelectedJob(null);
    }
  };

  const handleUpdateStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all job requests</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-gray-600">
            Total: <span className="font-bold text-gray-900">{jobs.length}</span>
          </div>
          <div className="text-yellow-600">
            Pending: <span className="font-bold">{jobs.filter(j => j.status === 'pending').length}</span>
          </div>
          <div className="text-blue-600">
            Active: <span className="font-bold">{jobs.filter(j => j.status === 'in-progress' || j.status === 'assigned').length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job ID, user, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.userName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="text-gray-900">{job.pickupLocation}</div>
                        <div className="text-gray-500">→ {job.deliveryLocation}</div>
                        <div className="text-xs text-gray-400">{job.distance} km</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.truckOwnerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.driverName || <span className="text-gray-400">Not assigned</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.truckType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(job.requestedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${job.fare}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} type="job" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {(job.status === 'pending' || !job.driverId) && (
                        <button
                          onClick={() => setSelectedJob(job.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Assign Driver"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Assign Driver to Job {selectedJob}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {mockDrivers.filter(d => d.status === 'available').map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleAssignDriver(selectedJob, driver.id)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{driver.name}</div>
                      <div className="text-sm text-gray-600">{driver.truckOwnerName}</div>
                      <div className="text-xs text-gray-500">License: {driver.licenseNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-900">{driver.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500">{driver.completedJobs} jobs</div>
                    </div>
                  </div>
                ))}
                {mockDrivers.filter(d => d.status === 'available').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No available drivers at the moment
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
