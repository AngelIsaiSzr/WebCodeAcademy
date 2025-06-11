import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const updateSchema = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('⏳ Actualizando esquema de la base de datos...');

    // Agregar columnas a la tabla courses si no existen
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'courses' 
          AND column_name = 'is_live'
        ) THEN
          ALTER TABLE courses ADD COLUMN is_live boolean DEFAULT false;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'courses' 
          AND column_name = 'live_details'
        ) THEN
          ALTER TABLE courses ADD COLUMN live_details jsonb;
        END IF;
      END $$;
    `);

    // Crear tabla live_course_registrations si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_course_registrations (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        age INTEGER NOT NULL,
        guardian_name TEXT,
        guardian_phone_number TEXT,
        preferred_modality TEXT NOT NULL CHECK (preferred_modality IN ('Presencial', 'Virtual')),
        has_laptop BOOLEAN NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Esquema actualizado exitosamente');
  } catch (err) {
    console.error('❌ Error al actualizar el esquema:', err);
    throw err;
  } finally {
    await pool.end();
  }
};

updateSchema().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
}); 