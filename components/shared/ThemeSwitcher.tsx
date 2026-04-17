"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const THEMES = [
  { id: "tech", label: "מודרני", color: "#0ea5e9" },
  { id: "luxury", label: "יוקרה", color: "#d4a853" },
  { id: "trust", label: "קלאסי", color: "#10b981" },
] as const;

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("tech");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("color-theme");
    if (saved) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const switchTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("color-theme", themeId);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent transition-colors"
        aria-label="בחירת ערכת צבעים"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-2 z-50 w-44 rounded-xl border border-border bg-card p-2 shadow-xl">
            <p className="text-xs text-muted-foreground px-2 py-1 mb-1">ערכת צבעים</p>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => switchTheme(theme.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  currentTheme === theme.id ? "bg-accent font-medium" : ""
                }`}
              >
                <div
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: theme.color }}
                />
                {theme.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
