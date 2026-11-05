// API service for frontend-backend communication

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data: { email: string; phone: string; password: string; full_name: string; role: string }) =>
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => apiCall('/auth/profile'),

  updateProfile: (data: { full_name?: string; phone?: string }) =>
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  deleteAccount: () => apiCall('/auth/account', { method: 'DELETE' }),
};

// Listings API
export const listingsAPI = {
  getAll: (filters?: { estate?: string; city?: string; booking_type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.estate) params.append('estate', filters.estate);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.booking_type) params.append('booking_type', filters.booking_type);
    
    const queryString = params.toString();
    return apiCall(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => apiCall(`/listings/${id}`),

  create: (data: any) =>
    apiCall('/listings', { method: 'POST', body: JSON.stringify(data) }),

  getHostListings: () => apiCall('/listings/host/my-listings'),

  update: (id: string, data: any) =>
    apiCall(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiCall(`/listings/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) =>
    apiCall('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  getRenterBookings: () => apiCall('/bookings/renter/my-bookings'),

  getHostBookings: () => apiCall('/bookings/host/my-bookings'),

  getHostEarnings: () => apiCall('/bookings/host/earnings'),

  getHostEarningsHistory: () => apiCall('/bookings/host/earnings/history'),

  getById: (id: string) => apiCall(`/bookings/${id}`),

  updateStatus: (id: string, status: string, access_code?: string) =>
    apiCall(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, access_code }),
    }),

  cancel: (id: string) =>
    apiCall(`/bookings/${id}/cancel`, { method: 'POST' }),
};

// Payments API
export const paymentsAPI = {
  initialize: (booking_id: string, email: string) =>
    apiCall('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ booking_id, email }),
    }),

  verify: (reference: string) => apiCall(`/payments/verify/${reference}`),

  getByBooking: (booking_id: string) => apiCall(`/payments/booking/${booking_id}`),

  release: (booking_id: string) =>
    apiCall(`/payments/release/${booking_id}`, { method: 'POST' }),

  refund: (booking_id: string) =>
    apiCall(`/payments/refund/${booking_id}`, { method: 'POST' }),
};

// Token management
export const tokenManager = {
  setToken: (token: string) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};
