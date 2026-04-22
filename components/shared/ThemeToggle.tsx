"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent transition-colors"
      aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}
