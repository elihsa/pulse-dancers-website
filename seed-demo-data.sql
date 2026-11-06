-- Seed demo data for E2E testing
-- Run this on the production database (Render PostgreSQL)

-- 1. Ensure demo users exist
INSERT INTO users (id, email, phone, password_hash, full_name, role, is_verified, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'renter@parkbuddy.co.za', '+27 82 555 0000', '$2b$10$dummyhash', 'Kagiso Molefe', 'renter', true, NOW()),
  ('22222222-2222-2222-2222-222222222222', 'host@parkbuddy.co.za', '+27 72 111 2222', '$2b$10$dummyhash', 'Thabo Mokoena', 'host', true, NOW()),
  ('33333333-3333-3333-3333-333333333333', 'both@parkbuddy.co.za', '+27 83 333 4444', '$2b$10$dummyhash', 'Sipho Dlamini', 'both', true, NOW())
ON CONFLICT (email) DO UPDATE SET
  phone = EXCLUDED.phone,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_verified = EXCLUDED.is_verified;

-- 2. Insert estates for map testing
INSERT INTO estates (id, name, city, province, latitude, longitude, zoom_level) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Midrand Estate', 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 17),
  ('e2222222-2222-2222-2222-222222222222', 'Waterkloof Heights', 'Pretoria', 'Gauteng', -25.7831, 28.1784, 17),
  ('e3333333-3333-3333-3333-333333333333', 'Stellenbosch Village Estate', 'Stellenbosch', 'Western Cape', -33.9321, 18.8602, 17),
  ('e4444444-4444-4444-4444-444444444444', 'Lonehill Security Park', 'Sandton', 'Gauteng', -26.0167, 28.0306, 17)
ON CONFLICT DO NOTHING;

-- 3. Insert listings for demo host (Thabo Mokoena - 22222222-2222-2222-2222-222222222222)
-- These listings will be used for verification gate testing

-- Residential driveway requiring ID verification
INSERT INTO listings (id, host_id, estate_id, listing_type, cluster_or_street, bay_number, address_line_1, suburb, city, province, latitude, longitude, price_per_day, booking_type, is_active, walk_time_minutes, requires_id_verified_renter, map_marker_lat, map_marker_lng) VALUES
  ('l1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', NULL, 'residential_driveway', '123 Main Street', 'Driveway A', '123 Main Street', 'Bryanston', 'Johannesburg', 'Gauteng', -26.0523, 28.0234, 180, 'instant', true, 2, true, -26.0523, 28.0234),
  -- Garage requiring ID verification
  ('l2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', NULL, 'garage', '45 Oak Avenue', 'Garage 1', '45 Oak Avenue', 'Sandhurst', 'Johannesburg', 'Gauteng', -26.1123, 28.0456, 220, 'request', true, 3, true, -26.1123, 28.0456),
  -- Event parking requiring ID verification
  ('l3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', NULL, 'event_parking', 'FNB Stadium', 'Event Lot P1', 'Soweto Highway', 'Soweto', 'Johannesburg', 'Gauteng', -26.2381, 27.9811, 300, 'instant', true, 5, true, -26.2381, 27.9811),
  -- Regular estate bay (no verification required) - for normal booking flow
  ('l4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'estate_bay', 'Cluster A', 'B-12', NULL, NULL, 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 150, 'instant', true, 5, false, -25.9885, 28.1268),
  ('l5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'estate_bay', 'Cluster A', 'B-14', NULL, NULL, 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 180, 'request', true, 6, false, -25.9886, 28.1269),
  ('l6666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'estate_bay', 'Block B', 'A-5', NULL, NULL, 'Pretoria', 'Gauteng', -25.7831, 28.1784, 200, 'instant', true, 4, false, -25.7832, 28.1785),
  -- Estate bays with map markers for Midrand Estate
  ('l7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'estate_bay', 'Cluster B', 'C-20', NULL, NULL, 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 160, 'instant', true, 3, false, -25.9890, 28.1270),
  ('l8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'estate_bay', 'Cluster B', 'C-22', NULL, NULL, 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 170, 'request', true, 4, false, -25.9892, 28.1272),
  ('l9999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'estate_bay', 'Cluster C', 'D-30', NULL, NULL, 'Johannesburg', 'Gauteng', -25.9884, 28.1267, 140, 'instant', true, 7, false, -25.9895, 28.1275)
ON CONFLICT (id) DO UPDATE SET
  host_id = EXCLUDED.host_id,
  estate_id = EXCLUDED.estate_id,
  listing_type = EXCLUDED.listing_type,
  cluster_or_street = EXCLUDED.cluster_or_street,
  bay_number = EXCLUDED.bay_number,
  address_line_1 = EXCLUDED.address_line_1,
  suburb = EXCLUDED.suburb,
  city = EXCLUDED.city,
  province = EXCLUDED.province,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  price_per_day = EXCLUDED.price_per_day,
  booking_type = EXCLUDED.booking_type,
  is_active = EXCLUDED.is_active,
  walk_time_minutes = EXCLUDED.walk_time_minutes,
  requires_id_verified_renter = EXCLUDED.requires_id_verified_renter,
  map_marker_lat = EXCLUDED.map_marker_lat,
  map_marker_lng = EXCLUDED.map_marker_lng;

-- 4. Insert completed bookings for reviews testing
-- Renter (11111111-1111-1111-1111-111111111111) has completed bookings

-- Completed booking 1 - with review already written
INSERT INTO bookings (id, listing_id, renter_id, guest_name, guest_phone, guest_license_plate, estate_name, cluster_or_street, bay_number, start_date, end_date, total_amount, platform_fee, host_payout, status, access_code, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'l4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Kagiso Molefe', '+27 82 555 0000', 'GP 123 ABC', 'Midrand Estate', 'Cluster A', 'B-12', CURRENT_DATE - 10, CURRENT_DATE - 8, 450, 67.50, 382.50, 'completed', 'ACC12345', NOW() - INTERVAL '12 days'),
  -- Completed booking 2 - NO review yet (for write review test)
  ('b2222222-2222-2222-2222-222222222222', 'l5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Kagiso Molefe', '+27 82 555 0000', 'GP 123 ABC', 'Midrand Estate', 'Cluster A', 'B-14', CURRENT_DATE - 20, CURRENT_DATE - 18, 360, 54.00, 306.00, 'completed', 'ACC67890', NOW() - INTERVAL '22 days'),
  -- Completed booking 3 - NO review yet
  ('b3333333-3333-3333-3333-333333333333', 'l6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Kagiso Molefe', '+27 82 555 0000', 'GP 123 ABC', 'Waterkloof Heights', 'Block B', 'A-5', CURRENT_DATE - 30, CURRENT_DATE - 28, 400, 60.00, 340.00, 'completed', 'ACC54321', NOW() - INTERVAL '32 days'),
  -- Active booking
  ('b4444444-4444-4444-4444-444444444444', 'l7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Kagiso Molefe', '+27 82 555 0000', 'GP 123 ABC', 'Midrand Estate', 'Cluster B', 'C-20', CURRENT_DATE, CURRENT_DATE + 2, 320, 48.00, 272.00, 'active', 'ACC98765', NOW() - INTERVAL '1 day'),
  -- Pending booking
  ('b5555555-5555-5555-5555-555555555555', 'l8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Kagiso Molefe', '+27 82 555 0000', 'GP 123 ABC', 'Midrand Estate', 'Cluster B', 'C-22', CURRENT_DATE + 5, CURRENT_DATE + 7, 340, 51.00, 289.00, 'pending', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  listing_id = EXCLUDED.listing_id,
  renter_id = EXCLUDED.renter_id,
  guest_name = EXCLUDED.guest_name,
  guest_phone = EXCLUDED.guest_phone,
  guest_license_plate = EXCLUDED.guest_license_plate,
  estate_name = EXCLUDED.estate_name,
  cluster_or_street = EXCLUDED.cluster_or_street,
  bay_number = EXCLUDED.bay_number,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  total_amount = EXCLUDED.total_amount,
  platform_fee = EXCLUDED.platform_fee,
  host_payout = EXCLUDED.host_payout,
  status = EXCLUDED.status,
  access_code = EXCLUDED.access_code,
  created_at = EXCLUDED.created_at;

-- 5. Insert reviews
-- Review for booking 1 (already reviewed)
INSERT INTO reviews (id, booking_id, reviewer_id, reviewee_id, reviewer_role, rating, comment, categories, is_public, created_at) VALUES
  ('r1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'renter', 5, 'Excellent parking spot! Very secure and easy to find. Host was very responsive.', '{"communication": 5, "cleanliness": 5, "safety": 5, "accuracy": 4}', true, NOW() - INTERVAL '8 days'),
  -- Host response to review 1
  ('r2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'host', 5, 'Thank you Kagiso! It was a pleasure hosting you. Drive safe!', '{"communication": 5, "cleanliness": 5, "safety": 5, "accuracy": 5}', true, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO UPDATE SET
  booking_id = EXCLUDED.booking_id,
  reviewer_id = EXCLUDED.reviewer_id,
  reviewee_id = EXCLUDED.reviewee_id,
  reviewer_role = EXCLUDED.reviewer_role,
  rating = EXCLUDED.rating,
  comment = EXCLUDED.comment,
  categories = EXCLUDED.categories,
  is_public = EXCLUDED.is_public,
  created_at = EXCLUDED.created_at;

-- 6. Add has_review column to bookings if not exists (for quick lookup)
-- Note: This is a computed field in the API, but we can add a generated column
-- For now, the API checks reviews table

-- 7. Update user verification status for host (Thabo needs verification for create-listing test)
UPDATE users SET is_verified = false WHERE id = '22222222-2222-2222-2222-222222222222';

-- 8. Insert some estate bay clusters for map testing
-- The clusters are derived from cluster_or_street field in listings

-- Verify the data
SELECT 'Users' as table_name, count(*) as count FROM users WHERE email IN ('renter@parkbuddy.co.za', 'host@parkbuddy.co.za', 'both@parkbuddy.co.za')
UNION ALL
SELECT 'Estates', count(*) FROM estates WHERE id LIKE 'e%'
UNION ALL
SELECT 'Listings', count(*) FROM listings WHERE id LIKE 'l%'
UNION ALL
SELECT 'Bookings', count(*) FROM bookings WHERE id LIKE 'b%'
UNION ALL
SELECT 'Reviews', count(*) FROM reviews WHERE id LIKE 'r%';