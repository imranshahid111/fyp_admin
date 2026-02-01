import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { mockSettings } from '../data/mockData';
import type { Settings as SettingsType } from '../types';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [newTruckType, setNewTruckType] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addTruckType = () => {
    if (newTruckType && !settings.truckTypes.includes(newTruckType)) {
      setSettings({
        ...settings,
        truckTypes: [...settings.truckTypes, newTruckType],
      });
      setNewTruckType('');
    }
  };

  const removeTruckType = (type: string) => {
    setSettings({
      ...settings,
      truckTypes: settings.truckTypes.filter(t => t !== type),
    });
  };

  const addJobCategory = () => {
    if (newJobCategory && !settings.jobCategories.includes(newJobCategory)) {
      setSettings({
        ...settings,
        jobCategories: [...settings.jobCategories, newJobCategory],
      });
      setNewJobCategory('');
    }
  };

  const removeJobCategory = (category: string) => {
    setSettings({
      ...settings,
      jobCategories: settings.jobCategories.filter(c => c !== category),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Truck Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Truck Types</h2>
        <p className="text-sm text-gray-600 mb-4">
          Manage the types of trucks available on the platform
        </p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTruckType}
            onChange={(e) => setNewTruckType(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTruckType()}
            placeholder="Add new truck type"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addTruckType}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {settings.truckTypes.map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
            >
              <span>{type}</span>
              <button
                onClick={() => removeTruckType(type)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Categories</h2>
        <p className="text-sm text-gray-600 mb-4">
          Define the categories of jobs available on the platform
        </p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newJobCategory}
            onChange={(e) => setNewJobCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addJobCategory()}
            placeholder="Add new job category"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addJobCategory}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {settings.jobCategories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg"
            >
              <span>{category}</span>
              <button
                onClick={() => removeJobCategory(category)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Fare Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.defaultFareMultiplier}
              onChange={(e) => setSettings({ ...settings, defaultFareMultiplier: Number(e.target.value) })}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Applied to base fare calculations</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={settings.platformCommission}
              onChange={(e) => setSettings({ ...settings, platformCommission: Number(e.target.value) })}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Commission percentage charged on each booking</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Support Contact Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Phone
            </label>
            <input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
