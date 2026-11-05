import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Calendar, Filter, Car, User, LogOut, Plus, LayoutDashboard, Users, Trash2, XCircle, Map, Navigation, Home, AlertCircle } from 'lucide-react';
import { mockEstates } from '../../data/mockData';
import MapView from '../../components/MapView';

export default function SearchPage() {
  const { user, searchFilters, updateSearchFilters, performSearch, setView, logout, deleteAccount, cancelBooking, bookings } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 });
  const [mapZoom, setMapZoom] = useState(10);

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Map integration placeholder
  };

  const selectEstateFromMap = (estateName: string) => {
    updateSearchFilters({ estate: estateName });
    setShowMapSelector(false);
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ParkBuddy<span className="text-blue-600">SA</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('saved-guests')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Saved Guests">
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => setView('host-dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Host Dashboard">
              <LayoutDashboard className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition">
                <User className="w-4 h-4 text-blue-600" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                  <button onClick={() => { setShowDeleteModal(true); setShowUserMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hi {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Find parking for your visitors in any estate</p>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming Bookings</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {activeBookings.map(booking => (
                <div key={booking.id} className="min-w-[280px] bg-white rounded-xl p-4 card-shadow border-l-4 border-blue-500">
                  <p className="font-medium text-gray-900">{booking.guest_name}</p>
                  <p className="text-sm text-gray-500">{booking.estate_name}</p>
                  <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date}</p>
                  <p className="text-xs text-gray-400 mt-1">🚗 {booking.guest_license_plate}</p>
                  <button
                    onClick={() => setCancelBookingId(booking.id)}
                    className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" /> Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Parking
            </h2>
            <button
              onClick={() => setShowMapSelector(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center gap-1"
            >
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estate Name</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchFilters.estate}
                  onChange={e => updateSearchFilters({ estate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. Midrand Estate"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={searchFilters.city}
                  onChange={e => updateSearchFilters({ city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                >
                  <option value="">All Cities</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Durban">Durban</option>
                  <option value="Sandton">Sandton</option>
                  <option value="Stellenbosch">Stellenbosch</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={searchFilters.start_date}
                  onChange={e => updateSearchFilters({ start_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={searchFilters.end_date}
                  onChange={e => updateSearchFilters({ end_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={searchFilters.booking_type}
                  onChange={e => updateSearchFilters({ booking_type: e.target.value as any })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="instant">⚡ Instant Book</option>
                  <option value="request">📋 Request</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={performSearch}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Available Bays
          </button>
        </div>

        {/* Quick Estates */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Popular Estates</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockEstates.slice(0, 8).map(estate => (
              <button
                key={estate.id}
                onClick={() => { updateSearchFilters({ estate: estate.name }); performSearch(); }}
                className="bg-white rounded-xl p-4 card-shadow text-left hover:ring-2 hover:ring-blue-500 transition"
              >
                <p className="font-medium text-gray-900 text-sm">{estate.name}</p>
                <p className="text-xs text-gray-500">{estate.city}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your account? All your listings, bookings, and saved guests will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteAccount(); setShowDeleteModal(false); }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Selector Modal */}
      {showMapSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Select Estate from Map</h3>
                  <p className="text-sm text-gray-500">Click on an estate to search for parking bays</p>
                </div>
              </div>
              <button onClick={() => setShowMapSelector(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '400px' }}>
              <MapView
                center={mapCenter}
                zoom={mapZoom}
                height="400px"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500 text-center">Popular estates near the map center:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {mockEstates.slice(0, 10).map(estate => (
                  <button
                    key={estate.id}
                    onClick={() => selectEstateFromMap(estate.name)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    {estate.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Cancel Booking</h3>
                <p className="text-sm text-gray-500">Are you sure?</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will cancel the booking and the guest will no longer have access to the parking bay. A refund will be processed to your original payment method.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelBookingId(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => { cancelBooking(cancelBookingId); setCancelBookingId(null); }}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}