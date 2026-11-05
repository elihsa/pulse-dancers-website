import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, User, Phone, Car as CarIcon, Plus, CreditCard, Shield, Zap, Calendar, MapPin, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

export default function Checkout() {
  const { selectedListing, savedGuests, searchFilters, createBooking, setView, addSavedGuest, user } = useApp();
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({ guest_name: '', phone_number: '', license_plate: '', access_code: '' });
  const [processing, setProcessing] = useState(false);

  // Auto-select the first guest if none selected, or the newly added guest
  useEffect(() => {
    if (savedGuests.length > 0 && !selectedGuestId) {
      setSelectedGuestId(savedGuests[0].id);
    }
  }, [savedGuests, selectedGuestId]);

  // Auto-select newly created guest
  useEffect(() => {
    if (showAddGuest === false && newGuest.guest_name === '' && savedGuests.length > 0) {
      // Check if the last guest was just added (by checking if it matches our newGuest data before reset)
      // This is handled by the addSavedGuest function setting the ID
    }
  }, [savedGuests]);

  if (!selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No listing selected</p>
          <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  const startDate = searchFilters.start_date || '2026-02-01';
  const endDate = searchFilters.end_date || '2026-02-03';
  const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const totalAmount = selectedListing.price_per_day * days;
  const platformFee = Math.round(totalAmount * 0.15);
  const hostPayout = totalAmount - platformFee;

  const handleAddGuest = () => {
    if (!newGuest.guest_name || !newGuest.phone_number || !newGuest.license_plate) return;
    const newGuestId = addSavedGuest(newGuest);
    // Auto-select the newly created guest
    setSelectedGuestId(newGuestId);
    setShowAddGuest(false);
    setNewGuest({ guest_name: '', phone_number: '', license_plate: '', access_code: '' });
  };

  const handlePayment = () => {
    if (!selectedGuestId) return;
    setProcessing(true);
    
    // Simulate Paystack payment processing
    setTimeout(() => {
      const guest = savedGuests.find(g => g.id === selectedGuestId);
      if (!guest) return;

      createBooking({
        listing_id: selectedListing.id,
        renter_id: user?.id || 'r1',
        guest_id: guest.id,
        guest_name: guest.guest_name,
        guest_phone: guest.phone_number,
        guest_license_plate: guest.license_plate,
        access_code: guest.access_code || '',
        estate_name: selectedListing.estate_name,
        cluster_or_street: selectedListing.cluster_or_street,
        bay_number: selectedListing.bay_number,
        start_date: startDate,
        end_date: endDate,
        total_amount: totalAmount,
        platform_fee: platformFee,
        host_payout: hostPayout,
        status: selectedListing.booking_type === 'instant' ? 'confirmed' : 'pending'
      });
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setView('results')} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left - Booking Details */}
          <div className="md:col-span-2 space-y-4">
            {/* Listing Summary */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <h2 className="font-bold text-gray-900 mb-3">Booking Summary</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedListing.estate_name}</p>
                  <p className="text-sm text-gray-500">{selectedListing.cluster_or_street} • {selectedListing.bay_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {startDate} → {endDate}</span>
                <span>{days} day{days > 1 ? 's' : ''}</span>
                {selectedListing.booking_type === 'instant' && (
                  <span className="flex items-center gap-1 text-green-600"><Zap className="w-4 h-4" /> Instant Book</span>
                )}
              </div>
            </div>

            {/* Select Guest */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <h2 className="font-bold text-gray-900 mb-3">Select Visitor</h2>
              
              {savedGuests.length > 0 && (
                <div className="space-y-2 mb-4">
                  {savedGuests.map(guest => (
                    <label key={guest.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${selectedGuestId === guest.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="radio"
                        name="guest"
                        value={guest.id}
                        checked={selectedGuestId === guest.id}
                        onChange={() => setSelectedGuestId(guest.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{guest.guest_name}</p>
                        <p className="text-xs text-gray-500">{guest.phone_number} • 🚗 {guest.license_plate}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!showAddGuest ? (
                <button onClick={() => setShowAddGuest(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Guest
                </button>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      Guest Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newGuest.guest_name}
                        onChange={e => setNewGuest(prev => ({ ...prev, guest_name: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="e.g. Uncle Bheki"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={newGuest.phone_number}
                        onChange={e => setNewGuest(prev => ({ ...prev, phone_number: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="+27 72 123 4567"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      License Plate <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newGuest.license_plate}
                        onChange={e => setNewGuest(prev => ({ ...prev, license_plate: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="GP 123 456"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      Access Code <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newGuest.access_code}
                        onChange={e => setNewGuest(prev => ({ ...prev, access_code: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="e.g. 1234, ABCD, or gate code"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Optional: Enter the estate gate access code if you already have it from the estate app. This will be shared with your guest.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddGuest(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleAddGuest} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Save Guest
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-5 card-shadow">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment
              </h2>
              <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Secured by Paystack</p>
                  <p className="text-xs text-blue-600">Funds held in escrow until booking is completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Price Breakdown */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-5 card-shadow sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Price Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">R{selectedListing.price_per_day} × {days} day{days > 1 ? 's' : ''}</span>
                  <span className="text-gray-900">R{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform fee (15%)</span>
                  <span className="text-gray-900">R{platformFee}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">R{totalAmount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedGuestId || processing}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay R{totalAmount}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-2">
                {selectedListing.booking_type === 'instant' ? '⚡ Instant confirmation' : '📋 Awaiting host approval'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
