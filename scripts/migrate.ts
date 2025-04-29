import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  const client = await pool.connect();
  try {
    const migrationPath = path.join(process.cwd(), 'migrations', '0000_lush_wiccan.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main(); 