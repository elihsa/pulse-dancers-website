-- ParkBuddy SA Database Schema v1.1.0

-- Users table with KYC/Verification fields
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
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  -- KYC/Verification fields (NEW v1.1.0)
  id_document_front_url VARCHAR(500),
  id_document_back_url VARCHAR(500),
  id_selfie_url VARCHAR(500),
  id_verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (id_verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  id_verification_submitted_at TIMESTAMP,
  id_verification_reviewed_at TIMESTAMP,
  id_verification_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='reset_password_token') THEN
    ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='reset_password_expires') THEN
    ALTER TABLE users ADD COLUMN reset_password_expires TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_document_front_url') THEN
    ALTER TABLE users ADD COLUMN id_document_front_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_document_back_url') THEN
    ALTER TABLE users ADD COLUMN id_document_back_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_selfie_url') THEN
    ALTER TABLE users ADD COLUMN id_selfie_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_verification_status') THEN
    ALTER TABLE users ADD COLUMN id_verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (id_verification_status IN ('unverified', 'pending', 'verified', 'rejected'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_verification_submitted_at') THEN
    ALTER TABLE users ADD COLUMN id_verification_submitted_at TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_verification_reviewed_at') THEN
    ALTER TABLE users ADD COLUMN id_verification_reviewed_at TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id_verification_notes') THEN
    ALTER TABLE users ADD COLUMN id_verification_notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='saved_guests' AND column_name='access_code') THEN
    ALTER TABLE saved_guests ADD COLUMN access_code VARCHAR(50);
  END IF;
END $$;

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

-- Venues table (NEW v1.1.0)
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  venue_type VARCHAR(30) NOT NULL CHECK (venue_type IN ('stadium', 'arena', 'theatre', 'festival_ground', 'racecourse', 'convention_center')),
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Venue Events table (NEW v1.1.0)
CREATE TABLE IF NOT EXISTS venue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  event_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  expected_attendance INTEGER,
  multiplier_suggestion DECIMAL(4, 2) DEFAULT 1.0,
  source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'ticketmaster', 'web_scrape', 'api')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listings table (enhanced v1.1.0)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  estate_id UUID REFERENCES estates(id) ON DELETE SET NULL,  -- NULL for non-estate listings
  listing_type VARCHAR(30) NOT NULL DEFAULT 'estate_bay' CHECK (listing_type IN ('estate_bay', 'residential_driveway', 'garage', 'commercial_lot')),
  cluster_or_street VARCHAR(255),
  bay_number VARCHAR(50),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  suburb VARCHAR(100),
  city VARCHAR(100),
  province VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_day DECIMAL(10, 2) NOT NULL CHECK (price_per_day > 0),
  price_per_hour DECIMAL(10, 2),
  event_multiplier DECIMAL(4, 2) DEFAULT 1.0,
  event_dates JSONB,
  venue_name VARCHAR(255),
  booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('instant', 'request')) DEFAULT 'instant',
  is_active BOOLEAN DEFAULT TRUE,
  walk_time_minutes INTEGER DEFAULT 5,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  notes TEXT,
  directions TEXT,
  house_rules TEXT,
  amenities JSONB,
  capacity INTEGER DEFAULT 1,
  requires_id_verified_renter BOOLEAN DEFAULT FALSE,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  map_marker_lat DECIMAL(10, 8),
  map_marker_lng DECIMAL(11, 8),
  photos JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns for existing databases
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='estate_id') THEN
    ALTER TABLE listings ADD COLUMN estate_id UUID REFERENCES estates(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='listing_type') THEN
    ALTER TABLE listings ADD COLUMN listing_type VARCHAR(30) NOT NULL DEFAULT 'estate_bay' CHECK (listing_type IN ('estate_bay', 'residential_driveway', 'garage', 'commercial_lot'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='address_line_1') THEN
    ALTER TABLE listings ADD COLUMN address_line_1 VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='address_line_2') THEN
    ALTER TABLE listings ADD COLUMN address_line_2 VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='suburb') THEN
    ALTER TABLE listings ADD COLUMN suburb VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='city') THEN
    ALTER TABLE listings ADD COLUMN city VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='province') THEN
    ALTER TABLE listings ADD COLUMN province VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='latitude') THEN
    ALTER TABLE listings ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='longitude') THEN
    ALTER TABLE listings ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='price_per_hour') THEN
    ALTER TABLE listings ADD COLUMN price_per_hour DECIMAL(10, 2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='event_multiplier') THEN
    ALTER TABLE listings ADD COLUMN event_multiplier DECIMAL(4, 2) DEFAULT 1.0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='event_dates') THEN
    ALTER TABLE listings ADD COLUMN event_dates JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='venue_name') THEN
    ALTER TABLE listings ADD COLUMN venue_name VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='house_rules') THEN
    ALTER TABLE listings ADD COLUMN house_rules TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='amenities') THEN
    ALTER TABLE listings ADD COLUMN amenities JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='capacity') THEN
    ALTER TABLE listings ADD COLUMN capacity INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='requires_id_verified_renter') THEN
    ALTER TABLE listings ADD COLUMN requires_id_verified_renter BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='deposit_amount') THEN
    ALTER TABLE listings ADD COLUMN deposit_amount DECIMAL(10, 2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='photos') THEN
    ALTER TABLE listings ADD COLUMN photos JSONB;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_license_plate VARCHAR(20) NOT NULL,
  estate_name VARCHAR(255),
  cluster_or_street VARCHAR(255),
  bay_number VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  host_payout DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  deposit_status VARCHAR(20) DEFAULT 'none' CHECK (deposit_status IN ('none', 'held', 'refunded', 'forfeited')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'disputed', 'cancelled')) DEFAULT 'pending',
  access_code VARCHAR(50),
  directions TEXT,
  house_rules TEXT,
  checkin_photo_url VARCHAR(500),
  checkout_photo_url VARCHAR(500),
  checkin_at TIMESTAMP,
  checkout_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns for existing databases
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='start_time') THEN
    ALTER TABLE bookings ADD COLUMN start_time TIME;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='end_time') THEN
    ALTER TABLE bookings ADD COLUMN end_time TIME;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='deposit_amount') THEN
    ALTER TABLE bookings ADD COLUMN deposit_amount DECIMAL(10, 2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='deposit_status') THEN
    ALTER TABLE bookings ADD COLUMN deposit_status VARCHAR(20) DEFAULT 'none' CHECK (deposit_status IN ('none', 'held', 'refunded', 'forfeited'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='house_rules') THEN
    ALTER TABLE bookings ADD COLUMN house_rules TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checkin_photo_url') THEN
    ALTER TABLE bookings ADD COLUMN checkin_photo_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checkout_photo_url') THEN
    ALTER TABLE bookings ADD COLUMN checkout_photo_url VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checkin_at') THEN
    ALTER TABLE bookings ADD COLUMN checkin_at TIMESTAMP;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checkout_at') THEN
    ALTER TABLE bookings ADD COLUMN checkout_at TIMESTAMP;
  END IF;
END $$;

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
  access_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table (NEW v1.1.0)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_role VARCHAR(10) NOT NULL CHECK (reviewer_role IN ('host', 'renter')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  categories JSONB,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Support Chats table (NEW v1.1.0)
CREATE TABLE IF NOT EXISTS support_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Support Messages table (NEW v1.1.0)
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES support_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(10) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'system')),
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

-- Insert sample venues (NEW v1.1.0)
INSERT INTO venues (name, address, city, province, latitude, longitude, venue_type, capacity) VALUES
  ('FNB Stadium', 'Soweto, Johannesburg', 'Johannesburg', 'Gauteng', -26.2381, 27.9811, 'stadium', 94736),
  ('Cape Town Stadium', 'Green Point, Cape Town', 'Cape Town', 'Western Cape', -33.9030, 18.4175, 'stadium', 55000),
  ('Moses Mabhida Stadium', 'Durban', 'Durban', 'KwaZulu-Natal', -29.8186, 31.0258, 'stadium', 54000),
  ('Loftus Versfeld Stadium', 'Pretoria', 'Pretoria', 'Gauteng', -25.7511, 28.2311, 'stadium', 51762),
  ('Ellis Park Stadium', 'Johannesburg', 'Johannesburg', 'Gauteng', -26.1897, 28.0447, 'stadium', 62567),
  ('Sun Arena', 'Time Square, Pretoria', 'Pretoria', 'Gauteng', -25.7300, 28.2000, 'arena', 8500),
  ('GrandWest Casino', 'Goodwood, Cape Town', 'Cape Town', 'Western Cape', -33.8800, 18.5300, 'convention_center', 5000),
  ('CTICC', 'Cape Town', 'Cape Town', 'Western Cape', -33.9100, 18.4200, 'convention_center', 8000)
ON CONFLICT DO NOTHING;