-- Actualizar la estructura de la tabla live_course_registrations
ALTER TABLE "live_course_registrations" 
  DROP COLUMN IF EXISTS "full_name",
  DROP COLUMN IF EXISTS "guardian_name",
  ADD COLUMN IF NOT EXISTS "first_name" text NOT NULL,
  ADD COLUMN IF NOT EXISTS "last_name" text NOT NULL,
  ADD COLUMN IF NOT EXISTS "guardian_first_name" text,
  ADD COLUMN IF NOT EXISTS "guardian_last_name" text; 