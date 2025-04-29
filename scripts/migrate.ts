import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
console.log('Trying to connect to:', DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  console.log('Connected successfully!');
  
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

main().catch(console.error); 