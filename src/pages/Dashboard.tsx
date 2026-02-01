import { 
  Users, 
  Truck, 
  UserCog, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { mockDashboardStats, mockJobs } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const stats = mockDashboardStats;
  const recentJobs = mockJobs.slice(0, 5);

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-600',
      change: '+12%',
      trend: 'up',
      iconColor: 'text-blue-50'
    },
    { 
      name: 'Truck Owners', 
      value: stats.totalTruckOwners, 
      icon: Truck, 
      gradient: 'from-purple-500 to-pink-600',
      change: '+8%',
      trend: 'up',
      iconColor: 'text-purple-50'
    },
    { 
      name: 'Drivers', 
      value: stats.totalDrivers, 
      icon: UserCog, 
      gradient: 'from-green-500 to-emerald-600',
      change: '+15%',
      trend: 'up',
      iconColor: 'text-green-50'
    },
    { 
      name: 'Total Jobs', 
      value: stats.totalJobs, 
      icon: Briefcase, 
      gradient: 'from-orange-500 to-red-600',
      change: '+23%',
      trend: 'up',
      iconColor: 'text-orange-50'
    },
    { 
      name: 'Active Jobs', 
      value: stats.activeJobs, 
      icon: Clock, 
      gradient: 'from-yellow-500 to-orange-600',
      change: '+5%',
      trend: 'up',
      iconColor: 'text-yellow-50'
    },
    { 
      name: 'Completed Jobs', 
      value: stats.completedJobs, 
      icon: CheckCircle, 
      gradient: 'from-teal-500 to-cyan-600',
      change: '+18%',
      trend: 'up',
      iconColor: 'text-teal-50'
    },
    { 
      name: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      gradient: 'from-indigo-500 to-purple-600',
      change: '+32%',
      trend: 'up',
      iconColor: 'text-indigo-50'
    },
    { 
      name: 'Pending Payments', 
      value: `$${stats.pendingPayments.toLocaleString()}`, 
      icon: TrendingUp, 
      gradient: 'from-red-500 to-pink-600',
      change: '-5%',
      trend: 'down',
      iconColor: 'text-red-50'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
              <p className="text-sm text-gray-600 mt-1">Latest job requests and their status</p>
            </div>
            <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Truck Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fare</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>{job.pickupLocation}</span>
                      <span className="text-gray-400">→</span>
                      <span>{job.deliveryLocation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                      {job.truckType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${job.fare}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} type="job" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              This Month
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Revenue Growth</p>
          <p className="text-3xl font-bold">+32.5%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Today
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Jobs Completed</p>
          <p className="text-3xl font-bold">{stats.completedJobs}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Active
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Platform Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers + stats.totalTruckOwners + stats.totalDrivers}</p>
        </div>
      </div>
    </div>
  );
}
