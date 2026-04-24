import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, MoreHorizontal, Car } from "lucide-react";
import { CAR_STATUS_LABELS } from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-500",
  APPROVED: "bg-emerald-500/10 text-emerald-500",
  REJECTED: "bg-red-500/10 text-red-500",
  SOLD: "bg-violet-500/10 text-violet-500",
  ARCHIVED: "bg-muted text-muted-foreground",
};

async function getDealerCars() {
  try {
    const user = await getUser();
    if (!user?.dealer) return [];

    const cars = await prisma.car.findMany({
      where: { dealerId: user.dealer.id },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    });
    return cars;
  } catch {
    return [];
  }
}

export default async function DealerCarsPage() {
  const cars = await getDealerCars();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">הרכבים שלי</h1>
        <Link
          href="/dealer/cars/new"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-400"
        >
          הוסף רכב
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">אין לך עדיין רכבים במערכת</p>
          <Link
            href="/dealer/cars/new"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            הוסף רכב ראשון
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 hover:bg-accent transition-colors"
            >
              <div className="relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {car.images[0]?.url ? (
                  <Image
                    src={car.images[0].url}
                    alt={`${car.make} ${car.model} ${car.year}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, 96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Car className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {car.make} {car.model} {car.year}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatPrice(car.price)} · {formatKm(car.km)}
                </p>
              </div>

              <span className={`hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[car.status]}`}>
                {CAR_STATUS_LABELS[car.status]}
              </span>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {car.viewsCount}
              </div>

              <Link
                href={`/car/${car.slug}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
