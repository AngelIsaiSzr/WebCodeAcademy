import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { PageLoader } from "@/components/layout/page-loader";
import { PageTransition } from "@/components/ui/page-transition";
import { useDynamicTitle } from './hooks/useDynamicTitle';
import { useEffect } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailPage from "@/pages/course-detail-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import EditorPage from "@/pages/editor-page";
import AdminPage from "@/pages/admin-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import MerchPage from "@/pages/merch-page";
import MerchDetailPage from "@/pages/merch-detail-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import CourseLearningPage from "@/pages/course-learning-page";

function Router() {
  const [location] = useLocation();
  
  return (
    <PageTransition id={location}>
      <Switch location={location}>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/courses/:slug" component={CourseDetailPage} />
        <ProtectedRoute path="/courses/:slug/learn" component={CourseLearningPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/merch" component={MerchPage} />
        <Route path="/merch/:id" component={MerchDetailPage} />
        <ProtectedRoute path="/editor" component={EditorPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function DonorboxButton() {
  useEffect(() => {
    // Evitar duplicados
    if (document.getElementById("donorbox-popup-button-installer")) return;
    const script = document.createElement("script");
    script.id = "donorbox-popup-button-installer";
    script.src = "https://donorbox.org/install-popup-button.js";
    script.defer = true;
    script.setAttribute("data-href", "https://donorbox.org/juntos-por-la-educacion-tecnologica?");
    script.setAttribute("data-style", "background: #297de0; color: #fff; text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: fit-content; font-size: 16px; border-radius: 5px 5px 0 0; line-height: 24px; position: fixed; top: 50%; transform-origin: center; z-index: 9999; overflow: hidden; padding: 8px 22px 8px 18px; right: 20px; transform: translate(+50%, -50%) rotate(-90deg)");
    script.setAttribute("data-button-cta", "Apóyanos");
    script.setAttribute("data-img-src", "https://donorbox.org/images/white_logo.svg");
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return null;
}

function App() {
  useDynamicTitle();
  const [location] = useLocation();
  // Ocultar en /courses/:slug/learn y en el registro en vivo
  const hideDonorbox =
    /^\/courses\/[^/]+\/learn$/.test(location) ||
    location.includes("registro-en-vivo") ||
    location.includes("live-course-registration");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="web-code-academy-theme">
        <AuthProvider>
          <TooltipProvider>
            <PageLoader />
            <Toaster />
            {!hideDonorbox && <DonorboxButton />}
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
