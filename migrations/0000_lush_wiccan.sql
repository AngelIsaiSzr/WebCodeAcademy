CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"level" text NOT NULL,
	"category" text NOT NULL,
	"duration" integer NOT NULL,
	"modules" integer NOT NULL,
	"image" text NOT NULL,
	"featured" boolean DEFAULT false,
	"popular" boolean DEFAULT false,
	"new" boolean DEFAULT false,
	"instructor" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"order" integer NOT NULL,
	"difficulty" text NOT NULL,
	"instructor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"duration" integer NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text NOT NULL,
	"image" text NOT NULL,
	"linked_in" text,
	"github" text,
	"twitter" text,
	"instagram" text,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"course_name" text NOT NULL,
	"image" text NOT NULL,
	"text" text NOT NULL,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"profile_image" text,
	"bio" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;