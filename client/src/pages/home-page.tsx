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
import { useEffect, useState } from "react";
import LogosCarousel from "@/components/home/logos-carousel";

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simplemente marcamos como listo el componente
      setIsReady(true);

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
          content="Academia de programación y tecnología completamente gratuita, combatiendo el analfabetismo digital con cursos de programación y tecnología"
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
              <LogosCarousel />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
