import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const updateLiveRegistrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  console.log('🔌 Intentando conectar a la base de datos...');
  console.log('📝 URL de la base de datos:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Oculta la contraseña en los logs

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    // Agregar timeouts más largos
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
  });

  try {
    console.log('⏳ Actualizando estructura de la tabla live_course_registrations...');

    // Primero, verificar si la tabla existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'live_course_registrations'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('❌ La tabla live_course_registrations no existe');
      return;
    }

    // Obtener la estructura actual de la tabla
    const currentColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'live_course_registrations';
    `);
    console.log('📊 Columnas actuales:', currentColumns.rows.map(r => r.column_name));

    // Actualizar la estructura de la tabla
    await pool.query(`
      DO $$ 
      BEGIN
        -- Eliminar columnas antiguas si existen
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'full_name'
        ) THEN
          ALTER TABLE "live_course_registrations" DROP COLUMN "full_name";
        END IF;

        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'guardian_name'
        ) THEN
          ALTER TABLE "live_course_registrations" DROP COLUMN "guardian_name";
        END IF;

        -- Agregar nuevas columnas si no existen
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'first_name'
        ) THEN
          ALTER TABLE "live_course_registrations" ADD COLUMN "first_name" text;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'last_name'
        ) THEN
          ALTER TABLE "live_course_registrations" ADD COLUMN "last_name" text;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'guardian_first_name'
        ) THEN
          ALTER TABLE "live_course_registrations" ADD COLUMN "guardian_first_name" text;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'live_course_registrations' 
          AND column_name = 'guardian_last_name'
        ) THEN
          ALTER TABLE "live_course_registrations" ADD COLUMN "guardian_last_name" text;
        END IF;
      END $$;
    `);

    // Verificar la nueva estructura
    const newColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'live_course_registrations';
    `);
    console.log('📊 Nuevas columnas:', newColumns.rows.map(r => r.column_name));

    console.log('✅ Estructura actualizada exitosamente');
  } catch (err) {
    console.error('❌ Error al actualizar la estructura:', err);
    throw err;
  } finally {
    await pool.end();
  }
};

// Ejecutar la actualización
updateLiveRegistrations().catch(console.error); 