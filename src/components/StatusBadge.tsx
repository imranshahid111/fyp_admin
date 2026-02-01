interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'job' | 'payment' | 'approval';
}

export default function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const getStatusColor = () => {
    const normalizedStatus = status.toLowerCase();
    
    if (type === 'approval') {
      switch (normalizedStatus) {
        case 'approved':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'rejected':
          return 'bg-red-100 text-red-800';
        case 'inactive':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    if (type === 'job') {
      switch (normalizedStatus) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'in-progress':
          return 'bg-blue-100 text-blue-800';
        case 'assigned':
          return 'bg-purple-100 text-purple-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    if (type === 'payment') {
      switch (normalizedStatus) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        case 'refunded':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Default type
    switch (normalizedStatus) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on-job':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
}
