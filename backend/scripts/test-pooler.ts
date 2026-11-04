import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Test script to find working pooler region
const regions = [
  'us-east-1',
  'us-west-2',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'sa-east-1',
];

// The password from DATABASE_URL (with @ URL-encoded)
const password = '***@parking123'; // Replace with actual password
const encodedPassword = encodeURIComponent(password);
const projectId = 'vdpdifxoihailmmuzwrb';

async function testRegion(region: string) {
  const poolerUrl = `postgresql://postgres:${encodedPassword}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  
  const pool = new Pool({
    connectionString: poolerUrl,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool.end();
    console.log(`✅ ${region}: Connected successfully!`);
    console.log(`   Pool URL: ${poolerUrl.replace(encodedPassword, '***')}`);
    return { region, url: poolerUrl, success: true };
  } catch (error: any) {
    await pool.end();
    console.log(`❌ ${region}: ${error.code || error.message}`);
    return { region, url: poolerUrl, success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Testing Supabase pooler regions...\n');
  console.log(`Project ID: ${projectId}`);
  console.log(`Password (encoded): ${encodedPassword}\n`);

  for (const region of regions) {
    const result = await testRegion(region);
    if (result.success) {
      console.log(`\n🎉 Found working region: ${region}`);
      console.log(`\nAdd this to your .env:`);
      console.log(`DATABASE_URL=${result.url}`);
      console.log(`\nOr use the session pooler (port 5432):`);
      const sessionUrl = result.url.replace(':6543/', ':5432/');
      console.log(`DATABASE_URL=${sessionUrl}`);
      break;
    }
  }
}

main().catch(console.error);