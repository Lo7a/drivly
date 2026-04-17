"use client";

import { Search, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MOCK_CARS } from "@/lib/mock-data";
import { formatPrice, formatKm } from "@/lib/format";
import { FUEL_TYPES } from "@/lib/constants";
import Link from "next/link";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter cars based on query
  const suggestions = query.length >= 2
    ? MOCK_CARS.filter((car) => {
        const q = query.toLowerCase();
        return (
          car.make.includes(q) ||
          car.model.toLowerCase().includes(q) ||
          String(car.year).includes(q) ||
          car.city?.includes(q) ||
          `${car.make} ${car.model}`.includes(q)
        );
      }).slice(0, 5)
    : [];

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
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
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
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

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          {suggestions.map((car) => (
            <Link
              key={car.id}
              href={`/car/${car.slug}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {car.make} {car.model} {car.year}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatKm(car.km)} · {FUEL_TYPES[car.fuelType]} · {car.city}
                </p>
              </div>
              <p className="text-sm font-bold text-primary shrink-0">
                {formatPrice(car.price)}
              </p>
            </Link>
          ))}

          {/* Show all results link */}
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
          >
            <Search className="h-4 w-4" />
            הצג את כל התוצאות עבור &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
