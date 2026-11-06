import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Plus, Calendar, TrendingUp, MapPin, Star, Clock, CheckCircle, XCircle, AlertCircle, Key, BarChart2, ChevronDown, ChevronUp, DollarSign, CreditCard, Users, Settings, Download, Eye, MessageSquare, Award, List } from 'lucide-react';
import ReviewDisplay from '../../components/ReviewDisplay';

export default function HostDashboard() {
  const { user, setView, getHostListings, getHostBookings, getHostEarnings, fetchHostEarningsHistory, updateBookingStatus, updateBookingAccessCode, cancelBooking, getReviewsForListing, submitReviewResponse } = useApp();
  const listings = getHostListings();
  const bookings = getHostBookings();
  const earnings = getHostEarnings();
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed');
  const [accessCodeModal, setAccessCodeModal] = useState<{ bookingId: string; action: 'accept' | 'edit' } | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [earningsHistory, setEarningsHistory] = useState<{ monthly: any[]; weekly: any[]; byListing: any[] } | null>(null);
  const [earningsTab, setEarningsTab] = useState<'overview' | 'history' | 'listings'>('overview');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'earnings' | 'bookings' | 'listings' | 'reviews'>('earnings');
  const [selectedListingForReviews, setSelectedListingForReviews] = useState<any>(null);
  const [listingReviews, setListingReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const loadEarningsHistory = async () => {
    setIsLoadingHistory(true);
    const history = await fetchHostEarningsHistory();
    setEarningsHistory(history);
    setIsLoadingHistory(false);
  };

  const loadListingReviews = async (listingId: string) => {
    setIsLoadingReviews(true);
    const reviews = await getReviewsForListing(listingId);
    setListingReviews(reviews);
    setIsLoadingReviews(false);
  };

  const handleAcceptWithCode = () => {
    if (!accessCodeModal) return;
    updateBookingStatus(accessCodeModal.bookingId, 'confirmed', accessCodeInput || undefined);
    setAccessCodeModal(null);
    setAccessCodeInput('');
  };

  const handleSaveAccessCode = () => {
    if (!accessCodeModal) return;
    updateBookingAccessCode(accessCodeModal.bookingId, accessCodeInput);
    setAccessCodeModal(null);
    setAccessCodeInput('');
  };

  const formatCurrency = (amount: number) => `R${amount.toLocaleString()}`;

  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
  };

  const getWeekLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekNum = Math.ceil(date.getDate() / 7);
    return `Week ${weekNum} ${date.toLocaleDateString('en-ZA', { month: 'short' })}`;
  };

  const handleReviewResponse = async (reviewId: string, response: string) => {
    await submitReviewResponse(reviewId, response);
    if (selectedListingForReviews) {
      loadListingReviews(selectedListingForReviews.id);
    }
  };

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
              <h1 className="font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-xs text-gray-500">Welcome, {user?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('search')} className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition">
              Switch to Renter
            </button>
            <button onClick={() => setView('create-listing')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Listing
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b bg-white sticky top-16 z-40">
        <nav className="flex gap-1 bg-gray-100 rounded-xl p-1" role="tablist">
          {[
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'listings', label: 'Listings', icon: MapPin },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: listingReviews.filter(r => !r.host_response).length > 0 && !isLoadingReviews ? listingReviews.filter(r => !r.host_response).length : null },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'earnings' && !earningsHistory) loadEarningsHistory();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <>
            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">R</span>
                  </div>
                  <span className="text-sm text-gray-500">Total Earnings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.total)}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-500">Pending Payout</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.pending)}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Released</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.released)}</p>
              </div>
            </div>

            {/* Earnings History Tabs */}
            <div className="mb-8">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6" role="tablist">
                <button
                  role="tab"
                  aria-selected={earningsTab === 'overview'}
                  onClick={() => setEarningsTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    earningsTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  role="tab"
                  aria-selected={earningsTab === 'history'}
                  onClick={() => {
                    setEarningsTab('history');
                    if (!earningsHistory) loadEarningsHistory();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    earningsTab === 'history'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 inline mr-1" /> History
                </button>
                <button
                  role="tab"
                  aria-selected={earningsTab === 'listings'}
                  onClick={() => {
                    setEarningsTab('listings');
                    if (!earningsHistory) loadEarningsHistory();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    earningsTab === 'listings'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-1" /> By Listing
                </button>
              </div>

              {earningsTab === 'history' && (
                <div className="bg-white rounded-2xl p-6 card-shadow">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                    Earnings History
                  </h3>
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : earningsHistory && earningsHistory.monthly.length > 0 ? (
                    <div className="space-y-6">
                      {/* Monthly Earnings */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Monthly Breakdown</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="pb-2 font-medium text-gray-500">Month</th>
                                <th className="pb-2 font-medium text-gray-500 text-right">Bookings</th>
                                <th className="pb-2 font-medium text-gray-500 text-right">Completed</th>
                                <th className="pb-2 font-medium text-gray-500 text-right">Earnings</th>
                                <th className="pb-2 font-medium text-gray-500 text-right">Pending</th>
                              </tr>
                            </thead>
                            <tbody>
                              {earningsHistory.monthly.map((month: any, idx: number) => (
                                <tr key={month.period} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                  <td className="py-3">{getMonthName(month.period)}</td>
                                  <td className="py-3 text-right">{month.total_bookings}</td>
                                  <td className="py-3 text-right text-green-600">{month.completed_bookings}</td>
                                  <td className="py-3 text-right font-medium">{formatCurrency(parseFloat(month.earnings))}</td>
                                  <td className="py-3 text-right text-yellow-600">{formatCurrency(parseFloat(month.pending))}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Weekly Earnings (Current Month) */}
                      {earningsHistory.weekly.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-3">This Month (Weekly)</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {earningsHistory.weekly.map((week: any) => (
                              <div key={week.period} className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">{getWeekLabel(week.period)}</p>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(parseFloat(week.earnings))}</p>
                                <p className="text-xs text-gray-500">{week.completed_bookings} of {week.total_bookings} completed</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No earnings history available yet</p>
                  )}
                </div>
              )}

              {earningsTab === 'listings' && earningsHistory && (
                <div className="bg-white rounded-2xl p-6 card-shadow">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Earnings by Listing
                  </h3>
                  {earningsHistory.byListing.length > 0 ? (
                    <div className="space-y-4">
                      {earningsHistory.byListing.map((listing: any) => (
                        <div key={listing.id} className="bg-gray-50 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">{listing.estate_name}</h4>
                              <p className="text-sm text-gray-500">{listing.cluster_or_street} • {listing.bay_number}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">{formatCurrency(parseFloat(listing.total_earnings))}</p>
                              <p className="text-xs text-gray-500">{listing.completed_bookings} completed / {listing.total_bookings} total</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-md ${listing.booking_type === 'instant' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {listing.booking_type === 'instant' ? '⚡ Instant Book' : '📋 Request'}
                            </span>
                            <span>R{listing.price_per_day}/day</span>
                            {parseFloat(listing.pending_earnings) > 0 && (
                              <span className="text-yellow-600 font-medium">Pending: {formatCurrency(parseFloat(listing.pending_earnings))}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No listing earnings data available</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <>
            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Pending Requests ({pendingBookings.length})
                </h2>
                <div className="space-y-3">
                  {pendingBookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-xl p-4 card-shadow border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                          <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • R{booking.total_amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setAccessCodeModal({ bookingId: booking.id, action: 'accept' }); setAccessCodeInput(''); }}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" /> Accept
                          </button>
                          <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Bookings */}
            {activeBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Active Bookings ({activeBookings.length})
                </h2>
                <div className="space-y-3">
                  {activeBookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-xl p-4 card-shadow border-l-4 border-blue-400">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{booking.guest_name}</p>
                            {booking.access_code && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-mono font-bold flex items-center gap-1">
                                <Key className="w-3 h-3" /> {booking.access_code}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                          <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • 🚗 {booking.guest_license_plate}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setAccessCodeModal({ bookingId: booking.id, action: 'edit' }); setAccessCodeInput(booking.access_code || ''); }}
                            className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 flex items-center gap-1"
                          >
                            <Key className="w-4 h-4" /> {booking.access_code ? 'Edit Code' : 'Add Code'}
                          </button>
                          <button onClick={() => updateBookingStatus(booking.id, 'completed')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
                            Complete
                          </button>
                          <button
                            onClick={() => setCancelBookingId(booking.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-gray-500" />
                All Bookings
              </h2>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(booking => (
                  <div key={booking.id} className="bg-white rounded-xl p-4 card-shadow border-l-4 border-gray-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{booking.guest_name}</p>
                        <p className="text-sm text-gray-500">{booking.estate_name} • {booking.cluster_or_street} • {booking.bay_number}</p>
                        <p className="text-sm text-gray-500">{booking.start_date} → {booking.end_date} • R{booking.total_amount}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length === 0) && (
                  <p className="text-gray-500 text-center py-8">No past bookings yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                My Listings ({listings.length})
              </h2>
              <button onClick={() => setView('create-listing')} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
            
            {listings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't listed any bays yet</p>
                <button onClick={() => setView('create-listing')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl p-5 card-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${listing.booking_type === 'instant' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {listing.booking_type === 'instant' ? '⚡ Instant Book' : '📋 Request'}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${listing.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{listing.estate_name}</h3>
                    <p className="text-sm text-gray-500">{listing.cluster_or_street} • {listing.bay_number}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <p className="text-lg font-bold text-blue-600">R{listing.price_per_day}<span className="text-sm text-gray-400 font-normal">/day</span></p>
                      {listing.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {listing.rating} ({listing.review_count})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Reviews ({listingReviews.length})
            </h2>

            {listings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No listings yet — reviews will appear here once you have bookings</p>
                <button onClick={() => setView('create-listing')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl p-5 card-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{listing.estate_name}</h3>
                        <p className="text-sm text-gray-500">{listing.cluster_or_street} • {listing.bay_number}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {listing.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-900">{listing.rating}</span>
                            <span className="text-gray-500">({listing.review_count} reviews)</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setSelectedListingForReviews(listing);
                            loadListingReviews(listing.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                            selectedListingForReviews?.id === listing.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          View Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Listing Reviews Detail */}
            {selectedListingForReviews && (
              <div className="mt-8 bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedListingForReviews.estate_name}</h3>
                    <p className="text-sm text-gray-500">{selectedListingForReviews.cluster_or_street} • {selectedListingForReviews.bay_number}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedListingForReviews(null); setListingReviews([]); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {isLoadingReviews ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                ) : listingReviews.length > 0 ? (
                  <div className="space-y-4">
                    {listingReviews.map(review => (
                      <ReviewDisplay
                        key={review.id}
                        reviews={[review]}
                        variant="dashboard"
                        onViewAll={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews for this listing yet</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Access Code Modal */}
      {accessCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {accessCodeModal.action === 'accept' ? 'Accept Booking' : 'Access Code'}
                </h3>
                <p className="text-sm text-gray-500">
                  {accessCodeModal.action === 'accept'
                    ? 'Enter the gate/access code from your estate app (optional)'
                    : 'Enter or update the access code for this booking'}
                </p>
              </div>
            </div>
            
            <input
              type="text"
              value={accessCodeInput}
              onChange={e => setAccessCodeInput(e.target.value)}
              placeholder="e.g. 1234, ABCD, or leave empty"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none font-mono text-lg text-center mb-4"
              autoFocus
            />

            <p className="text-xs text-gray-400 mb-4">
              💡 This code will be shared with the renter and shown on their booking confirmation.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { setAccessCodeModal(null); setAccessCodeInput(''); }}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={accessCodeModal.action === 'accept' ? handleAcceptWithCode : handleSaveAccessCode}
                className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition"
              >
                {accessCodeModal.action === 'accept' ? 'Accept Booking' : 'Save Code'}
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
              This will cancel the booking and the guest will no longer have access to the parking bay. A refund will be processed to the renter.
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