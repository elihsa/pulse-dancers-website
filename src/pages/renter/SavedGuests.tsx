import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, User, Phone, Car as CarIcon, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function SavedGuests() {
  const { savedGuests, addSavedGuest, removeSavedGuest, setView, updateSavedGuest } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ guest_name: '', phone_number: '', license_plate: '', access_code: '' });

  const handleEdit = (guest: any) => {
    setEditingId(guest.id);
    setFormData({
      guest_name: guest.guest_name,
      phone_number: guest.phone_number,
      license_plate: guest.license_plate,
      access_code: guest.access_code || ''
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.guest_name || !formData.phone_number || !formData.license_plate) return;
    
    if (editingId) {
      await updateSavedGuest(editingId, formData);
      setEditingId(null);
    } else {
      addSavedGuest(formData);
    }
    setFormData({ guest_name: '', phone_number: '', license_plate: '', access_code: '' });
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ guest_name: '', phone_number: '', license_plate: '', access_code: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setView('search')} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-900">Saved Guests</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">Manage your frequent visitors for quick booking</p>

        {/* Guest List */}
        <div className="space-y-3 mb-6">
          {savedGuests.map(guest => (
            <div key={guest.id} className="bg-white rounded-xl p-4 card-shadow flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{guest.guest_name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 truncate">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone_number}</span>
                    <span className="flex items-center gap-1"><CarIcon className="w-3 h-3" />{guest.license_plate}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(guest)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit guest">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => removeSavedGuest(guest.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete guest">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {savedGuests.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl p-8 text-center card-shadow">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No saved guests yet</p>
          </div>
        )}

        {/* Add/Edit Guest Form */}
        {!showForm ? (
          <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ guest_name: '', phone_number: '', license_plate: '', access_code: '' }); }} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add New Guest
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-5 card-shadow space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center justify-between">
              {editingId ? 'Edit Guest' : 'New Guest'}
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-lg transition" title="Close">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.guest_name}
                  onChange={e => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Uncle Bheki"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={e => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+27 72 123 4567"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate <span className="text-red-500">*</span></label>
              <div className="relative">
                <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.license_plate}
                  onChange={e => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="GP 123 456"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Access Code <span className="text-gray-400 text-sm">(Optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.access_code}
                  onChange={e => setFormData(prev => ({ ...prev, access_code: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 1234, ABCD, or gate code"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Optional: Enter the estate gate access code to share with your guest.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCancel} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                <Save className="w-4 h-4 inline mr-1" /> {editingId ? 'Update Guest' : 'Save Guest'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
