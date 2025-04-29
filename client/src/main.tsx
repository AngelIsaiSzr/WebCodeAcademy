import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Función para aplicar el tema
const applyTheme = (theme: string) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};

// Inicializar el tema antes de renderizar la aplicación
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    applyTheme('light');
    localStorage.setItem('theme', 'light');
  }
};

// Aplicar el tema inmediatamente
initializeTheme();

// Escuchar cambios en el localStorage de otras pestañas
window.addEventListener('storage', (e) => {
  if (e.key === 'theme' && e.newValue) {
    applyTheme(e.newValue);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
