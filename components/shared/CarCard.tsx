"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, formatKm } from "@/lib/format";
import { FUEL_TYPES, REGIONS } from "@/lib/constants";
import type { FuelType, Region } from "@prisma/client";

export interface CarCardProps {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number | null;
  km: number;
  hand: number;
  fuelType: FuelType;
  region?: Region | null;
  city?: string | null;
  imageUrl?: string | null;
  images?: string[];
  categoryTag?: string | null;
}

export function CarCard({
  slug,
  make,
  model,
  year,
  price,
  originalPrice,
  km,
  hand,
  fuelType,
  region,
  city,
  imageUrl,
  images,
}: CarCardProps) {
  // Prefer images[] if provided, fall back to imageUrl
  const pics = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const [idx, setIdx] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hasDiscount = originalPrice && originalPrice > price;
  const hasMultiple = pics.length > 1;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (hasMultiple) setIdx(0);
  };

  useEffect(() => {
    if (!isHovering || !hasMultiple) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % pics.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovering, hasMultiple, pics.length]);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % pics.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + pics.length) % pics.length);
  };

  return (
    <Link
      href={`/car/${slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovering(false)}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {pics.length > 0 ? (
          <>
            {pics.map((src, i) => (
              <Image
                key={src + i}
                src={src}
                alt={`${make} ${model} ${year} ${i + 1}`}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  i === idx ? "opacity-100" : "opacity-0"
                } ${i === idx && !isHovering ? "group-hover:scale-105" : ""}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ))}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gauge className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Prev/Next arrows (only if multiple) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prevImg}
              className="absolute start-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 hover:bg-background transition-opacity"
              aria-label="תמונה קודמת"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute end-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 hover:bg-background transition-opacity"
              aria-label="תמונה הבאה"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {pics.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === idx ? "w-4 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 start-3 z-10">
          <div className="rounded-lg bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="ms-2 text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Hand Badge */}
        <Badge variant="secondary" className="absolute top-3 start-3 text-xs z-10">
          יד {hand}
        </Badge>

        {/* Image count badge */}
        {hasMultiple && (
          <span className="absolute top-3 end-3 z-10 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5">
            {pics.length} תמונות
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
          {make} {model} {year}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 shrink-0" />
            <span>{formatKm(km)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 shrink-0" />
            <span>{FUEL_TYPES[fuelType]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{year}</span>
          </div>
          {region && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{city || REGIONS[region]}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

