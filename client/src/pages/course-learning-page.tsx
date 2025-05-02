import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Course, Module, Section } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completed: boolean;
  createdAt: string | null;
}

export default function CourseLearningPage() {
  const [, params] = useRoute("/courses/:slug/learn");
  const slug = params?.slug;
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch course data
  const {
    data: course,
    isLoading: isLoadingCourse,
  } = useQuery<Course>({
    queryKey: [`/api/courses/${slug}`],
    enabled: !!slug,
  });

  // Fetch course modules
  const {
    data: modules,
    isLoading: isLoadingModules,
  } = useQuery<Module[]>({
    queryKey: [`/api/courses/${course?.id}/modules`],
    enabled: !!course?.id,
  });

  // Verificar si el usuario está inscrito
  const {
    data: enrollments = [],
    isLoading: isLoadingEnrollments
  } = useQuery<Enrollment[]>({
    queryKey: ['/api/enrollments'],
    enabled: !!user,
  });

  const isEnrolled = enrollments.some(enrollment => enrollment.courseId === course?.id);

  console.log('Debug info:', {
    slug,
    courseId: course?.id,
    enrollments: enrollments,
    isEnrolled: isEnrolled
  });

  if (isLoadingCourse || isLoadingModules || isLoadingEnrollments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando curso..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <p className="text-muted mb-4">Lo sentimos, el curso que buscas no existe o no está disponible.</p>
          <Button asChild>
            <a href="/courses">Ver todos los cursos</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-muted mb-4">Debes estar inscrito en este curso para acceder al contenido.</p>
          <Button asChild>
            <a href={`/courses/${course.slug}`}>Volver al curso</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-900 flex">
      {/* Sidebar */}
      <div 
        className={`bg-primary-800 w-80 flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative h-screen overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {modules?.map((module, moduleIndex) => (
              <div key={module.id} className="bg-primary-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  Módulo {moduleIndex + 1}: {module.title}
                </h3>
                {/* Aquí irán las secciones del módulo */}
                <div className="pl-4 space-y-2 mt-2">
                  {/* Placeholder para secciones */}
                  <div className="text-sm text-muted">
                    Secciones en construcción...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-primary-800 border-b border-primary-700 h-16 flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className={`mr-4 ${sidebarOpen ? 'md:hidden' : ''}`}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center justify-between">
            <div>
              {/* Navegación entre secciones */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button variant="ghost" size="sm">
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Placeholder para progreso */}
              <span className="text-sm text-muted">Progreso: 0%</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Área principal de contenido - En construcción */}
            <div className="bg-primary-800 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Área de Contenido</h2>
              <p className="text-muted">
                Esta sección está en construcción. Aquí se mostrará el video, 
                diapositivas y recursos de la sección seleccionada.
              </p>
            </div>

            {/* Tabs de navegación - En construcción */}
            <div className="mt-8 bg-primary-800 rounded-xl p-6">
              <div className="flex border-b border-primary-700 mb-4">
                <button className="px-4 py-2 text-accent-blue border-b-2 border-accent-blue">
                  Descripción
                </button>
                <button className="px-4 py-2 text-muted">
                  Recursos
                </button>
                <button className="px-4 py-2 text-muted">
                  Comentarios
                </button>
              </div>
              
              <div className="text-muted">
                Contenido de las pestañas en construcción...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 