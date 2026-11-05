export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: 'host' | 'renter' | 'both';
  id_verified: boolean;
  residence_verified: boolean;
  avatar?: string;
}

export interface Estate {
  id: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface MapMarker {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  host_id: string;
  host_name: string;
  estate_id: string;
  estate_name: string;
  cluster_or_street: string;
  bay_number: string;
  price_per_day: number;
  booking_type: 'instant' | 'request';
  is_active: boolean;
  walk_time_minutes: number;
  rating: number;
  review_count: number;
  notes?: string;
  map_marker?: MapMarker;
  directions?: string;
}

export interface SavedGuest {
  id: string;
  renter_id: string;
  guest_name: string;
  phone_number: string;
  license_plate: string;
  access_code?: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  renter_id: string;
  guest_id: string;
  guest_name: string;
  guest_phone: string;
  guest_license_plate: string;
  estate_name: string;
  cluster_or_street: string;
  bay_number: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  platform_fee: number;
  host_payout: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'disputed' | 'cancelled';
  created_at: string;
  access_code?: string;
  directions?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  paystack_reference: string;
  amount: number;
  status: 'pending' | 'held_in_escrow' | 'released' | 'refunded';
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface SearchFilters {
  estate: string;
  city: string;
  start_date: string;
  end_date: string;
  booking_type: 'all' | 'instant' | 'request';
}
