import React, { useRef, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Interfaz para los datos de países
interface CountryData {
  name: string;
  code: string;
  students: string;
}

// Componente para manejar la carga individual de cada bandera
const FlagImage = ({ country }: { country: CountryData }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-32 w-40 flex flex-col items-center justify-center">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-md bg-primary-700" />
      )}
      <div className={cn(
        "flex flex-col items-center space-y-2 transition-opacity duration-500 ease-in-out",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <img
          src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png 2x`}
          width="160"
          height="120"
          alt={country.name}
          className="object-contain h-20 w-32 shadow-sm select-none"
          onLoad={() => setIsLoaded(true)}
          draggable={false}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{country.name}</p>
          <p className="text-xs text-muted-foreground">
            {country.students} {country.students === "1" ? "Estudiante" : "Estudiantes"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Array de datos de países con sus códigos ISO y cantidad de estudiantes
const countries: CountryData[] = [
  { name: "México", code: "mx", students: "+80" },
  { name: "Venezuela", code: "ve", students: "8" },
  { name: "Argentina", code: "ar", students: "8" },
  { name: "Colombia", code: "co", students: "4" },
  { name: "Brasil", code: "br", students: "3" },
  { name: "Chile", code: "cl", students: "2" },
  { name: "Ecuador", code: "ec", students: "2" },
  { name: "Honduras", code: "hn", students: "1" },
  { name: "Nicaragua", code: "ni", students: "1" },
  { name: "España", code: "es", students: "1" }
];

// Genera una secuencia alternada de países para llenar el ancho visible y que sea múltiplo exacto de countries.length
const getAlternatingCountries = (countries: CountryData[], minCount: number) => {
  const arr: CountryData[] = [];
  let i = 0;
  // Calcula el siguiente múltiplo de countries.length mayor o igual a minCount
  const total = Math.ceil(minCount / countries.length) * countries.length;
  while (arr.length < total) {
    arr.push(countries[i % countries.length]);
    i++;
  }
  return arr;
};

export const FlagsCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [countryCount, setCountryCount] = useState(16); // valor por defecto
  const [baseWidth, setBaseWidth] = useState(0);
  const [offset, setOffset] = useState(0);

  // Calcula cuántos países se necesitan para cubrir al menos 3 veces el ancho visible
  useEffect(() => {
    const updateCountryCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Cada bandera + gap (gap duplicado: 16px)
        const flagWidth = 160 + 16;
        // 3 veces el ancho visible para evitar huecos
        const minCount = Math.ceil((containerWidth * 3) / flagWidth);
        setCountryCount(minCount);
      }
    };
    updateCountryCount();
    window.addEventListener("resize", updateCountryCount);
    return () => window.removeEventListener("resize", updateCountryCount);
  }, []);

  // Triplicar la secuencia base para el bucle perfecto
  const baseCountries = getAlternatingCountries(countries, countryCount);
  const repeatedCountries = [...baseCountries, ...baseCountries, ...baseCountries];

  // Medir el ancho de la secuencia base (la longitud de baseCountries)
  useEffect(() => {
    if (trackRef.current) {
      // Suma el ancho de los primeros N hijos (baseCountries.length)
      const children = Array.from(trackRef.current.children).slice(0, baseCountries.length) as HTMLDivElement[];
      const width = children.reduce((acc, child) => acc + child.offsetWidth + 16, 0); // 16px gap
      setBaseWidth(width);
    }
  }, [countryCount]);

  // Animación profesional con JS
  useEffect(() => {
    if (!baseWidth) return;
    let start: number | null = null;
    let rafId: number;
    const speed = 60; // px por segundo (más lento que logos)

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      // Avance en píxeles
      const px = (elapsed / 1000) * speed;
      // Cuando llega al final de la secuencia base, reinicia
      if (px >= baseWidth) {
        start = timestamp;
        setOffset(0);
        rafId = requestAnimationFrame(animate);
        return;
      }
      setOffset(-px);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [baseWidth]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-12 bg-secondary-900 border-y-0">
      <div className="relative flex items-center justify-center">
        <div
          ref={trackRef}
          className="flags-carousel-track flex gap-4"
          style={{
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          {repeatedCountries.map((country, idx) => (
            <div key={idx} className="flex-shrink-0 h-40 w-40 flex items-center justify-center">
              <FlagImage country={country} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagsCarousel; 