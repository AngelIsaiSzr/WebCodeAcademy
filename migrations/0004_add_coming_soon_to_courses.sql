-- Add coming_soon column to courses table
ALTER TABLE "courses" ADD COLUMN "coming_soon" boolean DEFAULT false NOT NULL; 