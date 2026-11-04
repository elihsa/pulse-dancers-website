import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Database Migration Script
 * 
 * This script creates the database schema using direct PostgreSQL connection.
 * It requires a working DATABASE_URL in .env with a valid pooler connection string.
 * 
 * To get a working connection string:
 * 1. Go to Supabase Dashboard → Settings → Database
 * 2. Copy the "Transaction pooler" connection string (port 6543)
 * 3. Replace YOUR_PASSWORD with your actual database password
 * 4. Add to .env as DATABASE_URL
 * 
 * For runtime operations, the app uses Supabase REST API (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 */

async function migrate() {
  console.log('🚀 Starting database migration...\n');

  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not set in .env');
    console.log('\n📋 To set up:');
    console.log('1. Go to Supabase Dashboard → Settings → Database');
    console.log('2. Copy the "Transaction pooler" connection string');
    console.log('3. Replace YOUR_PASSWORD with your database password');
    console.log('4. Add to .env as DATABASE_URL=...');
    process.exit(1);
  }

  console.log('📡 Using DATABASE_URL for schema creation\n');
  
  const pool = new Pool({
    connectionString: dbUrl,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('📡 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!\n');

    console.log('📄 Reading schema.sql...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    console.log('✅ Schema file loaded\n');

    console.log('🔧 Creating tables and indexes...');
    await client.query(schema);
    console.log('✅ All tables created successfully!\n');

    console.log('🔍 Verifying tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('✅ Tables created:');
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    console.log('🌍 Checking estate data...');
    const estatesResult = await client.query('SELECT COUNT(*) FROM estates');
    const estateCount = parseInt(estatesResult.rows[0].count);
    console.log(`✅ ${estateCount} estates loaded\n`);

    if (estateCount > 0) {
      const sampleEstates = await client.query('SELECT name, city FROM estates LIMIT 5');
      console.log('Sample estates:');
      sampleEstates.rows.forEach((row) => {
        console.log(`   - ${row.name}, ${row.city}`);
      });
      console.log('');
    }

    // Also verify via Supabase REST API
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('🔍 Verifying via Supabase REST API...');
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      
      const { data: estates, error } = await supabase
        .from('estates')
        .select('name, city')
        .limit(5);
      
      if (error) {
        console.warn('⚠️  Supabase REST API verification failed:', error.message);
      } else {
        console.log('✅ Supabase REST API connection verified!');
        if (estates && estates.length > 0) {
          console.log('Sample estates via REST API:');
          estates.forEach((e: any) => console.log(`   - ${e.name}, ${e.city}`));
        }
      }
      console.log('');
    }

    client.release();
    console.log('🎉 Database migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Database: ${dbUrl.split('@')[1]?.split('/')[0]}`);
    console.log(`   - Tables: ${tablesResult.rows.length}`);
    console.log(`   - Estates: ${estateCount}`);
    console.log('');
    console.log('✅ Ready to start the server!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();