import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loader = ({ size = "md", className }: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-primaryOrange border-t-transparent",
          sizeClasses[size],
        )}
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
