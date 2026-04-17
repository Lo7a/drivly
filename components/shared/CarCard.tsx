import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, MapPin, Calendar } from "lucide-react";
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
}: CarCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <Link
      href={`/car/${slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${make} ${model} ${year}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gauge className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 start-3">
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
        <Badge
          variant="secondary"
          className="absolute top-3 start-3 text-xs"
        >
          יד {hand}
        </Badge>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
          {make} {model} {year}
        </h3>

        {/* Specs Grid */}
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
