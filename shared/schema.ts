import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(),
  modules: integer("modules").notNull(),
  image: text("image").notNull(),
  instructor: text("instructor").notNull(),
  featured: boolean("featured").default(false),
  popular: boolean("popular").default(false),
  new: boolean("new").default(false),
  isLive: boolean("is_live").default(false),
  liveDetails: jsonb("live_details"),
  isDisabled: boolean("is_disabled").default(false),
  comingSoon: boolean("coming_soon").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  order: integer("order").notNull(),
  difficulty: text("difficulty").notNull(),
  instructor: text("instructor").notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  duration: integer("duration").notNull(),
  order: integer("order").notNull(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  linkedIn: text("linked_in"),
  github: text("github"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  order: integer("order").notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseName: text("course_name").notNull(),
  image: text("image").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  order: integer("order").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const liveCourseRegistrations = pgTable("live_course_registrations", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  age: integer("age").notNull(),
  guardianFirstName: text("guardian_first_name"),
  guardianLastName: text("guardian_last_name"),
  guardianPhoneNumber: text("guardian_phone_number"),
  preferredModality: text("preferred_modality", { enum: ["Presencial", "Virtual"] }).notNull(),
  hasLaptop: boolean("has_laptop").notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertSectionSchema = createInsertSchema(sections).omit({
  id: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertContactSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido"
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido"
  }),
  message: z.string().min(1, {
    message: "El mensaje es requerido"
  })
});

export const insertLiveCourseRegistrationSchema = createInsertSchema(liveCourseRegistrations).omit({
  id: true,
  registeredAt: true,
});

// Types for insertion
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertLiveCourseRegistration = z.infer<typeof insertLiveCourseRegistrationSchema>;

// Types for selection
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type LiveCourseRegistration = typeof liveCourseRegistrations.$inferSelect;
