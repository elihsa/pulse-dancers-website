import { Estate, Listing, SavedGuest, Booking, User } from '../types';

export const mockEstates: Estate[] = [
  { id: 'e1', name: 'Midrand Estate', city: 'Johannesburg', province: 'Gauteng', lat: -25.9884, lng: 28.1267, zoom: 17 },
  { id: 'e2', name: 'Waterkloof Heights', city: 'Pretoria', province: 'Gauteng', lat: -25.7831, lng: 28.1784, zoom: 17 },
  { id: 'e3', name: 'Stellenbosch Village Estate', city: 'Stellenbosch', province: 'Western Cape', lat: -33.9321, lng: 18.8602, zoom: 17 },
  { id: 'e4', name: 'Umhlanga Rocks Estate', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.7276, lng: 31.0856, zoom: 17 },
  { id: 'e5', name: 'Lonehill Security Park', city: 'Sandton', province: 'Gauteng', lat: -26.0167, lng: 28.0306, zoom: 17 },
  { id: 'e6', name: 'Val de Vie Estate', city: 'Paarl', province: 'Western Cape', lat: -33.9850, lng: 18.9500, zoom: 16 },
  { id: 'e7', name: 'Zimbali Coastal Resort', city: 'Ballito', province: 'KwaZulu-Natal', lat: -29.5389, lng: 31.2164, zoom: 16 },
  { id: 'e8', name: 'Dainfern Estate', city: 'Sandton', province: 'Gauteng', lat: -26.0333, lng: 28.0167, zoom: 16 },
];

export const mockListings: Listing[] = [
  {
    id: 'l1', host_id: 'h1', host_name: 'Thabo M.', estate_id: 'e1', estate_name: 'Midrand Estate',
    cluster_or_street: 'Cluster A', bay_number: 'Bay 14', price_per_day: 50, booking_type: 'instant',
    is_active: true, walk_time_minutes: 3, rating: 4.8, review_count: 24, notes: 'Covered parking, near gate 2',
    map_marker: { lat: -25.9887, lng: 28.1271 },
    directions: 'Enter via Gate 2 (Main Gate). Turn right at the clubhouse, take the second left. Bay 14 is the covered bay on your right, number painted on the wall.'
  },
  {
    id: 'l2', host_id: 'h2', host_name: 'Naledi K.', estate_id: 'e1', estate_name: 'Midrand Estate',
    cluster_or_street: 'Cluster B', bay_number: 'Bay 7', price_per_day: 40, booking_type: 'instant',
    is_active: true, walk_time_minutes: 5, rating: 4.6, review_count: 12
  },
  {
    id: 'l3', host_id: 'h3', host_name: 'Pieter V.', estate_id: 'e2', estate_name: 'Waterkloof Heights',
    cluster_or_street: 'Street 3', bay_number: 'Bay 22', price_per_day: 60, booking_type: 'request',
    is_active: true, walk_time_minutes: 2, rating: 4.9, review_count: 31, notes: 'Secure basement parking'
  },
  {
    id: 'l4', host_id: 'h4', host_name: 'Fatima A.', estate_id: 'e3', estate_name: 'Stellenbosch Village Estate',
    cluster_or_street: 'Oak Street', bay_number: 'Bay 3', price_per_day: 45, booking_type: 'instant',
    is_active: true, walk_time_minutes: 4, rating: 4.7, review_count: 18
  },
  {
    id: 'l5', host_id: 'h5', host_name: 'Sipho D.', estate_id: 'e4', estate_name: 'Umhlanga Rocks Estate',
    cluster_or_street: 'Block C', bay_number: 'Bay 11', price_per_day: 70, booking_type: 'instant',
    is_active: true, walk_time_minutes: 1, rating: 5.0, review_count: 8, notes: 'Ocean view parking bay',
    map_marker: { lat: -29.7279, lng: 31.0859 }
  },
  {
    id: 'l6', host_id: 'h6', host_name: 'Johan S.', estate_id: 'e5', estate_name: 'Lonehill Security Park',
    cluster_or_street: 'Section 4', bay_number: 'Bay 19', price_per_day: 55, booking_type: 'request',
    is_active: true, walk_time_minutes: 6, rating: 4.5, review_count: 15
  },
  {
    id: 'l7', host_id: 'h1', host_name: 'Thabo M.', estate_id: 'e8', estate_name: 'Dainfern Estate',
    cluster_or_street: 'Fairway Block', bay_number: 'Bay 8', price_per_day: 65, booking_type: 'instant',
    is_active: true, walk_time_minutes: 3, rating: 4.8, review_count: 24, notes: 'Near clubhouse'
  },
];

export const mockSavedGuests: SavedGuest[] = [
  { id: 'sg1', renter_id: 'r1', guest_name: 'Uncle Bheki', phone_number: '+27 72 123 4567', license_plate: 'GP 123 456' },
  { id: 'sg2', renter_id: 'r1', guest_name: 'Auntie Lerato', phone_number: '+27 82 987 6543', license_plate: 'WC 456 789' },
  { id: 'sg3', renter_id: 'r1', guest_name: 'Cousin Mandla', phone_number: '+27 61 555 1234', license_plate: 'KZN 789 012' },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1', listing_id: 'l1', renter_id: 'r1', guest_id: 'sg1',
    guest_name: 'Uncle Bheki', guest_phone: '+27 72 123 4567', guest_license_plate: 'GP 123 456',
    estate_name: 'Midrand Estate', cluster_or_street: 'Cluster A', bay_number: 'Bay 14',
    start_date: '2026-01-15', end_date: '2026-01-17',
    total_amount: 100, platform_fee: 15, host_payout: 85,
    status: 'completed', created_at: '2026-01-14T10:00:00Z'
  },
  {
    id: 'b2', listing_id: 'l3', renter_id: 'r1', guest_id: 'sg2',
    guest_name: 'Auntie Lerato', guest_phone: '+27 82 987 6543', guest_license_plate: 'WC 456 789',
    estate_name: 'Waterkloof Heights', cluster_or_street: 'Street 3', bay_number: 'Bay 22',
    start_date: '2026-01-20', end_date: '2026-01-22',
    total_amount: 120, platform_fee: 18, host_payout: 102,
    status: 'confirmed', created_at: '2026-01-19T14:30:00Z'
  },
];

export interface UserCredentials {
  email: string;
  password: string;
  user: User;
}

export const mockUsers: UserCredentials[] = [
  {
    email: 'renter@parkbuddy.co.za',
    password: 'renter123',
    user: {
      id: 'r1',
      email: 'renter@parkbuddy.co.za',
      phone: '+27 82 555 0000',
      full_name: 'Kagiso Molefe',
      role: 'renter',
      id_verified: true,
      residence_verified: true,
    }
  },
  {
    email: 'host@parkbuddy.co.za',
    password: 'host123',
    user: {
      id: 'h1',
      email: 'host@parkbuddy.co.za',
      phone: '+27 72 111 2222',
      full_name: 'Thabo Mokoena',
      role: 'host',
      id_verified: true,
      residence_verified: true,
    }
  },
  {
    email: 'both@parkbuddy.co.za',
    password: 'both123',
    user: {
      id: 'b1',
      email: 'both@parkbuddy.co.za',
      phone: '+27 83 999 8888',
      full_name: 'Lerato Nkosi',
      role: 'both',
      id_verified: true,
      residence_verified: true,
    }
  }
];

export const mockHostUsers: User[] = [
  { id: 'h1', email: 'thabo@email.co.za', phone: '+27 72 111 2222', full_name: 'Thabo Mokoena', role: 'host', id_verified: true, residence_verified: true },
  { id: 'h2', email: 'naledi@email.co.za', phone: '+27 82 333 4444', full_name: 'Naledi Khumalo', role: 'host', id_verified: true, residence_verified: true },
  { id: 'h3', email: 'pieter@email.co.za', phone: '+27 61 555 6666', full_name: 'Pieter van der Merwe', role: 'host', id_verified: true, residence_verified: true },
  { id: 'h4', email: 'fatima@email.co.za', phone: '+27 73 777 8888', full_name: 'Fatima Abrahams', role: 'host', id_verified: true, residence_verified: true },
  { id: 'h5', email: 'sipho@email.co.za', phone: '+27 84 999 0000', full_name: 'Sipho Dlamini', role: 'host', id_verified: true, residence_verified: true },
  { id: 'h6', email: 'johan@email.co.za', phone: '+27 76 111 3333', full_name: 'Johan Steyn', role: 'host', id_verified: true, residence_verified: true },
];
