"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  carId: string;
  carTitle?: string;
  className?: string;
}

export function FavoriteButton({ carId, carTitle, className = "" }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const favs = getFavorites();
    setIsFavorite(favs.includes(carId));

    const handler = () => {
      const updated = getFavorites();
      setIsFavorite(updated.includes(carId));
    };
    window.addEventListener("favorites-changed", handler);
    return () => window.removeEventListener("favorites-changed", handler);
  }, [carId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favs = getFavorites();
    if (favs.includes(carId)) {
      const updated = favs.filter((id) => id !== carId);
      saveFavorites(updated);
      setIsFavorite(false);
      toast.success("הוסר מהמועדפים");
    } else {
      const updated = [...favs, carId];
      saveFavorites(updated);
      setIsFavorite(true);
      toast.success(carTitle ? `${carTitle} נוסף למועדפים` : "נוסף למועדפים");
    }
    window.dispatchEvent(new Event("favorites-changed"));
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur text-muted-foreground ${className}`}
        aria-label="הוסף למועדפים"
      >
        <Heart className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${
        isFavorite
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
          : "bg-white/90 text-muted-foreground hover:text-red-500 hover:scale-105"
      } ${className}`}
      aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  );
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("drivly-favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("drivly-favorites", JSON.stringify(favorites));
}
