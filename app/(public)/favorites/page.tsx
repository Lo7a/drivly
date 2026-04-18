"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Car, Search } from "lucide-react";
import { formatPrice, formatKm } from "@/lib/format";
import { FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/constants";
import { FavoriteButton, getFavorites } from "@/components/shared/FavoriteButton";

interface FavoriteCar {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  km: number;
  hand: number;
  fuelType: string;
  transmission: string;
  city: string | null;
  imageUrl: string | null;
}

export default function FavoritesPage() {
  const [cars, setCars] = useState<FavoriteCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const favIds = getFavorites();
      if (favIds.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        const matching = (data.cars || []).filter((c: FavoriteCar) => favIds.includes(c.id));
        setCars(matching);
      } catch {
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    window.addEventListener("favorites-changed", load);
    return () => window.removeEventListener("favorites-changed", load);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold">המועדפים שלי</h1>
        {cars.length > 0 && (
          <span className="text-sm text-muted-foreground">({cars.length})</span>
        )}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">טוען...</p>
      ) : cars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">אין עדיין מועדפים</h2>
          <p className="text-sm text-muted-foreground mb-6">
            לחץ על הלב בכרטיס של רכב כדי להוסיף אותו למועדפים
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4" />
            חפש רכבים
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/car/${car.slug}`}
              className="card-hover group block overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                {car.imageUrl ? (
                  <Image
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 end-3">
                  <FavoriteButton carId={car.id} carTitle={`${car.make} ${car.model}`} />
                </div>
                <div className="absolute bottom-3 start-3 glass rounded-lg px-3 py-1.5 shadow-lg">
                  <span className="text-base font-bold">{formatPrice(car.price)}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">
                  {car.make} {car.model} {car.year}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    formatKm(car.km),
                    TRANSMISSION_TYPES[car.transmission as keyof typeof TRANSMISSION_TYPES],
                    FUEL_TYPES[car.fuelType as keyof typeof FUEL_TYPES],
                  ].map((tag) => (
                    <span key={tag} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
