import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Course, Module, Section } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, CheckCircle, Lock, PlayCircle, FileText, Download, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  videoProgress?: number;
}

type TabType = "description" | "resources" | "comments";

export default function CourseLearningPage() {
  const [, params] = useRoute("/courses/:slug/learn");
  const slug = params?.slug;
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [completedSections, setCompletedSections] = useState<SectionProgress[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [videoProgress, setVideoProgress] = useState<number>(0);

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

  // Cargar el progreso existente
  useEffect(() => {
    const loadProgress = async () => {
      if (!course?.id || !activeSectionId) return;
      
      try {
        const response = await fetch(`/api/courses/${course.id}/progress`);
        const data = await response.json();
        setCompletedSections(data.completedSections || []);
        
        // Cargar progreso del video si existe
        const sectionProgress = data.completedSections?.find(
          (s: SectionProgress) => s.sectionId === activeSectionId
        );
        if (sectionProgress?.videoProgress) {
          setVideoProgress(sectionProgress.videoProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    loadProgress();
  }, [course?.id, activeSectionId]);

  // Mutation para actualizar el progreso
  const updateProgressMutation = useMutation({
    mutationFn: async ({ sectionId, videoProgress }: { sectionId: number; videoProgress?: number }) => {
      const enrollment = enrollments.find(e => e.courseId === course?.id);
      if (!enrollment) throw new Error("No enrollment found");

      const completed = !isCurrentSectionCompleted();
      const progress = calculateProgress(completed);

      await Promise.all([
        // Actualizar el progreso del curso
        fetch(`/api/enrollments/${enrollment.id}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress, completed: false })
        }),
        // Guardar el progreso de la sección
        fetch(`/api/sections/${sectionId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed, videoProgress })
        })
      ]);

      return { sectionId, completed, videoProgress };
    },
    onSuccess: (data) => {
      if (data.completed) {
        setCompletedSections(prev => [...prev, {
          sectionId: data.sectionId,
          completed: true,
          timestamp: new Date().toISOString(),
          videoProgress: data.videoProgress
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
      updateProgressMutation.mutate({ 
        sectionId: activeSectionId,
        videoProgress: videoProgress 
      });
    }
  };

  // Manejador de progreso del video
  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
    // Guardamos el progreso cada 5 segundos
    if (activeSectionId && progress % 5 === 0) {
      updateProgressMutation.mutate({ 
        sectionId: activeSectionId,
        videoProgress: progress 
      });
    }
    
    // Auto-completar cuando se llega al 95% del video
    if (progress >= 95 && !isCurrentSectionCompleted() && activeSectionId) {
      updateProgressMutation.mutate({ 
        sectionId: activeSectionId,
        videoProgress: progress 
      });
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
        } fixed md:relative h-screen z-20 flex flex-col`}
      >
        {/* Header fijo */}
        <div className="p-4 border-b border-primary-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="hover:bg-primary-700"
              >
                <a href={`/courses/${course.slug}`}>
                  <ChevronLeft className="h-5 w-5" />
                </a>
              </Button>
              <h2 className="text-xl font-bold">{course.title}</h2>
            </div>
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
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso del curso</span>
              <span>{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </div>

        {/* Contenido scrolleable */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {modulesWithSections.data?.map((module, moduleIndex) => (
              <div 
                key={module.id} 
                className={cn(
                  "rounded-lg overflow-hidden transition-colors",
                  activeModuleId === module.id ? "bg-primary-700" : "bg-primary-800 hover:bg-primary-700/50"
                )}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setActiveModuleId(module.id)}
                >
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
                    const isActive = activeSectionId === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(module.id, section.id)}
                        className={cn(
                          "w-full text-left p-3 flex items-start gap-3 transition-colors relative",
                          isActive ? "bg-accent-blue text-white" : "hover:bg-primary-600/50",
                          isActive && "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-primary-900"
                        )}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className={cn("h-5 w-5", isActive ? "text-white" : "text-green-500")} />
                          ) : (
                            <PlayCircle className={cn("h-5 w-5", isActive ? "text-white" : "text-muted")} />
                          )}
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            isActive ? "text-white" : isCompleted ? "text-green-500" : ""
                          )}>
                            {sectionIndex + 1}. {section.title}
                          </p>
                          <p className={cn(
                            "text-xs mt-0.5",
                            isActive ? "text-white/80" : "text-muted"
                          )}>
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
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
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
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 h-full">
            <div className="max-w-4xl mx-auto space-y-6 h-full">
              {/* Current Section Title */}
              {activeSectionId && (
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">
                    {modulesWithSections.data?.find(m => m.id === activeModuleId)
                      ?.sections.find(s => s.id === activeSectionId)?.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" />
                      <span>
                        {modulesWithSections.data?.find(m => m.id === activeModuleId)
                          ?.sections.find(s => s.id === activeSectionId)?.duration} min
                      </span>
                    </div>
                    {isCurrentSectionCompleted() && (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completado</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Player Area */}
              <div className="bg-primary-800 rounded-xl overflow-hidden">
                <div className="relative">
                  {activeSectionId ? (
                    <div className="aspect-video bg-black">
                      <video
                        className="w-full h-full"
                        controls
                        src="https://res.cloudinary.com/dw6igi7fc/video/upload/v1746151518/Back_animado_Lab_FFF_akn4mf.mp4"
                        poster="https://res.cloudinary.com/dw6igi7fc/image/upload/v1746134148/back1_sngqjn.jpg"
                        onTimeUpdate={(e) => handleVideoProgress(Math.floor(e.currentTarget.currentTime))}
                        onEnded={() => handleVideoProgress(100)}
                        autoPlay={false}
                        loop={false}
                      >
                        Tu navegador no soporta el elemento de video.
                      </video>
                    </div>
                  ) : (
                    <div className="aspect-video bg-primary-900 flex items-center justify-center flex-col gap-4">
                      <PlayCircle className="h-16 w-16 text-muted" />
                      <p className="text-muted">Selecciona una sección para comenzar</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className="bg-primary-800 rounded-xl p-6 flex-1">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="h-full flex flex-col">
                  <TabsList className="w-full border-b border-primary-700 p-1">
                    <TabsTrigger value="description" className="flex-1 gap-2 py-3">
                      <FileText className="h-4 w-4" />
                      Descripción
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex-1 gap-2 py-3">
                      <Download className="h-4 w-4" />
                      Recursos
                      <span className="ml-2 bg-primary-700 text-xs px-2 py-0.5 rounded-full">3</span>
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1 gap-2 py-3">
                      <MessageSquare className="h-4 w-4" />
                      Comentarios
                      <span className="ml-2 bg-primary-700 text-xs px-2 py-0.5 rounded-full">12</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Next Section Indicator */}
                  {next && (
                    <div className="bg-primary-900/50 p-4 rounded-lg mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted">Siguiente</p>
                        <p className="font-medium">{next.section.title}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleNextSection}>
                        Continuar
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">
                    <TabsContent value="description" className="pt-4 h-full">
                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-xl font-bold mb-4">
                          {modulesWithSections.data?.find(m => m.id === activeModuleId)
                            ?.sections.find(s => s.id === activeSectionId)?.title}
                        </h2>
                        <p className="text-muted">
                          {modulesWithSections.data?.find(m => m.id === activeModuleId)
                            ?.sections.find(s => s.id === activeSectionId)?.content || 
                            "Selecciona una sección para ver su contenido"}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="pt-4 h-full">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Recursos de la sección</h3>
                        <div className="grid gap-4">
                          {/* Placeholder para recursos */}
                          <div className="border border-primary-700 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted" />
                              <div>
                                <p className="font-medium">Material de apoyo</p>
                                <p className="text-sm text-muted">PDF - 2.3MB</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comments" className="pt-4 h-full">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Comentarios y dudas</h3>
                        <div className="space-y-4">
                          <textarea
                            className="w-full h-24 bg-primary-900 rounded-lg p-3 resize-none"
                            placeholder="Escribe tu comentario o duda..."
                          />
                          <div className="flex justify-end">
                            <Button>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Comentar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 