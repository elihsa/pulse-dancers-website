-- ParkBuddy SA Database Schema

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('host', 'renter', 'both')) DEFAULT 'renter',
  id_verified BOOLEAN DEFAULT FALSE,
  residence_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  zoom_level INTEGER DEFAULT 16,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  estate_id UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
  cluster_or_street VARCHAR(255) NOT NULL,
  bay_number VARCHAR(50) NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL CHECK (price_per_day > 0),
  booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('instant', 'request')) DEFAULT 'instant',
  is_active BOOLEAN DEFAULT TRUE,
  walk_time_minutes INTEGER DEFAULT 5,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  notes TEXT,
  directions TEXT,
  map_marker_lat DECIMAL(10, 8),
  map_marker_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_license_plate VARCHAR(20) NOT NULL,
  estate_name VARCHAR(255) NOT NULL,
  cluster_or_street VARCHAR(255) NOT NULL,
  bay_number VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  host_payout DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'disputed', 'cancelled')) DEFAULT 'pending',
  access_code VARCHAR(50),
  directions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  paystack_reference VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('pending', 'held_in_escrow', 'released', 'refunded', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  license_plate VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample estates
INSERT INTO estates (name, city, province, latitude, longitude, zoom_level) VALUES
  ('Midrand Estate', 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 17),
  ('Waterkloof Heights', 'Pretoria', 'Gauteng', -25.7831, 28.1784, 17),
  ('Stellenbosch Village Estate', 'Stellenbosch', 'Western Cape', -33.9321, 18.8602, 17),
  ('Umhlanga Rocks Estate', 'Durban', 'KwaZulu-Natal', -29.7276, 31.0856, 17),
  ('Lonehill Security Park', 'Sandton', 'Gauteng', -26.0167, 28.0306, 17),
  ('Val de Vie Estate', 'Paarl', 'Western Cape', -33.9850, 18.9500, 16),
  ('Zimbali Coastal Resort', 'Ballito', 'KwaZulu-Natal', -29.5389, 31.2164, 16),
  ('Dainfern Estate', 'Sandton', 'Gauteng', -26.0333, 28.0167, 16)
ON CONFLICT DO NOTHING;