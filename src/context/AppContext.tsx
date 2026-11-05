import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Listing, SavedGuest, Booking, SearchFilters } from '../types';
import { authAPI, listingsAPI, bookingsAPI, paymentsAPI, tokenManager } from '../services/api';

interface AppState {
  user: User | null;
  listings: Listing[];
  savedGuests: SavedGuest[];
  bookings: Booking[];
  searchFilters: SearchFilters;
  searchResults: Listing[];
  isAuthenticated: boolean;
  currentView: 'landing' | 'login' | 'host-dashboard' | 'create-listing' | 'manage-bookings' | 'search' | 'renter-dashboard' | 'results' | 'checkout' | 'success' | 'saved-guests' | 'forgot-password' | 'reset-password';
  selectedListing: Listing | null;
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; phone: string; password: string; full_name: string; role: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Navigation
  setView: (view: AppState['currentView']) => void;
  
  // Search
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  performSearch: () => Promise<void>;
  
  // Selection
  selectListing: (listing: Listing | null) => void;
  selectBooking: (booking: Booking | null) => void;
  
  // Saved Guests (local only for now)
  addSavedGuest: (guest: Omit<SavedGuest, 'id' | 'renter_id'>) => Promise<void>;
  removeSavedGuest: (id: string) => Promise<void>;
  
  // Bookings
  createBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status'], accessCode?: string) => Promise<void>;
  updateBookingAccessCode: (bookingId: string, accessCode: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  
  // Listings
  addListing: (listing: Omit<Listing, 'id' | 'host_id' | 'host_name' | 'rating' | 'review_count'>) => Promise<void>;
  
  // Account
  deleteAccount: () => Promise<void>;
  
  // Async fetch functions (load from API)
  fetchListings: () => Promise<void>;
  fetchSavedGuests: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchHostListings: () => Promise<Listing[]>;
  fetchHostBookings: () => Promise<Booking[]>;
  fetchHostEarnings: () => Promise<{ total: number; pending: number; released: number }>;
  fetchHostEarningsHistory: () => Promise<{ monthly: any[]; weekly: any[]; byListing: any[] }>;
  fetchRenterBookings: () => Promise<void>;
  
  // Synchronous getters (work with local state - for components like HostDashboard)
  getHostListings: () => Listing[];
  getHostBookings: () => Booking[];
  getHostEarnings: () => { total: number; pending: number; released: number };
  getRenterBookings: () => Booking[];
  
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to convert snake_case API response to camelCase frontend types
const convertListing = (apiListing: any): Listing => ({
  id: apiListing.id,
  host_id: apiListing.host_id,
  host_name: apiListing.host?.full_name || apiListing.host_name || 'Host',
  estate_id: apiListing.estate_id,
  estate_name: apiListing.estate?.name || apiListing.estate_name || '',
  cluster_or_street: apiListing.cluster_or_street,
  bay_number: apiListing.bay_number,
  price_per_day: Number(apiListing.price_per_day),
  booking_type: apiListing.booking_type,
  is_active: apiListing.is_active,
  walk_time_minutes: apiListing.walk_time_minutes || 5,
  rating: Number(apiListing.rating) || 0,
  review_count: apiListing.review_count || 0,
  notes: apiListing.notes,
  map_marker: apiListing.map_marker_lat && apiListing.map_marker_lng ? {
    lat: Number(apiListing.map_marker_lat),
    lng: Number(apiListing.map_marker_lng)
  } : undefined,
  directions: apiListing.directions,
});

const convertBooking = (apiBooking: any): Booking => ({
  id: apiBooking.id,
  listing_id: apiBooking.listing_id,
  renter_id: apiBooking.renter_id,
  guest_id: apiBooking.guest_id || '',
  guest_name: apiBooking.guest_name,
  guest_phone: apiBooking.guest_phone,
  guest_license_plate: apiBooking.guest_license_plate,
  estate_name: apiBooking.estate_name,
  cluster_or_street: apiBooking.cluster_or_street,
  bay_number: apiBooking.bay_number,
  start_date: apiBooking.start_date,
  end_date: apiBooking.end_date,
  total_amount: Number(apiBooking.total_amount),
  platform_fee: Number(apiBooking.platform_fee),
  host_payout: Number(apiBooking.host_payout),
  status: apiBooking.status,
  created_at: apiBooking.created_at,
  access_code: apiBooking.access_code,
  directions: apiBooking.directions,
});

const convertSavedGuest = (apiGuest: any): SavedGuest => ({
  id: apiGuest.id,
  renter_id: apiGuest.renter_id,
  guest_name: apiGuest.guest_name,
  phone_number: apiGuest.phone_number,
  license_plate: apiGuest.license_plate,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedGuests, setSavedGuests] = useState<SavedGuest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    estate: '', city: '', start_date: '', end_date: '', booking_type: 'all'
  });
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [currentView, setCurrentView] = useState<AppState['currentView']>('landing');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
          setCurrentView(profile.role === 'host' ? 'host-dashboard' : 'search');
          await Promise.all([
            fetchListings(),
            fetchSavedGuests(),
            fetchBookings(),
          ]);
        } catch {
          tokenManager.removeToken();
        }
      }
    };
    initAuth();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const setErrorState = useCallback((err: string) => {
    setError(err);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: loggedInUser, token } = await authAPI.login({ email, password });
      tokenManager.setToken(token);
      setUser(loggedInUser);
      setCurrentView(loggedInUser.role === 'host' ? 'host-dashboard' : 'renter-dashboard');
      await Promise.all([
        fetchListings(),
        fetchSavedGuests(),
        fetchBookings(),
      ]);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setErrorState(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (data: { email: string; phone: string; password: string; full_name: string; role: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { user: newUser, token } = await authAPI.register(data);
      tokenManager.setToken(token);
      setUser(newUser);
      setCurrentView(newUser.role === 'host' ? 'host-dashboard' : 'renter-dashboard');
      await Promise.all([
        fetchListings(),
        fetchSavedGuests(),
        fetchBookings(),
      ]);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setErrorState(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    tokenManager.removeToken();
    setUser(null);
    setListings([]);
    setSavedGuests([]);
    setBookings([]);
    setSearchResults([]);
    setCurrentView('landing');
  }, []);

  const setView = useCallback((view: AppState['currentView']) => {
    setCurrentView(view);
  }, []);

  const updateSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  }, []);

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await listingsAPI.getAll({
        estate: searchFilters.estate || undefined,
        city: searchFilters.city || undefined,
        booking_type: searchFilters.booking_type !== 'all' ? searchFilters.booking_type : undefined,
      });
      setSearchResults(results.map(convertListing));
      setCurrentView('results');
    } catch (err: any) {
      setErrorState(err.message || 'Search failed');
    }
    setLoading(false);
  }, [searchFilters]);

  const fetchListings = useCallback(async () => {
    try {
      const data = await listingsAPI.getAll();
      setListings(data.map(convertListing));
    } catch (err: any) {
      console.error('Failed to fetch listings:', err);
    }
  }, []);

  const fetchSavedGuests = useCallback(async () => {
    // Note: backend doesn't have saved guests endpoint yet, use localStorage fallback
    try {
      const stored = localStorage.getItem('savedGuests');
      if (stored) {
        setSavedGuests(JSON.parse(stored));
      }
    } catch {
      setSavedGuests([]);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      if (user?.role === 'host') {
        const data = await bookingsAPI.getHostBookings();
        setBookings(data.map(convertBooking));
      } else {
        const data = await bookingsAPI.getRenterBookings();
        setBookings(data.map(convertBooking));
      }
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
    }
  }, [user]);

  const fetchHostListings = useCallback(async () => {
    try {
      const data = await listingsAPI.getHostListings();
      return data.map(convertListing);
    } catch (err: any) {
      console.error('Failed to fetch host listings:', err);
      return [];
    }
  }, []);

  const fetchHostBookings = useCallback(async () => {
    try {
      const data = await bookingsAPI.getHostBookings();
      return data.map(convertBooking);
    } catch (err: any) {
      console.error('Failed to fetch host bookings:', err);
      return [];
    }
  }, []);

  const fetchHostEarnings = useCallback(async () => {
    try {
      return await bookingsAPI.getHostEarnings();
    } catch (err: any) {
      console.error('Failed to fetch host earnings:', err);
      return { total: 0, pending: 0, released: 0 };
    }
  }, []);

  const fetchHostEarningsHistory = useCallback(async () => {
    try {
      return await bookingsAPI.getHostEarningsHistory();
    } catch (err: any) {
      console.error('Failed to fetch host earnings history:', err);
      return { monthly: [], weekly: [], byListing: [] };
    }
  }, []);

  const fetchRenterBookings = useCallback(async () => {
    try {
      const data = await bookingsAPI.getRenterBookings();
      setBookings(data.map(convertBooking));
    } catch (err: any) {
      console.error('Failed to fetch renter bookings:', err);
    }
  }, []);

  // Synchronous getters - work with local state (for components like HostDashboard)
  const getHostListings = useCallback(() => {
    return listings.filter(l => l.host_id === (user?.id || ''));
  }, [listings, user]);

  const getHostBookings = useCallback(() => {
    const hostListingIds = listings.filter(l => l.host_id === (user?.id || '')).map(l => l.id);
    return bookings.filter(b => hostListingIds.includes(b.listing_id));
  }, [bookings, listings, user]);

  const getHostEarnings = useCallback(() => {
    const hostBookings = getHostBookings();
    const total = hostBookings.reduce((sum, b) => sum + b.host_payout, 0);
    const pending = hostBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').reduce((sum, b) => sum + b.host_payout, 0);
    const released = hostBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.host_payout, 0);
    return { total, pending, released };
  }, [getHostBookings]);

  const getRenterBookings = useCallback(() => {
    return bookings.filter(b => b.renter_id === (user?.id || ''));
  }, [bookings, user]);

  const selectListing = useCallback((listing: Listing | null) => {
    setSelectedListing(listing);
  }, []);

  const selectBooking = useCallback((booking: Booking | null) => {
    setSelectedBooking(booking);
  }, []);

  const addSavedGuest = useCallback(async (guest: Omit<SavedGuest, 'id' | 'renter_id'>): Promise<string> => {
    if (!user) return '';
    const newGuest: SavedGuest = {
      ...guest,
      id: `sg${Date.now()}`,
      renter_id: user.id,
    };
    // Backend doesn't have this endpoint yet, use localStorage
    const updated = [...savedGuests, newGuest];
    setSavedGuests(updated);
    localStorage.setItem('savedGuests', JSON.stringify(updated));
    return newGuest.id;
  }, [user, savedGuests]);

  const removeSavedGuest = useCallback(async (id: string) => {
    const updated = savedGuests.filter(g => g.id !== id);
    setSavedGuests(updated);
    localStorage.setItem('savedGuests', JSON.stringify(updated));
  }, [savedGuests]);

  const createBooking = useCallback(async (booking: Omit<Booking, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const created = await bookingsAPI.create(booking);
      const converted = convertBooking(created);
      setBookings(prev => [...prev, converted]);
      setSelectedBooking(converted);
      setCurrentView('success');
      
      // Initialize payment
      const { reference } = await paymentsAPI.initialize(created.id, user?.email || '');
      // Redirect to Paystack would happen here in real app
      
      setLoading(false);
    } catch (err: any) {
      setErrorState(err.message || 'Booking failed');
    }
  }, [user]);

  const addListing = useCallback(async (listing: Omit<Listing, 'id' | 'host_id' | 'host_name' | 'rating' | 'review_count'>) => {
    setLoading(true);
    setError(null);
    try {
      const created = await listingsAPI.create(listing);
      const converted = convertListing(created);
      setListings(prev => [...prev, converted]);
      setLoading(false);
    } catch (err: any) {
      setErrorState(err.message || 'Failed to create listing');
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId: string, status: Booking['status'], accessCode?: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status, accessCode);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status, ...(accessCode !== undefined ? { access_code: accessCode } : {}) } : b
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update booking');
    }
  }, []);

  const updateBookingAccessCode = useCallback(async (bookingId: string, accessCode: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, 'confirmed', accessCode);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, access_code: accessCode } : b));
    } catch (err: any) {
      setError(err.message || 'Failed to update access code');
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await authAPI.deleteAccount();
      logout();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    }
  }, [logout]);

  return (
    <AppContext.Provider value={{
      user, listings, savedGuests, bookings, searchFilters, searchResults,
      isAuthenticated: !!user, currentView, selectedListing, selectedBooking,
      loading, error,
      login, register, logout, setView, updateSearchFilters, performSearch,
      selectListing, selectBooking, addSavedGuest, removeSavedGuest,
      createBooking, addListing, updateBookingStatus, updateBookingAccessCode,
      cancelBooking, deleteAccount, 
      // Async fetch functions
      fetchListings, fetchSavedGuests, fetchBookings,
      fetchHostListings, fetchHostBookings, fetchHostEarnings, fetchHostEarningsHistory, fetchRenterBookings,
      // Synchronous getters (for components)
      getHostListings, getHostBookings, getHostEarnings, getRenterBookings,
      clearError
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}