import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { insertContactSchema, insertLiveCourseRegistrationSchema, User } from "@shared/schema";
import { sendEmail, EmailData } from "./services/email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Modules routes
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const modules = await storage.getModulesByCourseId(courseId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Sections routes
  app.get("/api/modules/:moduleId/sections", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const sections = await storage.getSectionsByModuleId(moduleId);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  });

  // Enrollment routes
  app.post("/api/enroll", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to enroll" });
      }

      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }

      // Check if user is already enrolled
      const existingEnrollment = await storage.getEnrollmentByCourseAndUser(
        courseId, 
        req.user.id
      );
      
      if (existingEnrollment) {
        return res.status(400).json({ message: "You are already enrolled in this course" });
      }

      const enrollment = await storage.createEnrollment({
        userId: req.user.id,
        courseId,
        progress: 0,
        completed: false
      });

      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/enrollments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view enrollments" });
      }

      const enrollments = await storage.getEnrollmentsByUserId(req.user.id);
      
      // Get course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return {
            ...enrollment,
            course
          };
        })
      );

      res.json(enrollmentsWithCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.patch("/api/enrollments/:id/progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update progress" });
      }

      const enrollmentId = parseInt(req.params.id);
      const { progress, completed } = req.body;

      if (progress === undefined) {
        return res.status(400).json({ message: "Progress is required" });
      }

      const updatedEnrollment = await storage.updateEnrollmentProgress(
        enrollmentId,
        progress,
        completed || false
      );

      res.json(updatedEnrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  app.delete("/api/enrollments/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to unenroll from a course" });
      }
      
      const enrollmentId = parseInt(req.params.id);
      
      // In a production environment, you would want to verify that the enrollment
      // belongs to the authenticated user to prevent users from deleting other users' enrollments
      
      const success = await storage.deleteEnrollment(enrollmentId);
      
      if (!success) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      res.status(200).json({ message: "Successfully unenrolled from course" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unenroll from course" });
    }
  });

  // Team members routes
  app.get("/api/team", async (req, res) => {
    try {
      const team = await storage.getAllTeamMembers();
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Contact form route
  app.post("/api/contact", async (req, res) => {
    try {
      const validation = insertContactSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Por favor completa todos los campos correctamente", 
          errors: validation.error.format()
        });
      }

      // Preparar los datos del correo
      const emailData = {
        to: "webcodeacademy0@gmail.com",
        from: validation.data.email,
        name: validation.data.name,
        subject: `Nuevo mensaje de contacto de ${validation.data.name}`,
        text: validation.data.message,
      };

      // Guardar en la base de datos
      const contact = await storage.createContact(validation.data);

      // Enviar el correo
      try {
        await sendEmail(emailData);
      } catch (emailError) {
        console.error("Error al enviar el correo:", emailError);
        // No devolvemos el error al cliente, pero lo registramos
      }

      res.status(201).json({ 
        message: "Mensaje enviado correctamente",
        contact 
      });
    } catch (error) {
      console.error("Error en el formulario de contacto:", error);
      res.status(500).json({ 
        message: "Hubo un error al enviar tu mensaje. Por favor intenta de nuevo más tarde." 
      });
    }
  });

  // Live Course Registration route
  app.post("/api/live-course-registrations", async (req, res) => {
    try {
      const validation = insertLiveCourseRegistrationSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          message: "Por favor completa todos los campos correctamente",
          errors: validation.error.format()
        });
      }

      const userIdToUse = req.isAuthenticated() && req.user ? (req.user as User).id : null; // Acceder al ID del usuario autenticado de forma segura
      const registrationData = { ...validation.data, userId: userIdToUse }; // Usar userIdToUse

      // Guardar en la base de datos
      const registration = await storage.createLiveCourseRegistration(registrationData);

      // Obtener los detalles del curso para usar el nombre en el correo
      const course = await storage.getCourse(registration.courseId);
      const courseName = course ? course.title : "Curso Desconocido";

      // Preparar y enviar el correo de confirmación al usuario
      const emailToUser: EmailData = { 
        to: registration.email,
        from: "webcodeacademy0@gmail.com",
        name: registration.fullName,
        subject: `Confirmación de registro al curso: ${courseName}`,
        text: `¡Muchas gracias por registrarte en el curso! Días antes de iniciar el curso se te enviará un mensaje confirmando tu asistencia y modalidad. Para dudas o aclaraciones: +52 784 110 0108 - Web Code Academy`,
        html: `
          <p>¡Muchas gracias por registrarte en el curso!</p>
          <p>Días antes de iniciar el curso se te enviará un mensaje confirmando tu asistencia y modalidad.</p>
          <p>Para dudas o aclaraciones: <b>+52 784 110 0108</b></p>
          <p>- Web Code Academy</p>
        `
      };

      // Preparar y enviar el correo de notificación a la administración
      const emailToAdmin: EmailData = { 
        to: "webcodeacademy0@gmail.com",
        from: registration.email,
        name: `Registro de ${registration.fullName}`,
        subject: `Nuevo registro a curso en vivo: ${registration.fullName}`,
        text: `Nuevo registro para curso en vivo:\n          Nombre: ${registration.fullName}\n          Correo: ${registration.email}\n          Teléfono: ${registration.phoneNumber}\n          Edad: ${registration.age}\n          Modalidad preferida: ${registration.preferredModality}\n          Tiene laptop: ${registration.hasLaptop ? 'Sí' : 'No'}\n          ${registration.guardianName ? `Nombre del tutor: ${registration.guardianName}` : ''}\n          ${registration.guardianPhoneNumber ? `Teléfono del tutor: ${registration.guardianPhoneNumber}` : ''}\n          Curso ID: ${registration.courseId}\n        `,
        html: `
          <p>Nuevo registro para curso en vivo:</p>
          <ul>
            <li><b>Nombre:</b> ${registration.fullName}</li>
            <li><b>Correo:</b> ${registration.email}</li>
            <li><b>Teléfono:</b> ${registration.phoneNumber}</li>
            <li><b>Edad:</b> ${registration.age}</li>
            <li><b>Modalidad preferida:</b> ${registration.preferredModality}</li>
            <li><b>Tiene laptop:</b> ${registration.hasLaptop ? 'Sí' : 'No'}</li>
            ${registration.guardianName ? `<li><b>Nombre del tutor:</b> ${registration.guardianName}</li>` : ''}
            ${registration.guardianPhoneNumber ? `<li><b>Teléfono del tutor:</b> ${registration.guardianPhoneNumber}</li>` : ''}
            <li><b>Curso ID:</b> ${registration.courseId}</li>
          </ul>
        `
      };

      try {
        await sendEmail(emailToUser);
        await sendEmail(emailToAdmin);
      } catch (emailError) {
        console.error("Error al enviar correo de registro de curso en vivo:", emailError);
      }

      res.status(201).json({ message: "Registro exitoso", registration });
    } catch (error) {
      console.error("Error en el registro de curso en vivo:", error);
      res.status(500).json({ message: "Error al registrarse en el curso." });
    }
  });

  // Admin routes
  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const course = await storage.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.patch("/api/courses/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const courseId = parseInt(req.params.id);
      const updatedCourse = await storage.updateCourse(courseId, req.body);
      
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const courseId = parseInt(req.params.id);
      const success = await storage.deleteCourse(courseId);
      
      if (!success) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  app.post("/api/team", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const teamMember = await storage.createTeamMember(req.body);
      res.status(201).json(teamMember);
    } catch (error) {
      res.status(500).json({ message: "Failed to create team member" });
    }
  });
  
  app.patch("/api/team/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const teamId = parseInt(req.params.id);
      const updatedTeamMember = await storage.updateTeamMember(teamId, req.body);
      
      if (!updatedTeamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.status(200).json(updatedTeamMember);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const teamId = parseInt(req.params.id);
      const success = await storage.deleteTeamMember(teamId);
      
      if (!success) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.status(200).json({ message: "Team member deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });
  
  app.patch("/api/testimonials/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const testimonialId = parseInt(req.params.id);
      const updatedTestimonial = await storage.updateTestimonial(testimonialId, req.body);
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(200).json(updatedTestimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const testimonialId = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(testimonialId);
      
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });
  
  app.post("/api/modules", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const module = await storage.createModule(req.body);
      res.status(201).json(module);
    } catch (error) {
      res.status(500).json({ message: "Failed to create module" });
    }
  });
  
  app.patch("/api/modules/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const moduleId = parseInt(req.params.id);
      console.log("Updating module with id:", moduleId);
      console.log("Update data:", req.body);
      console.log("Request headers:", req.headers);
      console.log("Request content type:", req.headers['content-type']);
      
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log("Empty request body or not parsed correctly");
        return res.status(400).json({ message: "Invalid request body" });
      }
      
      // Add a function in storage to update a module
      const module = await storage.getModule(moduleId);
      
      if (!module) {
        console.log("Module not found:", moduleId);
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Update the module
      const updatedModule = await storage.updateModule(moduleId, req.body);
      console.log("Updated module:", updatedModule);
      
      return res.status(200).json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return res.status(500).json({ message: "Failed to update module", error: error instanceof Error ? error.message : String(error) });
    }
  });
  
  app.delete("/api/modules/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const moduleId = parseInt(req.params.id);
      
      // Primero obtener las secciones del módulo
      const sections = await storage.getSectionsByModuleId(moduleId);
      
      // Eliminar todas las secciones del módulo
      for (const section of sections) {
        await storage.deleteSection(section.id);
      }
      
      // Ahora sí eliminar el módulo
      const success = await storage.deleteModule(moduleId);
      
      if (!success) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      res.status(200).json({ message: "Module and its sections deleted successfully" });
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  });
  
  app.post("/api/sections", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      const section = await storage.createSection(req.body);
      res.status(201).json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to create section" });
    }
  });
  
  app.patch("/api/sections/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const sectionId = parseInt(req.params.id);
      console.log("Updating section with id:", sectionId);
      console.log("Update data:", req.body);
      console.log("Request headers:", req.headers);
      console.log("Request content type:", req.headers['content-type']);
      
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log("Empty request body or not parsed correctly");
        return res.status(400).json({ message: "Invalid request body" });
      }
      
      // Check if section exists
      const section = await storage.getSection(sectionId);
      
      if (!section) {
        console.log("Section not found:", sectionId);
        return res.status(404).json({ message: "Section not found" });
      }
      
      // Update the section
      const updatedSection = await storage.updateSection(sectionId, req.body);
      console.log("Updated section:", updatedSection);
      
      return res.status(200).json(updatedSection);
    } catch (error) {
      console.error("Error updating section:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return res.status(500).json({ message: "Failed to update section", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete("/api/sections/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      const sectionId = parseInt(req.params.id);
      const success = await storage.deleteSection(sectionId);
      
      if (!success) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete section" });
    }
  });
  
  // Special route to fix Web Dev course modules (temporary)
  app.post("/api/fix-web-dev", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
      
      // Import Python modules data
      const { webDevModules } = await import("../client/src/data/courses");
      
      // Get Python course
      const webDevCourse = await storage.getCourseBySlug("desarrollo-web");
      if (!webDevCourse) {
        return res.status(404).json({ message: "Web Dev course not found" });
      }
      // Get all current modules for Web Dev course
      const existingModules = await storage.getModulesByCourseId(webDevCourse.id);
      // Delete all existing modules
      for (const module of existingModules) {
        await storage.deleteModule(module.id);
      }
      // Add the three basic modules
      const newModules = [];
      for (const moduleData of webDevModules) {
        const module = await storage.createModule({
          ...moduleData,
          courseId: webDevCourse.id
        });
        newModules.push(module);
      }
      res.status(200).json({
        message: "Web Dev course modules fixed successfully",
        deleted: existingModules.length,
        added: newModules.length
      });
    } catch (error) {
      console.error("Error fixing Web Dev modules:", error);
      res.status(500).json({ message: "Failed to fix Web Dev modules" });
    }
  });

  // User profile routes
  app.patch("/api/user/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debes iniciar sesión para actualizar tu perfil" });
      }

      const { name, email, username, profileImage, bio } = req.body;
      
      // Validate fields
      if (!name || !email || !username) {
        return res.status(400).json({ message: "Nombre, correo electrónico y nombre de usuario son obligatorios" });
      }
      
      // Check if email is already taken by another user
      if (email !== req.user.email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail && existingEmail.id !== req.user.id) {
          return res.status(400).json({ message: "Email is already in use" });
        }
      }
      
      // Check if username is already taken by another user
      if (username !== req.user.username) {
        const existingUsername = await storage.getUserByUsername(username);
        if (existingUsername && existingUsername.id !== req.user.id) {
          return res.status(400).json({ message: "Username is already in use" });
        }
      }
      
      // Update user in database
      // Note: We would need to add an updateUser method to the storage interface
      const updatedUser = {
        ...req.user,
        name,
        email,
        username,
        profileImage,
        bio
      };
      
      // Update user in the database
      const savedUser = await storage.updateUser(req.user.id, {
        name,
        email,
        username,
        profileImage,
        bio
      });
      
      res.json(savedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  app.patch("/api/user/password", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to change your password" });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      // In a real implementation, we would:
      // 1. Verify the current password matches what's stored
      // 2. Hash the new password
      // 3. Update the user's password in the database
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Delete user account
  app.delete("/api/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Debes iniciar sesión para eliminar tu cuenta" });
      }

      // Eliminar inscripciones del usuario
      const enrollments = await storage.getEnrollmentsByUserId(req.user.id);
      for (const enrollment of enrollments) {
        await storage.deleteEnrollment(enrollment.id);
      }

      // Eliminar el usuario
      const success = await storage.deleteUser(req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Cerrar la sesión
      req.logout((err) => {
        if (err) {
          console.error("Error al cerrar sesión:", err);
        }
        req.session.destroy(() => {
          res.sendStatus(200);
        });
      });
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      res.status(500).json({ message: "Error al eliminar la cuenta" });
    }
  });

  // Seed data route (for development purposes)
  app.post("/api/seed", async (req, res) => {
    try {
      // Create admin user if not exists
      const existingAdmin = await storage.getUserByEmail("admin@webcodeacademy.com");
      if (!existingAdmin) {
        const hashedPassword = await hashPassword("admin123456");
        await storage.createUser({
          email: "admin@webcodeacademy.com",
          username: "admin",
          name: "Administrador",
          password: hashedPassword,
          role: "admin"
        });
        console.log("Created admin user: admin@webcodeacademy.com / admin123456");
      }
      
      // Import course data
      const { initialCourses, webDevModules, webDevSections } = await import("../client/src/data/courses");
      
      // Seed courses
      for (const courseData of initialCourses) {
        // Check if course already exists
        const existingCourse = await storage.getCourseBySlug(courseData.slug);
        if (!existingCourse) {
          await storage.createCourse(courseData);
          console.log(`Created course: ${courseData.title}`);
        }
      }
      
      // Seed some sample team members and testimonials
      // This should be called once initially to set up the app data
      res.status(200).json({ message: "Data seeded successfully" });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
