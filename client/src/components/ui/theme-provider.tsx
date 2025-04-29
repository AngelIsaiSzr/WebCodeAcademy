import { createContext, useContext } from "react";
import { useTheme as useCustomTheme } from "@/hooks/use-theme";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProviderContext = createContext<ReturnType<typeof useCustomTheme> | null>(null);

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const theme = useCustomTheme();

  return (
    <ThemeProviderContext.Provider {...props} value={theme}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === null)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
