import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Course, Module, Section } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, CheckCircle, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completed: boolean;
  createdAt: string | null;
}

interface ModuleWithSections extends Module {
  sections: Section[];
}

interface SectionProgress {
  sectionId: number;
  completed: boolean;
  timestamp: string;
}

export default function CourseLearningPage() {
  const [, params] = useRoute("/courses/:slug/learn");
  const slug = params?.slug;
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [completedSections, setCompletedSections] = useState<SectionProgress[]>([]);

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

  // Fetch sections for each module
  const modulesWithSections = useQuery<ModuleWithSections[]>({
    queryKey: ['moduleSections', modules],
    enabled: !!modules && modules.length > 0,
    queryFn: async () => {
      const modulesWithSections = await Promise.all(
        modules!.map(async (module) => {
          const response = await fetch(`/api/modules/${module.id}/sections`);
          const sections = await response.json();
          return { ...module, sections };
        })
      );
      return modulesWithSections;
    }
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

  // Set initial active module and section
  useEffect(() => {
    if (modulesWithSections.data && modulesWithSections.data.length > 0) {
      const firstModule = modulesWithSections.data[0];
      setActiveModuleId(firstModule.id);
      if (firstModule.sections && firstModule.sections.length > 0) {
        setActiveSectionId(firstModule.sections[0].id);
      }
    }
  }, [modulesWithSections.data]);

  // Mutation para actualizar el progreso
  const updateProgressMutation = useMutation({
    mutationFn: async (sectionId: number) => {
      const enrollment = enrollments.find(e => e.courseId === course?.id);
      if (!enrollment) throw new Error("No enrollment found");

      const completed = !isCurrentSectionCompleted();
      const progress = calculateProgress(completed);

      await Promise.all([
        // Actualizar el progreso del curso
        fetch(`/api/enrollments/${enrollment.id}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress, completed: false }) // completed será true cuando se complete todo el curso
        }),
        // Guardar el progreso de la sección
        fetch(`/api/sections/${sectionId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed })
        })
      ]);

      return { sectionId, completed };
    },
    onSuccess: (data) => {
      if (data.completed) {
        setCompletedSections(prev => [...prev, {
          sectionId: data.sectionId,
          completed: true,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setCompletedSections(prev => prev.filter(s => s.sectionId !== data.sectionId));
      }
    }
  });

  // Calcular el progreso total
  const calculateProgress = (includeCurrentSection: boolean = false) => {
    if (!modulesWithSections.data) return 0;
    const totalSections = modulesWithSections.data.reduce((acc, m) => acc + m.sections.length, 0);
    const completedCount = completedSections.length + (includeCurrentSection ? 1 : 0);
    return Math.round((completedCount / totalSections) * 100);
  };

  // Verificar si la sección actual está completada
  const isCurrentSectionCompleted = () => {
    return completedSections.some(s => s.sectionId === activeSectionId);
  };

  // Navegación entre secciones
  const findAdjacentSections = () => {
    if (!modulesWithSections.data || !activeModuleId || !activeSectionId) return { prev: null, next: null };
    
    let prevSection = null;
    let nextSection = null;
    let foundCurrent = false;
    
    for (let i = 0; i < modulesWithSections.data.length; i++) {
      const module = modulesWithSections.data[i];
      for (let j = 0; j < module.sections.length; j++) {
        const section = module.sections[j];
        
        if (foundCurrent) {
          nextSection = { moduleId: module.id, section };
          break;
        }
        
        if (section.id === activeSectionId) {
          foundCurrent = true;
        } else {
          prevSection = { moduleId: module.id, section };
        }
      }
      if (nextSection) break;
    }
    
    return { prev: prevSection, next: nextSection };
  };

  const { prev, next } = findAdjacentSections();

  const handleSectionClick = (moduleId: number, sectionId: number) => {
    setActiveModuleId(moduleId);
    setActiveSectionId(sectionId);
  };

  const handlePrevSection = () => {
    if (prev) {
      handleSectionClick(prev.moduleId, prev.section.id);
    }
  };

  const handleNextSection = () => {
    if (next) {
      handleSectionClick(next.moduleId, next.section.id);
    }
  };

  const handleMarkAsCompleted = () => {
    if (activeSectionId) {
      updateProgressMutation.mutate(activeSectionId);
    }
  };

  if (isLoadingCourse || isLoadingModules || isLoadingEnrollments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
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
        } fixed md:relative h-screen z-20`}
      >
        <ScrollArea className="h-full">
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

            {/* Course Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso del curso</span>
                <span>{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
            
            <div className="space-y-4">
              {modulesWithSections.data?.map((module, moduleIndex) => (
                <div 
                  key={module.id} 
                  className={cn(
                    "rounded-lg overflow-hidden",
                    activeModuleId === module.id ? "bg-primary-700" : "bg-primary-800"
                  )}
                >
                  <div className="p-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <span className="bg-primary-600 rounded-full px-2 py-0.5 text-sm">
                        {moduleIndex + 1}
                      </span>
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                      <span>{module.duration}h</span>
                      <span>•</span>
                      <span>{module.sections.length} secciones</span>
                    </div>
                  </div>

                  <div className="border-t border-primary-600">
                    {module.sections.map((section, sectionIndex) => {
                      const isCompleted = completedSections.some(s => s.sectionId === section.id);
                      return (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(module.id, section.id)}
                          className={cn(
                            "w-full text-left p-3 flex items-start gap-3 hover:bg-primary-600/50 transition-colors",
                            activeSectionId === section.id && "bg-primary-600"
                          )}
                        >
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <PlayCircle className="h-5 w-5 text-muted" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {sectionIndex + 1}. {section.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              {section.duration} min
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-primary-800 border-b border-primary-700 h-16 flex items-center px-4 sticky top-0 z-10">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevSection}
                  disabled={!prev}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNextSection}
                  disabled={!next}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsCompleted}
                className={cn(
                  "gap-2",
                  isCurrentSectionCompleted() && "text-green-500"
                )}
              >
                {isCurrentSectionCompleted() ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Completado
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Marcar como completado
                  </>
                )}
              </Button>
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