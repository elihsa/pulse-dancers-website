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

async function inspectSchema() {
  console.log('🔍 Inspecting production database schema...\n');

  const tables = ['users', 'estates', 'listings', 'bookings', 'reviews', 'saved_guests'];

  for (const table of tables) {
    console.log(`\n📋 Table: ${table}`);
    try {
      // Try to select one row to see columns
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
      } else {
        console.log(`   (empty table)`);
        // Try to get schema info
        const { data: schemaData, error: schemaError } = await supabase
          .rpc('get_table_columns', { table_name: table });
        if (!schemaError && schemaData) {
          console.log(`   Columns from RPC: ${JSON.stringify(schemaData)}`);
        }
      }
    } catch (err: any) {
      console.log(`   ❌ Exception: ${err.message}`);
    }
  }
}

inspectSchema();