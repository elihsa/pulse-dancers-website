export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: 'host' | 'renter' | 'both';
  id_verified: boolean;
  residence_verified: boolean;
  id_verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
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
  price_per_hour?: number;
  booking_type: 'instant' | 'request';
  is_active: boolean;
  walk_time_minutes: number;
  rating: number;
  review_count: number;
  notes?: string;
  map_marker?: MapMarker;
  directions?: string;
  listing_type?: 'estate_bay' | 'residential_driveway' | 'garage' | 'commercial_lot' | 'event_parking';
  is_event_parking?: boolean;
  event_multiplier?: number;
  event_dates?: string[];
  amenities?: string[];
  requires_id_verified_renter?: boolean;
  deposit_amount?: number;
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
  has_review?: boolean;
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

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  reviewer_role: 'host' | 'renter';
  rating: number;
  comment: string | null;
  categories: {
    communication: number;
    cleanliness: number;
    safety: number;
    accuracy: number;
  } | null;
  is_public: boolean;
  created_at: string;
  reviewer?: {
    id: string;
    full_name: string;
    id_verification_status?: string;
  };
  booking?: {
    id: string;
    start_date: string;
    end_date: string;
    listing?: {
      id: string;
      cluster_or_street: string;
      bay_number: string;
      estate_name: string;
    };
  };
  host_response?: string;
}

export interface ReviewAggregate {
  average_rating: number;
  total_reviews: number;
  categories: Record<string, number>;
}
