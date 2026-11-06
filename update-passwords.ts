import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});

async function updatePasswords() {
  console.log('🔐 Updating demo user passwords...\n');

  const updates = [
    { id: '11111111-1111-1111-1111-111111111111', email: 'renter@parkbuddy.co.za', password: '$2b$10$MZdk6nwLCvu6Zw2knyr5Qu1tr6/RJ9FSUCZgXC.kleMLEPvlrLS0i' },
    { id: '22222222-2222-2222-2222-222222222222', email: 'host@parkbuddy.co.za', password: '$2b$10$ZaYYD5/qg6FcrLH6LMQ7m.VFRvI.9GhnZlI5fOmHnjCPNRIfweKFm' },
    { id: '33333333-3333-3333-3333-333333333333', email: 'both@parkbuddy.co.za', password: '$2b$10$w3klh4Qjh/8aC6xpfpvW3.p34iXd6IAA6lJ1iyQkz26CKzEA51iky' },
  ];

  for (const u of updates) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash: u.password })
      .eq('id', u.id);
    
    if (error) {
      console.error(`❌ ${u.email}:`, error);
    } else {
      console.log(`✅ ${u.email} password updated`);
    }
  }

  // Test login
  console.log('\n🧪 Testing login...');
  const testLogin = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  };

  const renterResult = await testLogin('renter@parkbuddy.co.za', 'renter123');
  console.log('Renter login:', renterResult.message || renterResult.error);

  const hostResult = await testLogin('host@parkbuddy.co.za', 'host123');
  console.log('Host login:', hostResult.message || hostResult.error);

  const bothResult = await testLogin('both@parkbuddy.co.za', 'both123');
  console.log('Both login:', bothResult.message || bothResult.error);
}

updatePasswords();