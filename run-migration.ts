import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

async function runMigration() {
  console.log('🔄 Attempting to run schema migration on Supabase...\n');

  // Read the schema file
  const schema = readFileSync('./backend/database/schema.sql', 'utf-8');

  // Split by semicolon and execute each statement
  // Note: This is a best-effort approach - DDL via REST API has limitations
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (stmt.trim() === '') continue;

    // Skip DO $$ blocks for now (they need special handling)
    if (stmt.includes('DO $$')) {
      console.log(`  ⏭️  Statement ${i + 1}: Skipping DO $$ block (needs Dashboard)`);
      continue;
    }

    try {
      // Try to execute via a raw SQL approach
      // Supabase doesn't support raw DDL via REST directly
      // This will likely fail but let's try
      const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' });
      
      if (error) {
        // Check if it's a "function not found" error vs actual SQL error
        if (error.message.includes('function') || error.message.includes('exec_sql')) {
          console.log(`  ⚠️  Statement ${i + 1}: Cannot execute DDL via REST API (exec_sql not available)`);
          console.log(`      → Run full schema.sql in Supabase Dashboard → SQL Editor`);
          break; // Stop trying, all will fail
        } else {
          console.log(`  ❌ Statement ${i + 1}: ${error.message.substring(0, 100)}`);
          failCount++;
        }
      } else {
        console.log(`  ✅ Statement ${i + 1} executed`);
        successCount++;
      }
    } catch (err: any) {
      if (err.message.includes('exec_sql')) {
        console.log(`  ⚠️  Cannot execute DDL via REST API - exec_sql function not available`);
        console.log(`      → Please run schema.sql in Supabase Dashboard → SQL Editor`);
        break;
      }
      console.log(`  ❌ Statement ${i + 1}: ${err.message.substring(0, 100)}`);
      failCount++;
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${failCount} failed`);
  console.log('\n📋 NEXT STEP REQUIRED:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/vdpdifxoihailmmuzwrb/sql');
  console.log('   2. Copy the ENTIRE contents of backend/database/schema.sql');
  console.log('   3. Paste into the SQL Editor');
  console.log('   4. Click "Run"');
  console.log('\n   This will create:');
  console.log('   - reviews table + RLS policies');
  console.log('   - listings: listing_type, requires_id_verified_renter, address columns, etc.');
  console.log('   - users: id_document fields, id_verification_status, reset_password_token');
  console.log('   - bookings: start_time, end_time, deposit fields, house_rules, etc.');
  console.log('   - support_chats, support_messages, venues, venue_events tables');
  console.log('\n   After migration, run: npx tsx seed-demo-data.ts');
}

runMigration();