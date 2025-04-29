import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn(sizes[size], "animate-spin text-accent-blue")} />
      {text && <p className="text-base mt-3 font-medium">{text}</p>}
    </div>
  );
}