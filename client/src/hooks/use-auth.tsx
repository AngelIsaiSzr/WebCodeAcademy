import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extended schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Extended schema for registration
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type AuthContextType = {
  user: Omit<SelectUser, "password"> | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<SelectUser, "password">, Error, z.infer<typeof loginSchema>>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<SelectUser, "password">, Error, z.infer<typeof registerSchema>>;
  logout: () => void;
};

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<Omit<SelectUser, "password"> | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenid@ de vuelta ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Inicio de Sesión Fallido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...credentials } = data;
      
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: Omit<SelectUser, "password">) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registro Exitoso",
        description: `Bienvenid@ a Web Code Academy, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registro Fallido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Cierre de Sesión Exitoso",
        description: "Has cerrado sesión correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cierre de Sesión Fallido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}

// Export validation schemas for form validation
export { loginSchema, registerSchema };
