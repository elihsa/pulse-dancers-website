import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, User, Phone, Car as CarIcon, Plus, Trash2 } from 'lucide-react';

export default function SavedGuests() {
  const { savedGuests, addSavedGuest, removeSavedGuest, setView } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ guest_name: '', phone_number: '', license_plate: '' });

  const handleAdd = () => {
    if (!newGuest.guest_name || !newGuest.phone_number || !newGuest.license_plate) return;
    addSavedGuest(newGuest);
    setNewGuest({ guest_name: '', phone_number: '', license_plate: '' });
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guest.guest_name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone_number}</span>
                    <span className="flex items-center gap-1"><CarIcon className="w-3 h-3" />{guest.license_plate}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => removeSavedGuest(guest.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {savedGuests.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl p-8 text-center card-shadow">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No saved guests yet</p>
          </div>
        )}

        {/* Add Guest Form */}
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add New Guest
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-5 card-shadow space-y-4">
            <h3 className="font-bold text-gray-900">New Guest</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={newGuest.guest_name}
                  onChange={e => setNewGuest(prev => ({ ...prev, guest_name: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Uncle Bheki"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={newGuest.phone_number}
                  onChange={e => setNewGuest(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+27 72 123 4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <div className="relative">
                <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={newGuest.license_plate}
                  onChange={e => setNewGuest(prev => ({ ...prev, license_plate: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="GP 123 456"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Save Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
