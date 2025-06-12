-- Agregar columna order a la tabla testimonials
ALTER TABLE testimonials ADD COLUMN "order" integer NOT NULL DEFAULT 1;

-- Actualizar los testimonios existentes con un orden secuencial
WITH numbered_testimonials AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
  FROM testimonials
)
UPDATE testimonials
SET "order" = numbered_testimonials.row_num
FROM numbered_testimonials
WHERE testimonials.id = numbered_testimonials.id; 