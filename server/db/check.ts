import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const checkConnection = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Necesario para Render
    }
  });

  try {
    const db = drizzle(pool);
    console.log('⏳ Checking database connection...');
    
    // Intentar una consulta simple
    await pool.query('SELECT NOW()');
    
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed');
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

checkConnection(); 