import Link from "next/link";
import { Eye, Pencil, ExternalLink } from "lucide-react";
import { CAR_STATUS_LABELS } from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { CarActions } from "@/components/admin/CarActions";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-500",
  APPROVED: "bg-emerald-500/10 text-emerald-500",
  REJECTED: "bg-red-500/10 text-red-500",
  SOLD: "bg-violet-500/10 text-violet-500",
  ARCHIVED: "bg-muted text-muted-foreground",
};

async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        dealer: { select: { businessName: true } },
      },
      take: 100,
    });
    return cars;
  } catch {
    return [];
  }
}

export default async function AdminCarsPage() {
  const cars = await getCars();

  const stats = [
    { label: "מאושרים", count: cars.filter((c) => c.status === "APPROVED").length, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" },
    { label: "ממתינים", count: cars.filter((c) => c.status === "PENDING_APPROVAL").length, color: "border-amber-500/20 bg-amber-500/5 text-amber-500" },
    { label: "נדחו", count: cars.filter((c) => c.status === "REJECTED").length, color: "border-red-500/20 bg-red-500/5 text-red-500" },
    { label: "סה״כ", count: cars.length, color: "border-border bg-card text-foreground" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">ניהול רכבים</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {cars.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">אין רכבים במערכת</p>
        ) : (
          cars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-accent transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-foreground">{car.make} {car.model} {car.year}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[car.status]}`}>
                      {CAR_STATUS_LABELS[car.status]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(car.price)} · {formatKm(car.km)} · {car.dealer.businessName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    {car.viewsCount}
                  </span>

                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 sm:px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    aria-label="ערוך רכב"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">עריכה</span>
                  </Link>
                  <Link
                    href={`/car/${car.slug}`}
                    target="_blank"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="פתח בדף הציבורי"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {car.status === "PENDING_APPROVAL" && <CarActions carId={car.id} />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
