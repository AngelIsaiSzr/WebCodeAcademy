import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config();

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Necesario para Render
    }
  });

  const db = drizzle(pool);

  console.log('⏳ Pushing schema changes to database...');

  const start = Date.now();
  
  await db.execute(sql`
    ALTER TABLE courses 
    ADD COLUMN IF NOT EXISTS is_live boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS live_details jsonb,
    ADD COLUMN IF NOT EXISTS is_disabled boolean DEFAULT false;

    ALTER TABLE testimonials 
    ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 1;

    WITH numbered_testimonials AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
      FROM testimonials
    )
    UPDATE testimonials
    SET "order" = numbered_testimonials.row_num
    FROM numbered_testimonials
    WHERE testimonials.id = numbered_testimonials.id;
  `);
  
  const end = Date.now();

  console.log(`✅ Schema changes completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Schema update failed');
  console.error(err);
  process.exit(1);
}); 