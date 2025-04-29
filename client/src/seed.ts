// En tu archivo seed.ts - Ejecutar con: npx tsx client/src/seed.ts
import { db } from 'server/db';
import { users, courses, teams, testimonials, modules, sections } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { initialUsers } from './data/users';
import { initialCourses, pythonModules, pythonSections } from './data/courses';
import { initialTeam } from './data/team';
import { initialTestimonials } from './data/testimonials';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('🌱 Comenzando el proceso de seeding...');
    
    // Primero eliminamos todos los registros existentes
    console.log('🗑️ Eliminando registros existentes...');
    await db.delete(sections);
    await db.delete(modules);
    await db.delete(testimonials);
    await db.delete(teams);
    await db.delete(courses);
    await db.delete(users);
    console.log('✅ Registros eliminados correctamente');

    // Reiniciamos las secuencias de IDs
    console.log('🔄 Reiniciando secuencias de IDs...');
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE courses_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE teams_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE testimonials_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE modules_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE sections_id_seq RESTART WITH 1`);
    console.log('✅ Secuencias reiniciadas correctamente');
    
    // Procesa los usuarios y hashea sus contraseñas
    if (initialUsers.length > 0) {
      console.log(`Procesando ${initialUsers.length} usuarios...`);
      
      // Hashea las contraseñas de los usuarios
      const saltRounds = 10;
      const usersWithHashedPasswords = await Promise.all(
        initialUsers.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          console.log('Contraseña hasheada para usuario:', user.email, hashedPassword);
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
    if (pythonModules.length > 0) {
      console.log(`Insertando ${pythonModules.length} módulos...`);
      await db.insert(modules).values(pythonModules);
      console.log('✅ Módulos insertados correctamente');
    }

    // Inserta secciones
    if (pythonSections.length > 0) {
      console.log(`Insertando ${pythonSections.length} secciones...`);
      await db.insert(sections).values(pythonSections);
      console.log('✅ Secciones insertadas correctamente');
    }
    
    console.log('🎉 Seeding completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el proceso de seeding:', error);
    process.exit(1);
  }
}

// Ejecuta la función de seeding
seed();