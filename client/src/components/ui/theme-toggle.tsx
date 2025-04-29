import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
      aria-label="Cambiar tema"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all text-muted-foreground" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all text-muted-foreground" />
      )}
    </Button>
  );
}