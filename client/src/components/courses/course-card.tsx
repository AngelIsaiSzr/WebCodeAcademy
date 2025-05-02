import { Link } from 'wouter';
import { Course } from '@shared/schema';

type CourseCardProps = {
  course: Course;
  index?: number;
};

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <div className="course-card bg-primary-900 rounded-xl overflow-hidden">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        {/* Course badges */}
        <div className="absolute top-0 right-0 flex flex-col items-end gap-2 p-2">
          {course.popular && (
            <div className="bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded">
              Más Popular
            </div>
          )}
          {course.featured && (
            <div className="bg-accent-red text-white text-xs font-bold px-3 py-1 rounded">
              Destacado
            </div>
          )}
          {course.new && (
            <div className="bg-accent-yellow text-primary-900 text-xs font-bold px-3 py-1 rounded">
              Nuevo
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded bg-secondary-800 mr-2">{course.category}</span>
          <span className="text-xs font-medium px-2 py-1 rounded bg-secondary-800">{course.level}</span>
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">{course.title}</h3>
        <p className="text-muted text-sm mb-4">{course.shortDescription}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              <i className={`fas fa-book-open ${getCourseIconStyle(course)} mr-2 text-sm`}></i>
              <span className="text-sm">{course.modules} Módulos</span>
            </div>
            <div className="flex items-center">
              <i className={`fas fa-clock ${getCourseIconStyle(course)} mr-2 text-sm`}></i>
              <span className="text-sm">{course.duration} Horas</span>
            </div>
          </div>
          <Link href={`/courses/${course.slug}`} className={`px-4 py-2 ${getCourseButtonStyle(course)} rounded-md text-sm transition-colors inline-block`}>
            Ver Curso
          </Link>
        </div>
      </div>
    </div>
  );
}

// Determina el estilo del icono según las propiedades del curso
function getCourseIconStyle(course: Course): string {
  if (course.popular) {
    return 'text-accent-blue';
  } else if (course.featured) {
    return 'text-accent-red';
  } else if (course.new) {
    return 'text-accent-yellow';
  } else {
    return 'text-accent-blue';
  }
}

// Determinar el estilo del botón según las propiedades del curso
function getCourseButtonStyle(course: Course): string {
  if (course.popular) {
    return 'bg-accent-blue text-white hover:bg-opacity-90';
  } else if (course.featured) {
    return 'bg-accent-red text-white hover:bg-opacity-90';
  } else if (course.new) {
    return 'border border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-primary-900';
  } else {
    return 'border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white';
  }
}
