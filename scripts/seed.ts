// En tu archivo seed.ts - Ejecutar con: npx tsx scripts/seed.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { users, courses, teams, testimonials, modules, sections, contacts, enrollments } from '../shared/schema'; // Asegúrate de importar enrollments
import { initialUsers } from '../client/src/data/users';
import { initialCourses, webDevModules, webDevSections } from '../client/src/data/courses';
import { initialTeam } from '../client/src/data/team';
import { initialTestimonials } from '../client/src/data/testimonials';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool);

async function seed() {
  try {
    console.log('🌱 Comenzando el proceso de seeding...');

    // Primero eliminamos todos los registros existentes
    console.log('🗑️ Eliminando registros existentes...');
    await db.delete(enrollments);
    await db.delete(sections);
    await db.delete(modules);
    await db.delete(testimonials);
    await db.delete(teams);
    await db.delete(courses);
    await db.delete(users);
    await db.delete(contacts);
    console.log('✅ Registros eliminados correctamente');

    // Reiniciamos las secuencias de IDs
    console.log('🔄 Reiniciando secuencias de IDs...');
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE courses_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE teams_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE testimonials_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE modules_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE sections_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE contacts_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE enrollments_id_seq RESTART WITH 1`);
    console.log('✅ Secuencias reiniciadas correctamente');

    // Procesa los usuarios y hashea sus contraseñas
    if (initialUsers.length > 0) {
      console.log(`Procesando ${initialUsers.length} usuarios...`);

      // Hashea las contraseñas de los usuarios
      const saltRounds = 10;
      const usersWithHashedPasswords = await Promise.all(
        initialUsers.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          console.log('Contraseña hasheada para usuario:', user.email);
          return {
            ...user,
            password: hashedPassword
          };
        })
      );

      console.log('Insertando usuarios con contraseñas hasheadas...');
      await db.insert(users).values(usersWithHashedPasswords);
      console.log('✅ Usuarios insertados correctamente');
    }

    // Inserta cursos
    if (initialCourses.length > 0) {
      console.log(`Insertando ${initialCourses.length} cursos...`);
      await db.insert(courses).values(initialCourses);
      console.log('✅ Cursos insertados correctamente');
    }

    // Inserta equipo
    if (initialTeam.length > 0) {
      console.log(`Insertando ${initialTeam.length} miembros del equipo...`);
      await db.insert(teams).values(initialTeam);
      console.log('✅ Miembros del equipo insertados correctamente');
    }

    // Inserta testimonios
    if (initialTestimonials.length > 0) {
      console.log(`Insertando ${initialTestimonials.length} testimonios...`);
      await db.insert(testimonials).values(initialTestimonials);
      console.log('✅ Testimonios insertados correctamente');
    }

    // Inserta módulos
    if (webDevModules.length > 0) {
      console.log(`Insertando ${webDevModules.length} módulos...`);
      await db.insert(modules).values(webDevModules);
      console.log('✅ Módulos insertados correctamente');
    }

    // Inserta secciones
    if (webDevSections.length > 0) {
      console.log(`Insertando ${webDevSections.length} secciones...`);
      await db.insert(sections).values(webDevSections);
      console.log('✅ Secciones insertadas correctamente');
    }

    console.log('🎉 Seeding completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seeding:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecuta la función de seeding
seed().catch((error) => {
  console.error('Error fatal durante el seeding:', error);
  process.exit(1);
});