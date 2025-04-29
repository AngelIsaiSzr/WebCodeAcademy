import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { usePageLoading } from "@/hooks/use-page-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PageLoader() {
  const [location] = useLocation();
  const { isLoading, setLoading } = usePageLoading();
  const [showLoader, setShowLoader] = useState(true); // AHORA empieza en true

  useEffect(() => {
    setLoading(true); // empezamos cargando
    const timer = setTimeout(() => {
      setLoading(false); // paramos la carga después de 500ms
    }, 500);

    return () => clearTimeout(timer);
  }, [location, setLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowLoader(false), 300); // esperamos la animación
      return () => clearTimeout(timeout);
    } else {
      setShowLoader(true);
    }
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-primary-900 backdrop-blur-sm z-[9999] transition-opacity duration-300 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <LoadingSpinner size="lg" text="Cargando..." />
    </div>
  );
}
