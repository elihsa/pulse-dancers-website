import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});

// Proper UUID format: 8-4-4-4-12 hex chars (32 total)
const UUIDS = {
  // Users
  RENTER: '11111111-1111-1111-1111-111111111111',
  HOST: '22222222-2222-2222-2222-222222222222',
  BOTH: '33333333-3333-3333-3333-333333333333',
  // Estates
  ESTATE_1: 'e1111111-1111-1111-1111-111111111111', // Note: 'e' prefix makes this invalid UUID
  ESTATE_2: 'e2222222-2222-2222-2222-222222222222',
  ESTATE_3: 'e3333333-3333-3333-3333-333333333333',
  ESTATE_4: 'e4444444-4444-4444-4444-444444444444',
  // Listings (proper UUIDs)
  LISTING_1: '11111111-1111-1111-1111-111111111111', // Residential driveway
  LISTING_2: '22222222-2222-2222-2222-222222222222', // Garage
  LISTING_3: '33333333-3333-3333-3333-333333333333', // Event parking
  LISTING_4: '44444444-4444-4444-4444-444444444444', // Estate bay
  LISTING_5: '55555555-5555-5555-5555-555555555555',
  LISTING_6: '66666666-6666-6666-6666-666666666666',
  LISTING_7: '77777777-7777-7777-7777-777777777777',
  LISTING_8: '88888888-8888-8888-8888-888888888888',
  LISTING_9: '99999999-9999-9999-9999-999999999999',
  // Bookings
  BOOKING_1: 'b1111111-1111-1111-1111-111111111111', // Invalid - has 'b' prefix
  BOOKING_2: 'b2222222-2222-2222-2222-222222222222',
  BOOKING_3: 'b3333333-3333-3333-3333-333333333333',
  BOOKING_4: 'b4444444-4444-4444-4444-444444444444',
  BOOKING_5: 'b5555555-5555-5555-5555-555555555555',
  // Reviews
  REVIEW_1: 'r1111111-1111-1111-1111-111111111111', // Invalid - has 'r' prefix
  REVIEW_2: 'r2222222-2222-2222-2222-222222222222',
};

// Fix: Generate proper UUIDs (all hex, no prefixes)
function genUUID(prefix: string, num: number): string {
  const hex = num.toString(16).padStart(32, '0');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

// Better: use fixed valid UUIDs
const IDS = {
  RENTER: '11111111-1111-1111-1111-111111111111',
  HOST: '22222222-2222-2222-2222-222222222222',
  BOTH: '33333333-3333-3333-3333-333333333333',
  ESTATE_1: '11111111-1111-1111-1111-111111111111', // reuse but different table
  ESTATE_2: '22222222-2222-2222-2222-222222222222',
  ESTATE_3: '33333333-3333-3333-3333-333333333333',
  ESTATE_4: '44444444-4444-4444-4444-444444444444',
  LISTING_1: 'a1111111-1111-1111-1111-111111111111',
  LISTING_2: 'a2222222-2222-2222-2222-222222222222',
  LISTING_3: 'a3333333-3333-3333-3333-333333333333',
  LISTING_4: 'a4444444-4444-4444-4444-444444444444',
  LISTING_5: 'a5555555-5555-5555-5555-555555555555',
  LISTING_6: 'a6666666-6666-6666-6666-666666666666',
  LISTING_7: 'a7777777-7777-7777-7777-777777777777',
  LISTING_8: 'a8888888-8888-8888-8888-888888888888',
  LISTING_9: 'a9999999-9999-9999-9999-999999999999',
  BOOKING_1: 'b1111111-1111-1111-1111-111111111111', // still invalid!
  BOOKING_2: 'b2222222-2222-2222-2222-222222222222',
  BOOKING_3: 'b3333333-3333-3333-3333-333333333333',
  BOOKING_4: 'b4444444-4444-4444-4444-444444444444',
  BOOKING_5: 'b5555555-5555-5555-5555-555555555555',
  REVIEW_1: 'c1111111-1111-1111-1111-111111111111',
  REVIEW_2: 'c2222222-2222-2222-2222-222222222222',
};

// Actually, valid UUID must be all hex chars (0-9, a-f). Let me use proper ones.
const V = {
  RENTER: '11111111-1111-1111-1111-111111111111',
  HOST: '22222222-2222-2222-2222-222222222222',
  BOTH: '33333333-3333-3333-3333-333333333333',
  ESTATE_1: 'e1111111-1111-1111-1111-111111111111', // e is valid hex!
  ESTATE_2: 'e2222222-2222-2222-2222-222222222222',
  ESTATE_3: 'e3333333-3333-3333-3333-333333333333',
  ESTATE_4: 'e4444444-4444-4444-4444-444444444444',
  LISTING_1: 'f1111111-1111-1111-1111-111111111111', // f is valid hex
  LISTING_2: 'f2222222-2222-2222-2222-222222222222',
  LISTING_3: 'f3333333-3333-3333-3333-333333333333',
  LISTING_4: 'f4444444-4444-4444-4444-444444444444',
  LISTING_5: 'f5555555-5555-5555-5555-555555555555',
  LISTING_6: 'f6666666-6666-6666-6666-666666666666',
  LISTING_7: 'f7777777-7777-7777-7777-777777777777',
  LISTING_8: 'f8888888-8888-8888-8888-888888888888',
  LISTING_9: 'f9999999-9999-9999-9999-999999999999',
  BOOKING_1: 'b1111111-1111-1111-1111-111111111111', // b is valid hex!
  BOOKING_2: 'b2222222-2222-2222-2222-222222222222',
  BOOKING_3: 'b3333333-3333-3333-3333-333333333333',
  BOOKING_4: 'b4444444-4444-4444-4444-444444444444',
  BOOKING_5: 'b5555555-5555-5555-5555-555555555555',
  REVIEW_1: 'c1111111-1111-1111-1111-111111111111', // c is valid hex
  REVIEW_2: 'c2222222-2222-2222-2222-222222222222',
};

async function seedDemoData() {
  console.log('🌱 Seeding demo data for E2E testing (production schema)...\n');

  try {
    // 1. Ensure demo users exist
    console.log('1. Creating/updating demo users...');
    const { error: userError } = await supabase
      .from('users')
      .upsert([
        {
          id: V.RENTER,
          email: 'renter@parkbuddy.co.za',
          phone: '+27 82 555 0000',
          password_hash: '$2b$10$9X8PrBls0YgGp0oDS6IfTubmUVgveQjzAhhk7qFo1Lrysw1.02dB6',
          full_name: 'Kagiso Molefe',
          role: 'renter',
          id_verified: true,
          residence_verified: true,
          email_verified: true,
        },
        {
          id: V.HOST,
          email: 'host@parkbuddy.co.za',
          phone: '+27 72 111 2222',
          password_hash: '$2b$10$tQFXlo3bs3CFKzY3qAULpO9mCFi2nNMIvgkAWUzwlLCO2w7ZeyCmG',
          full_name: 'Thabo Mokoena',
          role: 'host',
          id_verified: false,
          residence_verified: false,
          email_verified: true,
        },
        {
          id: V.BOTH,
          email: 'both@parkbuddy.co.za',
          phone: '+27 83 333 4444',
          password_hash: '$2b$10$MqBubsMoUQynuSpv695YSux7lphv.BsT.4tSKdH0OKoL0GEnJAuNW',
          full_name: 'Sipho Dlamini',
          role: 'both',
          id_verified: true,
          residence_verified: true,
          email_verified: true,
        },
      ], { onConflict: 'id' });

    if (userError) {
      console.error('❌ Users error:', userError);
    } else {
      console.log('✅ Demo users created/updated');
    }

    // 2. Insert estates
    console.log('\n2. Creating estates for map testing...');
    const { error: estateError } = await supabase
      .from('estates')
      .upsert([
        { id: V.ESTATE_1, name: 'Midrand Estate', city: 'Johannesburg', province: 'Gauteng', latitude: -25.9884, longitude: 28.1267, zoom_level: 17 },
        { id: V.ESTATE_2, name: 'Waterkloof Heights', city: 'Pretoria', province: 'Gauteng', latitude: -25.7831, longitude: 28.1784, zoom_level: 17 },
        { id: V.ESTATE_3, name: 'Stellenbosch Village Estate', city: 'Stellenbosch', province: 'Western Cape', latitude: -33.9321, longitude: 18.8602, zoom_level: 17 },
        { id: V.ESTATE_4, name: 'Lonehill Security Park', city: 'Sandton', province: 'Gauteng', latitude: -26.0167, longitude: 28.0306, zoom_level: 17 },
      ], { onConflict: 'id' });

    if (estateError) {
      console.error('❌ Estates error:', estateError);
    } else {
      console.log('✅ Estates created/updated');
    }

    // 3. Insert listings for demo host
    console.log('\n3. Creating listings...');
    const hostId = V.HOST;
    const { error: listingError } = await supabase
      .from('listings')
      .upsert([
        // Residential driveway (assign to first estate)
        {
          id: V.LISTING_1,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: '123 Main Street',
          bay_number: 'Driveway A',
          price_per_day: 180,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 2,
          map_marker_lat: -26.0523,
          map_marker_lng: 28.0234,
        },
        // Garage (assign to first estate)
        {
          id: V.LISTING_2,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: '45 Oak Avenue',
          bay_number: 'Garage 1',
          price_per_day: 220,
          booking_type: 'request',
          is_active: true,
          walk_time_minutes: 3,
          map_marker_lat: -26.1123,
          map_marker_lng: 28.0456,
        },
        // Event parking (assign to first estate)
        {
          id: V.LISTING_3,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'FNB Stadium',
          bay_number: 'Event Lot P1',
          price_per_day: 300,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 5,
          map_marker_lat: -26.2381,
          map_marker_lng: 27.9811,
        },
        // Regular estate bays
        {
          id: V.LISTING_4,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'Cluster A',
          bay_number: 'B-12',
          price_per_day: 150,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 5,
          map_marker_lat: -25.9885,
          map_marker_lng: 28.1268,
        },
        {
          id: V.LISTING_5,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'Cluster A',
          bay_number: 'B-14',
          price_per_day: 180,
          booking_type: 'request',
          is_active: true,
          walk_time_minutes: 6,
          map_marker_lat: -25.9886,
          map_marker_lng: 28.1269,
        },
        {
          id: V.LISTING_6,
          host_id: hostId,
          estate_id: V.ESTATE_2,
          cluster_or_street: 'Block B',
          bay_number: 'A-5',
          price_per_day: 200,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 4,
          map_marker_lat: -25.7832,
          map_marker_lng: 28.1785,
        },
        // More estate bays for map clustering
        {
          id: V.LISTING_7,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'Cluster B',
          bay_number: 'C-20',
          price_per_day: 160,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 3,
          map_marker_lat: -25.9890,
          map_marker_lng: 28.1270,
        },
        {
          id: V.LISTING_8,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'Cluster B',
          bay_number: 'C-22',
          price_per_day: 170,
          booking_type: 'request',
          is_active: true,
          walk_time_minutes: 4,
          map_marker_lat: -25.9892,
          map_marker_lng: 28.1272,
        },
        {
          id: V.LISTING_9,
          host_id: hostId,
          estate_id: V.ESTATE_1,
          cluster_or_street: 'Cluster C',
          bay_number: 'D-30',
          price_per_day: 140,
          booking_type: 'instant',
          is_active: true,
          walk_time_minutes: 7,
          map_marker_lat: -25.9895,
          map_marker_lng: 28.1275,
        },
      ], { onConflict: 'id' });

    if (listingError) {
      console.error('❌ Listings error:', listingError);
    } else {
      console.log('✅ Listings created/updated (9 total)');
    }

    // 4. Insert completed bookings for reviews testing
    console.log('\n4. Creating completed bookings...');
    const renterId = V.RENTER;
    const { error: bookingError } = await supabase
      .from('bookings')
      .upsert([
        // Completed booking 1 (has review)
        {
          id: V.BOOKING_1,
          listing_id: V.LISTING_4,
          renter_id: renterId,
          guest_name: 'Kagiso Molefe',
          guest_phone: '+27 82 555 0000',
          guest_license_plate: 'GP 123 ABC',
          estate_name: 'Midrand Estate',
          cluster_or_street: 'Cluster A',
          bay_number: 'B-12',
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_amount: 450,
          platform_fee: 67.50,
          host_payout: 382.50,
          status: 'completed',
          access_code: 'ACC12345',
        },
        // Completed booking 2 - NO review yet (for write review test)
        {
          id: V.BOOKING_2,
          listing_id: V.LISTING_5,
          renter_id: renterId,
          guest_name: 'Kagiso Molefe',
          guest_phone: '+27 82 555 0000',
          guest_license_plate: 'GP 123 ABC',
          estate_name: 'Midrand Estate',
          cluster_or_street: 'Cluster A',
          bay_number: 'B-14',
          start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_amount: 360,
          platform_fee: 54.00,
          host_payout: 306.00,
          status: 'completed',
          access_code: 'ACC67890',
        },
        // Completed booking 3 - NO review yet
        {
          id: V.BOOKING_3,
          listing_id: V.LISTING_6,
          renter_id: renterId,
          guest_name: 'Kagiso Molefe',
          guest_phone: '+27 82 555 0000',
          guest_license_plate: 'GP 123 ABC',
          estate_name: 'Waterkloof Heights',
          cluster_or_street: 'Block B',
          bay_number: 'A-5',
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_amount: 400,
          platform_fee: 60.00,
          host_payout: 340.00,
          status: 'completed',
          access_code: 'ACC54321',
        },
        // Active booking
        {
          id: V.BOOKING_4,
          listing_id: V.LISTING_7,
          renter_id: renterId,
          guest_name: 'Kagiso Molefe',
          guest_phone: '+27 82 555 0000',
          guest_license_plate: 'GP 123 ABC',
          estate_name: 'Midrand Estate',
          cluster_or_street: 'Cluster B',
          bay_number: 'C-20',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_amount: 320,
          platform_fee: 48.00,
          host_payout: 272.00,
          status: 'active',
          access_code: 'ACC98765',
        },
        // Pending booking
        {
          id: V.BOOKING_5,
          listing_id: V.LISTING_8,
          renter_id: renterId,
          guest_name: 'Kagiso Molefe',
          guest_phone: '+27 82 555 0000',
          guest_license_plate: 'GP 123 ABC',
          estate_name: 'Midrand Estate',
          cluster_or_street: 'Cluster B',
          bay_number: 'C-22',
          start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_amount: 340,
          platform_fee: 51.00,
          host_payout: 289.00,
          status: 'pending',
          access_code: null,
        },
      ], { onConflict: 'id' });

    if (bookingError) {
      console.error('❌ Bookings error:', bookingError);
    } else {
      console.log('✅ Bookings created/updated (5 total: 3 completed, 1 active, 1 pending)');
    }

    // 5. Try to insert reviews (table may not exist yet)
    console.log('\n5. Creating reviews (table may not exist)...');
    const { error: reviewError } = await supabase
      .from('reviews')
      .upsert([
        {
          id: V.REVIEW_1,
          booking_id: V.BOOKING_1,
          reviewer_id: renterId,
          reviewee_id: hostId,
          reviewer_role: 'renter',
          rating: 5,
          comment: 'Excellent parking spot! Very secure and easy to find. Host was very responsive.',
          categories: { communication: 5, cleanliness: 5, safety: 5, accuracy: 4 },
          is_public: true,
        },
        // Host review for booking 2 (different booking)
        {
          id: V.REVIEW_2,
          booking_id: V.BOOKING_2,
          reviewer_id: hostId,
          reviewee_id: renterId,
          reviewer_role: 'host',
          rating: 5,
          comment: 'Thank you Kagiso! It was a pleasure hosting you. Drive safe!',
          categories: { communication: 5, cleanliness: 5, safety: 5, accuracy: 5 },
          is_public: true,
        },
      ], { onConflict: 'id' });

    if (reviewError) {
      console.log(`   ⚠️  Reviews table not ready: ${reviewError.message}`);
      console.log('   → Run schema.sql migration in Supabase Dashboard to create reviews table');
    } else {
      console.log('✅ Reviews created/updated');
    }

    // 6. Verify data
    console.log('\n6. Verifying seeded data...');
    const tables = ['users', 'estates', 'listings', 'bookings', 'reviews'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`   ${table}: table not found or error (${error.message})`);
      } else {
        console.log(`   ${table}: ${count} records`);
      }
    }

    console.log('\n🎉 Demo data seeding complete!');
    console.log('\n📋 Test credentials:');
    console.log('   Renter: renter@parkbuddy.co.za / renter123');
    console.log('   Host:   host@parkbuddy.co.za / host123');
    console.log('   Both:   both@parkbuddy.co.za / both123');
    console.log('\n🧪 Ready for E2E tests!');

  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
}

seedDemoData();