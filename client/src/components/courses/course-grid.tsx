import { Course } from '@shared/schema';
import CourseCard from './course-card';

type CourseGridProps = {
  courses: Course[];
};

export default function CourseGrid({ courses }: CourseGridProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-16 bg-primary-800 rounded-xl">
        <h3 className="text-xl font-heading font-semibold mb-2">No hay cursos disponibles</h3>
        <p className="text-muted">Próximamente tendremos nuevos cursos disponibles para ti. ¡Mantente al tanto!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          index={index}
        />
      ))}
    </div>
  );
}
