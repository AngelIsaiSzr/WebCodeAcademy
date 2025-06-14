ALTER TABLE "courses" ADD COLUMN "is_disabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD COLUMN "guardian_first_name" text;--> statement-breakpoint
ALTER TABLE "live_course_registrations" ADD COLUMN "guardian_last_name" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "live_course_registrations" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "live_course_registrations" DROP COLUMN "guardian_name";