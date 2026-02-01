import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { mockPayments } from '../data/mockData';
import type { Payment } from '../types';
import StatusBadge from '../components/StatusBadge';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleResolveDispute = (paymentId: string) => {
    setPayments(payments.map((payment: Payment) =>
      payment.id === paymentId
        ? { ...payment, disputeStatus: 'resolved' as const }
        : payment
    ));
  };

  const handleMarkCompleted = (paymentId: string) => {
    setPayments(payments.map((payment: Payment) =>
      payment.id === paymentId
        ? { ...payment, status: 'completed' as const }
        : payment
    ));
  };

  const totalAmount = payments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const completedAmount = payments.filter((p: Payment) => p.status === 'completed').reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const pendingAmount = payments.filter((p: Payment) => p.status === 'pending').reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const disputedPaymentsCount = payments.filter((p: Payment) => p.disputeStatus === 'raised').length;

  const statCards = [
    {
      name: 'Total Payments',
      value: `$${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-50'
    },
    {
      name: 'Completed',
      value: `$${completedAmount.toLocaleString()}`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      iconColor: 'text-green-50',
      valueColor: 'text-green-600'
    },
    {
      name: 'Pending',
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-600',
      iconColor: 'text-yellow-50',
      valueColor: 'text-orange-600'
    },
    {
      name: 'Disputes',
      value: disputedPaymentsCount,
      icon: XCircle,
      gradient: 'from-red-500 to-pink-600',
      iconColor: 'text-red-50',
      valueColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-gray-600 mt-2">Track and manage all payments and disputes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className={`text-2xl font-bold ${card.valueColor || 'text-gray-900'}`}>{card.value}</p>
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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by payment ID, booking ID, or user..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispute</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.userName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} type="payment" />
                  </td>
                  <td className="px-6 py-4">
                    {payment.disputeStatus === 'raised' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Dispute Raised
                      </span>
                    )}
                    {payment.disputeStatus === 'resolved' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Resolved
                      </span>
                    )}
                    {payment.disputeStatus === 'none' && (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {payment.disputeStatus === 'raised' && (
                        <button
                          onClick={() => handleResolveDispute(payment.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Resolve Dispute"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleMarkCompleted(payment.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
