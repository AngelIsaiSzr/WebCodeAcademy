import { useQuery } from '@tanstack/react-query';
import { Course } from '@shared/schema';
import CourseGrid from '@/components/courses/course-grid';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Loader2 } from 'lucide-react';
import { AnimateInView } from '@/components/ui/animate-in-view'; // Asegúrate de importar AnimateInView

export default function CoursesSection() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Filter to show at most 6 courses on the homepage
  const displayedCourses = courses?.slice(0, 6);

  return (
    <section id="cursos" className="py-20 bg-primary-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Nuestros Cursos</h2>
          <p className="text-muted max-w-2xl mx-auto">Explora nuestra variedad de cursos diseñados para todos los niveles, desde principiantes hasta desarrolladores avanzados.</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-accent-blue" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-primary-800 rounded-xl">
            <h3 className="text-xl font-heading font-semibold mb-2">Error al cargar los cursos</h3>
            <p className="text-muted mb-6">Lo sentimos, ha ocurrido un error al cargar los cursos. Inténtalo de nuevo más tarde.</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        ) : displayedCourses && displayedCourses.length > 0 ? (
          <>
            {/* AnimateInView wrapper para animación al hacer scroll */}
            <AnimateInView animation="slideUp" delay={0.2}>
              <CourseGrid courses={displayedCourses} />
            </AnimateInView>

            <div className="text-center mt-12">
              <Link href="/courses">
                <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white inline-flex items-center">
                  Ver todos los cursos
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-primary-800 rounded-xl">
            <h3 className="text-xl font-heading font-semibold mb-2">No hay cursos disponibles</h3>
            <p className="text-muted">Próximamente tendremos nuevos cursos disponibles para ti. ¡Mantente al tanto!</p>
          </div>
        )}
      </div>
    </section>
  );
}
