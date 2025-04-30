import { 
  InsertUser, User, 
  InsertCourse, Course, 
  InsertEnrollment, Enrollment, 
  InsertModule, Module, 
  InsertSection, Section, 
  InsertTeam, Team, 
  InsertTestimonial, Testimonial,
  InsertContact, Contact,
  users, courses, enrollments, modules, sections, teams, testimonials, contacts
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import * as connectPgModule from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, desc, asc } from "drizzle-orm";

const connectPg = connectPgModule.default || connectPgModule;

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;

  // Courses
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  deleteCourse(id: number): Promise<boolean>;

  // Enrollments
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByUserId(userId: number): Promise<Enrollment[]>;
  getEnrollmentByCourseAndUser(courseId: number, userId: number): Promise<Enrollment | undefined>;
  updateEnrollmentProgress(id: number, progress: number, completed: boolean): Promise<Enrollment>;
  deleteEnrollment(id: number): Promise<boolean>;
  
  // Modules
  getModulesByCourseId(courseId: number): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, module: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: number): Promise<boolean>;

  // Sections
  getSectionsByModuleId(moduleId: number): Promise<Section[]>;
  getSection(id: number): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, section: Partial<InsertSection>): Promise<Section | undefined>;
  deleteSection(id: number): Promise<boolean>;

  // Team
  getAllTeamMembers(): Promise<Team[]>;
  createTeamMember(team: InsertTeam): Promise<Team>;
  updateTeamMember(id: number, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private modules: Map<number, Module>;
  private sections: Map<number, Section>;
  private teams: Map<number, Team>;
  private testimonials: Map<number, Testimonial>;
  private contacts: Map<number, Contact>;
  
  private currentUserIds: number;
  private currentCourseIds: number;
  private currentEnrollmentIds: number;
  private currentModuleIds: number;
  private currentSectionIds: number;
  private currentTeamIds: number;
  private currentTestimonialIds: number;
  private currentContactIds: number;

  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.modules = new Map();
    this.sections = new Map();
    this.teams = new Map();
    this.testimonials = new Map();
    this.contacts = new Map();
    
    this.currentUserIds = 1;
    this.currentCourseIds = 1;
    this.currentEnrollmentIds = 1;
    this.currentModuleIds = 1;
    this.currentSectionIds = 1;
    this.currentTeamIds = 1;
    this.currentTestimonialIds = 1;
    this.currentContactIds = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = { 
      ...user, 
      ...userUpdate 
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    if (!this.users.has(id)) {
      return false;
    }
    return this.users.delete(id);
  }

  // Courses
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(
      (course) => course.slug === slug,
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseIds++;
    const course: Course = { 
      ...insertCourse, 
      id,
      createdAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.featured
    );
  }

  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) {
      return undefined;
    }
    
    const updatedCourse: Course = { 
      ...course, 
      ...courseUpdate 
    };
    
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  
  async deleteCourse(id: number): Promise<boolean> {
    if (!this.courses.has(id)) {
      return false;
    }
    return this.courses.delete(id);
  }

  // Enrollments
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentIds++;
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id,
      createdAt: new Date()
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
  }

  async getEnrollmentByCourseAndUser(courseId: number, userId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      (enrollment) => enrollment.courseId === courseId && enrollment.userId === userId
    );
  }

  async updateEnrollmentProgress(id: number, progress: number, completed: boolean): Promise<Enrollment> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${id} not found`);
    }

    const updatedEnrollment = { ...enrollment, progress, completed };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    if (!this.enrollments.has(id)) {
      return false;
    }
    return this.enrollments.delete(id);
  }

  // Modules
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter((module) => module.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.currentModuleIds++;
    const module: Module = { ...insertModule, id };
    this.modules.set(id, module);
    return module;
  }

  async updateModule(id: number, moduleUpdate: Partial<InsertModule>): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (!module) {
      return undefined;
    }
    
    const updatedModule: Module = { 
      ...module, 
      ...moduleUpdate 
    };
    
    this.modules.set(id, updatedModule);
    return updatedModule;
  }
  
  async deleteModule(id: number): Promise<boolean> {
    if (!this.modules.has(id)) {
      return false;
    }
    return this.modules.delete(id);
  }

  // Sections
  async getSectionsByModuleId(moduleId: number): Promise<Section[]> {
    return Array.from(this.sections.values())
      .filter((section) => section.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  async getSection(id: number): Promise<Section | undefined> {
    return this.sections.get(id);
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const id = this.currentSectionIds++;
    const section: Section = { ...insertSection, id };
    this.sections.set(id, section);
    return section;
  }
  
  async updateSection(id: number, sectionUpdate: Partial<InsertSection>): Promise<Section | undefined> {
    const section = this.sections.get(id);
    if (!section) {
      return undefined;
    }
    
    const updatedSection: Section = { 
      ...section, 
      ...sectionUpdate 
    };
    
    this.sections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteSection(id: number): Promise<boolean> {
    if (!this.sections.has(id)) {
      return false;
    }
    return this.sections.delete(id);
  }

  // Team
  async getAllTeamMembers(): Promise<Team[]> {
    return Array.from(this.teams.values())
      .sort((a, b) => a.order - b.order);
  }

  async createTeamMember(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentTeamIds++;
    const team: Team = { ...insertTeam, id };
    this.teams.set(id, team);
    return team;
  }
  
  async updateTeamMember(id: number, teamUpdate: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) {
      return undefined;
    }
    
    const updatedTeam: Team = { 
      ...team, 
      ...teamUpdate 
    };
    
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    if (!this.teams.has(id)) {
      return false;
    }
    return this.teams.delete(id);
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialIds++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) {
      return undefined;
    }
    
    const updatedTestimonial: Testimonial = { 
      ...testimonial, 
      ...testimonialUpdate 
    };
    
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    if (!this.testimonials.has(id)) {
      return false;
    }
    return this.testimonials.delete(id);
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactIds++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Courses
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id));
    return course;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values({ ...insertCourse, createdAt: new Date() })
      .returning();
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.featured, true));
  }
  
  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set(courseUpdate)
      .where(eq(courses.id, id))
      .returning();
      
    return course;
  }
  
  async deleteCourse(id: number): Promise<boolean> {
    const result = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();
    return result.length > 0;
  }

  // Enrollments
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values({ ...insertEnrollment, createdAt: new Date() })
      .returning();
    return enrollment;
  }

  async getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
  }

  async getEnrollmentByCourseAndUser(courseId: number, userId: number): Promise<Enrollment | undefined> {
    const enrollmentResults = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
    
    const filtered = enrollmentResults.filter(
      enrollment => enrollment.userId === userId
    );
    
    return filtered.length > 0 ? filtered[0] : undefined;
  }

  async updateEnrollmentProgress(id: number, progress: number, completed: boolean): Promise<Enrollment> {
    const [enrollment] = await db
      .update(enrollments)
      .set({ progress, completed })
      .where(eq(enrollments.id, id))
      .returning();
    
    if (!enrollment) {
      throw new Error(`Enrollment with id ${id} not found`);
    }
    
    return enrollment;
  }
  
  async deleteEnrollment(id: number): Promise<boolean> {
    const result = await db
      .delete(enrollments)
      .where(eq(enrollments.id, id))
      .returning();
    return result.length > 0;
  }

  // Modules
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.order));
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db
      .select()
      .from(modules)
      .where(eq(modules.id, id));
    return module;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values(insertModule)
      .returning();
    return module;
  }
  
  async updateModule(id: number, moduleUpdate: Partial<InsertModule>): Promise<Module | undefined> {
    const [module] = await db
      .update(modules)
      .set(moduleUpdate)
      .where(eq(modules.id, id))
      .returning();
      
    return module;
  }
  
  async deleteModule(id: number): Promise<boolean> {
    const result = await db
      .delete(modules)
      .where(eq(modules.id, id))
      .returning();
    return result.length > 0;
  }

  // Sections
  async getSectionsByModuleId(moduleId: number): Promise<Section[]> {
    return await db
      .select()
      .from(sections)
      .where(eq(sections.moduleId, moduleId))
      .orderBy(asc(sections.order));
  }

  async getSection(id: number): Promise<Section | undefined> {
    const [section] = await db
      .select()
      .from(sections)
      .where(eq(sections.id, id));
    return section;
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const [section] = await db
      .insert(sections)
      .values(insertSection)
      .returning();
    return section;
  }
  
  async updateSection(id: number, sectionUpdate: Partial<InsertSection>): Promise<Section | undefined> {
    const [section] = await db
      .update(sections)
      .set(sectionUpdate)
      .where(eq(sections.id, id))
      .returning();
      
    return section;
  }
  
  async deleteSection(id: number): Promise<boolean> {
    const result = await db
      .delete(sections)
      .where(eq(sections.id, id))
      .returning();
    return result.length > 0;
  }

  // Team
  async getAllTeamMembers(): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .orderBy(asc(teams.order));
  }

  async createTeamMember(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(insertTeam)
      .returning();
    return team;
  }
  
  async updateTeamMember(id: number, teamUpdate: Partial<InsertTeam>): Promise<Team | undefined> {
    const [team] = await db
      .update(teams)
      .set(teamUpdate)
      .where(eq(teams.id, id))
      .returning();
      
    return team;
  }
  
  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db
      .delete(teams)
      .where(eq(teams.id, id))
      .returning();
    return result.length > 0;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(testimonialUpdate)
      .where(eq(testimonials.id, id))
      .returning();
      
    return testimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    return result.length > 0;
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values({ ...insertContact, createdAt: new Date() })
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }
}

export const storage = new DatabaseStorage();
