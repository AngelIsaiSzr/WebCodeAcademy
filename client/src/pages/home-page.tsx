import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import CoursesSection from "@/components/home/courses-section";
import CourseDetailPreview from "@/components/home/course-detail-preview";
import AboutSection from "@/components/home/about-section";
import TeamSection from "@/components/home/team-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CtaSection from "@/components/home/cta-section";
import ContactSection from "@/components/home/contact-section";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);

  // Seed data only if needed (for demo purposes)
  useEffect(() => {
    // Utilizamos localStorage para evitar ejecutar la semilla múltiples veces
    const hasSeedData = localStorage.getItem('wca-seeded');
    
    const loadData = async () => {
      if (!hasSeedData) {
        try {
          await apiRequest("POST", "/api/seed", {});
          localStorage.setItem('wca-seeded', 'true');
        } catch (error) {
          console.error("Error seeding data:", error);
        }
      }
      
      // Aseguramos que el componente esté montado antes de continuar
      setIsReady(true);
    };
    
    loadData();

    // Cleanup 
    return () => {
      setIsReady(false);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Web Code Academy</title>
        <meta 
          name="description" 
          content="Academia de programación y tecnología completamente gratuita, combatiendo el analfabetismo digital con cursos de HTML, CSS, JavaScript, Python, Java y más"
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        
        <main className="flex-grow overflow-x-hidden">
          {isReady && (
            <>
              <HeroSection />
              <FeaturesSection />
              <CoursesSection />
              <CourseDetailPreview />
              <AboutSection />
              <TeamSection />
              <TestimonialsSection />
              <CtaSection />
              <ContactSection />
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
