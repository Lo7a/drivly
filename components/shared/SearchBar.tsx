"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  size?: "md" | "lg";
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  size = "md",
  placeholder = "חפשו יצרן, דגם או סוג רכב...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const sizes = {
    md: "h-11 text-sm",
    lg: "h-14 text-base sm:text-lg",
  };

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-border bg-background pe-4 ps-12 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${sizes[size]}`}
      />
      <button
        type="submit"
        className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="חיפוש"
      >
        <Search className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      </button>
    </form>
  );
}
