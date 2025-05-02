import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { PageLoader } from "@/components/layout/page-loader";
import { PageTransition } from "@/components/ui/page-transition";
import { useDynamicTitle } from './hooks/useDynamicTitle';

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
        <ProtectedRoute path="/editor" component={EditorPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  useDynamicTitle();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="web-code-academy-theme">
        <AuthProvider>
          <TooltipProvider>
            <PageLoader />
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
