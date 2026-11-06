import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Plus, Calendar, MapPin, Star, Clock, CheckCircle, XCircle, AlertCircle, Key, BarChart2, ChevronDown, ChevronUp, DollarSign, CreditCard, Users, Settings, Download, Eye, LayoutDashboard, History, Trash2, LogOut, User, Menu, Bell, MessageSquare, Award } from 'lucide-react';
import ReviewDisplay from '../../components/ReviewDisplay';

export default function RenterDashboard() {
  const { user, setView, getRenterBookings, cancelBooking, logout, deleteAccount, fetchRenterBookings, getReviewsForListing, submitReview } = useApp();
  const bookings = getRenterBookings();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'pending' | 'reviews'>('upcoming');
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const reviewableBookings = completedBookings.filter(b => !b.has_review);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">My Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome back, {user?.full_name?.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('search')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1">
              <Plus className="w-4 h-4" /> Book Parking
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'upcoming'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'pending'}
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'pending'
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Pending ({pendingBookings.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'bg-white text-gray-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4 inline mr-1" />
              History ({completedBookings.length + cancelledBookings.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'reviews'}
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'reviews'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Reviews ({reviewableBookings.length})
            </button>
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Bookings</h2>
                  <p className="text-gray-500 mb-6">You don't have any confirmed or active bookings</p>
                  <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Book Your First Bay
                  </button>
                </div>
              ) : (
                upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-xl p-5 card-shadow border-l-4 border-blue-400">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            booking.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status === 'active' ? 'Active' : 'Confirmed'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                        <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • 🚗 {booking.guest_license_plate}</p>
                        {booking.access_code && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Key className="w-3 h-3 text-yellow-600" />
                            Access Code: <span className="font-mono font-bold">{booking.access_code}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCancelBookingId(booking.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'pending' && (
            <>
              {pendingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Pending Requests</h2>
                  <p className="text-gray-500 mb-6">You don't have any booking requests awaiting host approval</p>
                  <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Find Parking
                  </button>
                </div>
              ) : (
                pendingBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-xl p-5 card-shadow border-l-4 border-yellow-400">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                            Pending Host Approval
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                        <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • 🚗 {booking.guest_license_plate}</p>
                        <p className="text-xs text-gray-400 mt-1">Host will respond shortly. You'll be notified once approved.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCancelBookingId(booking.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {(completedBookings.length + cancelledBookings.length) === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Booking History</h2>
                  <p className="text-gray-500 mb-6">Your completed and cancelled bookings will appear here</p>
                  <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Start Booking
                  </button>
                </div>
              ) : (
                <>
                  {completedBookings.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Completed ({completedBookings.length})
                      </h2>
                      <div className="space-y-3">
                        {completedBookings.map(booking => (
                          <div key={booking.id} className="bg-white rounded-xl p-4 card-shadow border-l-4 border-green-400">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{booking.guest_name}</p>
                                <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                                <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • R{booking.total_amount}</p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Completed</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cancelledBookings.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Cancelled ({cancelledBookings.length})
                      </h2>
                      <div className="space-y-3">
                        {cancelledBookings.map(booking => (
                          <div key={booking.id} className="bg-white rounded-xl p-4 card-shadow border-l-4 border-red-400">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{booking.guest_name}</p>
                                <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                                <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • R{booking.total_amount}</p>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">Cancelled</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Write Reviews
                </h2>
                {reviewableBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No completed bookings to review yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your reviews help other renters and hosts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewableBookings.map(booking => (
                      <div key={booking.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{booking.guest_name}</p>
                            <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                            <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • R{booking.total_amount}</p>
                          </div>
                          <button
                            onClick={() => { setSelectedBookingForReview(booking); setShowReviewForm(true); }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" /> Write Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Received Reviews */}
              <div className="bg-white rounded-2xl p-5 card-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Reviews You Received
                </h2>
                <p className="text-sm text-gray-500 mb-4">As a renter, hosts can rate you too!</p>
                <ReviewDisplay
                  reviews={[]}
                  aggregate={null}
                  variant="dashboard"
                  onViewAll={() => {}}
                />
              </div>
            </div>
          )}
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
                Are you sure you want to delete your account? All your bookings, saved guests, and history will be permanently removed.
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
    </div>
  );
}