import { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Trash2, Loader2, Package } from 'lucide-react';
import { apiService } from '../services/api';

interface TruckCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  max_weight_kg?: number;
  created_at?: string;
}

export default function TruckCategories() {
  const [categories, setCategories] = useState<TruckCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<TruckCategory>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', max_weight_kg: '', icon: '' });
  const [saving, setSaving] = useState(false);

  const availableIcons = [
    { id: 'pickup', name: 'Pickup', path: '/icons/pickup.png' },
    { id: 'shehzore', name: 'Shehzore', path: '/icons/shehzore.png' },
    { id: 'mazda', name: 'Mazda', path: '/icons/mazda.png' },
    { id: 'mini_mazda', name: 'Mini Mazda', path: '/icons/mini_mazda.png' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCategories();
      const data = res?.data?.data ?? res?.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveEdit = async () => {
    if (editingId == null) return;
    setSaving(true);
    try {
      await apiService.updateCategory(String(editingId), {
        name: editForm.name,
        description: editForm.description,
        icon: editForm.icon,
        max_weight_kg: editForm.max_weight_kg ? Number(editForm.max_weight_kg) : undefined,
      });
      setCategories(categories.map((c) => (c.id === editingId ? { ...c, ...editForm } : c)));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newCat.name.trim()) return;
    setSaving(true);
    try {
      const res = await apiService.createCategory({
        name: newCat.name.trim(),
        description: newCat.description.trim() || undefined,
        icon: newCat.icon || undefined,
        max_weight_kg: newCat.max_weight_kg ? Number(newCat.max_weight_kg) : undefined,
      });
      const created = res?.data?.data ?? res?.data;
      if (created) setCategories([created, ...categories]);
      setShowAdd(false);
      setNewCat({ name: '', description: '', max_weight_kg: '', icon: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this truck category?')) return;
    try {
      await apiService.deleteCategory(String(id));
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Truck Categories
          </h1>
          <p className="text-gray-600 mt-2">Manage truck types (e.g. Shehzore, Mazda). Owners select these when adding trucks.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Max Weight</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={editForm.icon ?? cat.icon ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="px-2 py-1 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">No Icon</option>
                          {availableIcons.map(icon => (
                            <option key={icon.id} value={icon.id}>{icon.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {cat.icon ? (
                            <img src={`/icons/${cat.icon}.png`} alt={cat.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          value={editForm.name ?? cat.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full max-w-[180px] px-3 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          value={editForm.description ?? cat.description ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full max-w-[240px] px-3 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Description"
                        />
                      ) : (
                        <span className="text-gray-600">{cat.description || '—'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.max_weight_kg ?? cat.max_weight_kg ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, max_weight_kg: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-24 px-3 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <span className="text-gray-600">{cat.max_weight_kg != null ? `${cat.max_weight_kg} kg` : '—'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={handleSaveEdit} disabled={saving} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Save className="w-5 h-5" />
                          </button>
                          <button type="button" onClick={() => { setEditingId(null); setEditForm({}); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => { setEditingId(cat.id); setEditForm(cat); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button type="button" onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No truck categories yet. Add one so owners can select a category when adding trucks.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Truck Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex gap-4">
                  {availableIcons.map(icon => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setNewCat({ ...newCat, icon: icon.id })}
                      className={`flex-1 p-2 border-2 rounded-xl flex flex-col items-center gap-1 transition-all ${newCat.icon === icon.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <img src={icon.path} alt={icon.name} className="w-10 h-10 object-contain" />
                      <span className="text-[10px] font-semibold">{icon.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Shehzore, Mazda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max weight (kg)</label>
                <input
                  type="number"
                  value={newCat.max_weight_kg}
                  onChange={(e) => setNewCat({ ...newCat, max_weight_kg: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 3500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowAdd(false); setNewCat({ name: '', description: '', max_weight_kg: '', icon: '' }); }}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving || !newCat.name.trim()}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
