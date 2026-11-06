import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});

async function cleanAndSeed() {
  console.log('🧹 Cleaning test data and seeding fresh demo data...\n');

  // 1. Delete existing bookings for test users
  console.log('1. Deleting old bookings...');
  const { error: bookingDelError } = await supabase
    .from('bookings')
    .delete()
    .in('renter_id', ['4041a3ff-7119-422f-b8bc-18d3e519db3d', 'b9851e30-4e5c-4403-b63e-00eabbf36a25', '62cf8f5e-4709-46a8-8a32-aca686f87710']);
  if (bookingDelError) console.error('  Booking delete error:', bookingDelError);
  else console.log('  ✅ Old bookings deleted');

  // 2. Delete existing listings for test hosts
  console.log('\n2. Deleting old listings...');
  const { error: listingDelError } = await supabase
    .from('listings')
    .delete()
    .in('host_id', ['4041a3ff-7119-422f-b8bc-18d3e519db3d', 'a78b3b12-0b6e-4cec-991f-d1f84ecae5d6']);
  if (listingDelError) console.error('  Listing delete error:', listingDelError);
  else console.log('  ✅ Old listings deleted');

  // 3. Delete test users (optional - keep them)
  // console.log('\n3. Deleting test users...');
  // const { error: userDelError } = await supabase
  //   .from('users')
  //   .delete()
  //   .in('id', ['4041a3ff-7119-422f-b8bc-18d3e519db3d', 'a78b3b12-0b6e-4cec-991f-d1f84ecae5d6', '62cf8f5e-4709-46a8-8a32-aca686f87710', 'b9851e30-4e5c-4403-b63e-00eabbf36a25']);
  // if (userDelError) console.error('  User delete error:', userDelError);
  // else console.log('  ✅ Test users deleted');

  // 4. Now seed fresh data for demo accounts
  console.log('\n3. Seeding fresh demo data...\n');

  const hostId = '22222222-2222-2222-2222-222222222222';
  const renterId = '11111111-1111-1111-1111-111111111111';
  const estateId = '1ce94e5f-1ea0-4f0d-81b7-cb2bbe9adbee'; // Midrand Estate

  // Create listings for demo host (let DB generate UUIDs)
  const { data: newListings, error: listingError } = await supabase
    .from('listings')
    .insert([
      // Residential driveway (for verification gate test) - use estate for now
      { host_id: hostId, estate_id: estateId, cluster_or_street: '123 Main Street', bay_number: 'Driveway A', price_per_day: 180, booking_type: 'instant', is_active: true, walk_time_minutes: 2, map_marker_lat: -26.0523, map_marker_lng: 28.0234 },
      // Garage (for verification gate test)
      { host_id: hostId, estate_id: estateId, cluster_or_street: '45 Oak Avenue', bay_number: 'Garage 1', price_per_day: 220, booking_type: 'request', is_active: true, walk_time_minutes: 3, map_marker_lat: -26.1123, map_marker_lng: 28.0456 },
      // Event parking (for verification gate test)
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'FNB Stadium', bay_number: 'Event Lot P1', price_per_day: 300, booking_type: 'instant', is_active: true, walk_time_minutes: 5, map_marker_lat: -26.2381, map_marker_lng: 27.9811 },
      // Regular estate bays (Midrand Estate)
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'Cluster A', bay_number: 'B-12', price_per_day: 150, booking_type: 'instant', is_active: true, walk_time_minutes: 5, map_marker_lat: -25.9885, map_marker_lng: 28.1268 },
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'Cluster A', bay_number: 'B-14', price_per_day: 180, booking_type: 'request', is_active: true, walk_time_minutes: 6, map_marker_lat: -25.9886, map_marker_lng: 28.1269 },
      { host_id: hostId, estate_id: '48e0f929-d4e4-4a87-9382-0b813b9706da', cluster_or_street: 'Block B', bay_number: 'A-5', price_per_day: 200, booking_type: 'instant', is_active: true, walk_time_minutes: 4, map_marker_lat: -25.7832, map_marker_lng: 28.1785 }, // Waterkloof Heights
      // More for map clustering
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'Cluster B', bay_number: 'C-20', price_per_day: 160, booking_type: 'instant', is_active: true, walk_time_minutes: 3, map_marker_lat: -25.9890, map_marker_lng: 28.1270 },
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'Cluster B', bay_number: 'C-22', price_per_day: 170, booking_type: 'request', is_active: true, walk_time_minutes: 4, map_marker_lat: -25.9892, map_marker_lng: 28.1272 },
      { host_id: hostId, estate_id: estateId, cluster_or_street: 'Cluster C', bay_number: 'D-30', price_per_day: 140, booking_type: 'instant', is_active: true, walk_time_minutes: 7, map_marker_lat: -25.9895, map_marker_lng: 28.1275 },
    ])
    .select('id, cluster_or_street, bay_number, estate_id');

  if (listingError) {
    console.error('  ❌ Listings error:', listingError);
  } else {
    console.log(`  ✅ Created ${newListings?.length} listings:`);
    newListings?.forEach(l => console.log(`     ${l.id} - ${l.cluster_or_street} ${l.bay_number}`));

    // 5. Create bookings for demo renter
    console.log('\n4. Creating bookings for demo renter...');
    const listingIds = newListings?.map(l => l.id) || [];
    const estateBayListings = newListings?.filter(l => l.estate_id) || [];

    if (estateBayListings.length >= 3) {
      const { data: newBookings, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          // Completed booking 1
          { listing_id: estateBayListings[0].id, renter_id: renterId, guest_name: 'Kagiso Molefe', guest_phone: '+27 82 555 0000', guest_license_plate: 'GP 123 ABC', estate_name: 'Midrand Estate', cluster_or_street: estateBayListings[0].cluster_or_street, bay_number: estateBayListings[0].bay_number, start_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0], end_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], total_amount: 300, platform_fee: 45, host_payout: 255, status: 'completed', access_code: 'ACC12345' },
          // Completed booking 2 (no review)
          { listing_id: estateBayListings[1].id, renter_id: renterId, guest_name: 'Kagiso Molefe', guest_phone: '+27 82 555 0000', guest_license_plate: 'GP 123 ABC', estate_name: 'Midrand Estate', cluster_or_street: estateBayListings[1].cluster_or_street, bay_number: estateBayListings[1].bay_number, start_date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0], end_date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0], total_amount: 360, platform_fee: 54, host_payout: 306, status: 'completed', access_code: 'ACC67890' },
          // Completed booking 3 (no review)
          { listing_id: estateBayListings[2].id, renter_id: renterId, guest_name: 'Kagiso Molefe', guest_phone: '+27 82 555 0000', guest_license_plate: 'GP 123 ABC', estate_name: 'Waterkloof Heights', cluster_or_street: estateBayListings[2].cluster_or_street, bay_number: estateBayListings[2].bay_number, start_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], end_date: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0], total_amount: 400, platform_fee: 60, host_payout: 340, status: 'completed', access_code: 'ACC54321' },
          // Active booking
          { listing_id: estateBayListings[3]?.id || estateBayListings[0].id, renter_id: renterId, guest_name: 'Kagiso Molefe', guest_phone: '+27 82 555 0000', guest_license_plate: 'GP 123 ABC', estate_name: 'Midrand Estate', cluster_or_street: 'Cluster B', bay_number: 'C-20', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], total_amount: 320, platform_fee: 48, host_payout: 272, status: 'active', access_code: 'ACC98765' },
          // Pending booking
          { listing_id: estateBayListings[4]?.id || estateBayListings[1].id, renter_id: renterId, guest_name: 'Kagiso Molefe', guest_phone: '+27 82 555 0000', guest_license_plate: 'GP 123 ABC', estate_name: 'Midrand Estate', cluster_or_street: 'Cluster B', bay_number: 'C-22', start_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], total_amount: 340, platform_fee: 51, host_payout: 289, status: 'pending', access_code: null },
        ])
        .select('id, status');

      if (bookingError) {
        console.error('  ❌ Bookings error:', bookingError);
      } else {
        console.log(`  ✅ Created ${newBookings?.length} bookings:`);
        newBookings?.forEach(b => console.log(`     ${b.id} - ${b.status}`));
      }
    }
  }

  // 6. Verify
  console.log('\n5. Verifying...');
  const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
  const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
  console.log(`   Listings: ${listingsCount}`);
  console.log(`   Bookings: ${bookingsCount}`);

  console.log('\n🎉 Done! Demo data ready for E2E tests.');
  console.log('\n📋 Test credentials:');
  console.log('   Renter: renter@parkbuddy.co.za / renter123');
  console.log('   Host:   host@parkbuddy.co.za / host123');
  console.log('   Both:   both@parkbuddy.co.za / both123');
  console.log('\n⚠️  NOTE: Production database still needs full schema migration for:');
  console.log('   - reviews table (run schema.sql in Supabase Dashboard)');
  console.log('   - listings: listing_type, requires_id_verified_renter, address columns');
  console.log('   - users: id_document fields, id_verification_status, reset_password_token');
  console.log('   - bookings: start_time, end_time, deposit fields, house_rules');
  console.log('   - support_chats, support_messages, venues, venue_events tables');
}

cleanAndSeed();