import { useState } from 'react';
import { Edit2, Save, X, Calculator, ShieldCheck } from 'lucide-react';
import { mockFareStructures } from '../data/mockData';
import type { FareStructure } from '../types';

export default function Fares() {
  const [fares, setFares] = useState<FareStructure[]>(mockFareStructures);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FareStructure>>({});

  const handleEdit = (fare: FareStructure) => {
    setEditingId(fare.id);
    setEditForm(fare);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      setFares(fares.map((fare: FareStructure) =>
        fare.id === editingId ? { ...fare, ...editForm } as FareStructure : fare
      ));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const updateEditForm = (field: keyof FareStructure, value: string | number) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Fare Management
          </h1>
          <p className="text-gray-600 mt-2">Configure fare structures for different truck types</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="bg-blue-500 rounded-xl p-2 mt-1 shadow-md">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-blue-900 font-semibold mb-1">Pricing Integrity</p>
          <p className="text-blue-700 text-sm leading-relaxed">
            Fare changes will apply to new bookings. Existing bookings will maintain their original fare to ensure transparency and trust.
          </p>
        </div>
      </div>

      {/* Fare Structures */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per KM Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fares.map((fare) => {
                const isEditing = editingId === fare.id;

                return (
                  <tr key={fare.id} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {fare.truckType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.basePrice ?? fare.basePrice}
                          onChange={(e) => updateEditForm('basePrice', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        `$${fare.basePrice}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.perKmRate ?? fare.perKmRate}
                          onChange={(e) => updateEditForm('perKmRate', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        `$${fare.perKmRate}/km`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.minFare ?? fare.minFare}
                          onChange={(e) => updateEditForm('minFare', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        `$${fare.minFare}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.maxFare ?? fare.maxFare}
                          onChange={(e) => updateEditForm('maxFare', Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        `$${fare.maxFare}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(fare)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fare Calculation Example */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fare Calculation Formula</h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <p className="text-gray-700">Total Fare = Base Price + (Distance in KM × Per KM Rate)</p>
          <p className="text-gray-500 mt-2">Subject to Min and Max Fare constraints</p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Example:</strong> Box Truck traveling 200 km
          </p>
          <p className="text-sm text-gray-600">
            Base Price: $150 + (200 km × $3.5/km) = $850
          </p>
          <p className="text-sm text-gray-600">
            This falls within the Min ($300) and Max ($1500) range, so the fare is $850.
          </p>
        </div>
      </div>
    </div>
  );
}
