import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
});

console.log('✅ Supabase client initialized');

// Backward compatibility - throw helpful errors
export const query = async (text: string, params?: any[]) => {
  throw new Error('Use supabase client directly instead of query() function');
};

export const getPool = async () => {
  throw new Error('Use supabase client directly instead of getPool()');
};

export default {
  supabase,
};