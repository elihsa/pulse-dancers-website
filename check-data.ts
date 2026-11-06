import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});

async function checkData() {
  console.log('🔍 Checking existing data...\n');

  // Check users
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name, role, id_verified')
    .in('email', ['renter@parkbuddy.co.za', 'host@parkbuddy.co.za', 'both@parkbuddy.co.za']);

  console.log('👥 Demo Users:');
  if (userError) {
    console.error('  Error:', userError);
  } else {
    users?.forEach(u => console.log(`  ${u.email} (${u.id}) - ${u.full_name} - ${u.role} - verified: ${u.id_verified}`));
  }

  // Check all users
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, email, full_name, role');
  console.log(`\n📊 Total users: ${allUsers?.length}`);
  allUsers?.forEach(u => console.log(`  ${u.email} (${u.id}) - ${u.full_name} - ${u.role}`));

  // Check listings
  const { data: listings } = await supabase
    .from('listings')
    .select('id, host_id, cluster_or_street, bay_number, estate_id, price_per_day');
  console.log(`\n🏠 Listings (${listings?.length}):`);
  listings?.forEach(l => console.log(`  ${l.id} - host: ${l.host_id} - ${l.cluster_or_street} ${l.bay_number} - R${l.price_per_day}/day`));

  // Check estates
  const { data: estates } = await supabase
    .from('estates')
    .select('id, name, city');
  console.log(`\n🏘️ Estates (${estates?.length}):`);
  estates?.forEach(e => console.log(`  ${e.id} - ${e.name}, ${e.city}`));

  // Check bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, listing_id, renter_id, status, guest_name');
  console.log(`\n📅 Bookings (${bookings?.length}):`);
  bookings?.forEach(b => console.log(`  ${b.id} - listing: ${b.listing_id} - renter: ${b.renter_id} - ${b.status} - ${b.guest_name}`));
}

checkData();