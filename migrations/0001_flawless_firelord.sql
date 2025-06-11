CREATE TABLE "live_course_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" integer,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"age" integer NOT NULL,
	"guardian_name" text,
	"guardian_phone_number" text,
	"preferred_modality" text NOT NULL,
	"has_laptop" boolean NOT NULL,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_live" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "live_details" jsonb;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD CONSTRAINT "live_course_registrations_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD CONSTRAINT "live_course_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;