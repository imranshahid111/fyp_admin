import { useState } from 'react';
import { Send, Plus, Eye, Trash2 } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import type { Notification } from '../types';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    message: '',
    recipient: 'all',
    status: 'draft',
  });

  const handleCreate = () => {
    if (newNotification.title && newNotification.message) {
      const notification: Notification = {
        id: `N${String(notifications.length + 1).padStart(3, '0')}`,
        title: newNotification.title,
        message: newNotification.message,
        recipient: newNotification.recipient as Notification['recipient'],
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft',
      };
      
      setNotifications([notification, ...notifications]);
      setNewNotification({
        title: '',
        message: '',
        recipient: 'all',
        status: 'draft',
      });
      setShowCreateModal(false);
    }
  };

  const handleSend = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, status: 'sent' as const } : notif
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getRecipientBadge = (recipient: Notification['recipient']) => {
    const styles = {
      all: 'bg-purple-100 text-purple-800',
      users: 'bg-blue-100 text-blue-800',
      'truck-owners': 'bg-green-100 text-green-800',
      drivers: 'bg-orange-100 text-orange-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[recipient]}`}>
        {recipient === 'all' ? 'All Users' : recipient === 'truck-owners' ? 'Truck Owners' : recipient.charAt(0).toUpperCase() + recipient.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Send notifications to users, truck owners, and drivers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Notification
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                  {getRecipientBadge(notification.recipient)}
                  {notification.status === 'sent' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(notification.createdDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {notification.status === 'draft' && (
                  <button
                    onClick={() => handleSend(notification.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                )}
                <button
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {notification.status === 'draft' && (
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No notifications yet. Create your first notification to get started.</p>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create New Notification</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Enter notification title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <select
                  value={newNotification.recipient}
                  onChange={(e) => setNewNotification({ ...newNotification, recipient: e.target.value as Notification['recipient'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="users">Users</option>
                  <option value="truck-owners">Truck Owners</option>
                  <option value="drivers">Drivers</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNotification({
                    title: '',
                    message: '',
                    recipient: 'all',
                    status: 'draft',
                  });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newNotification.title || !newNotification.message}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
