import Link from "next/link";
import { Plus, Eye, MoreHorizontal } from "lucide-react";
import { CAR_STATUS_LABELS } from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";

const MOCK_DEALER_CARS = [
  { id: "1", make: "טויוטה", model: "קורולה", year: 2023, price: 115000, km: 32000, status: "APPROVED" as const, views: 342 },
  { id: "2", make: "יונדאי", model: "טוסון", year: 2022, price: 145000, km: 48000, status: "PENDING_APPROVAL" as const, views: 0 },
  { id: "3", make: "מאזדה", model: "CX-5", year: 2023, price: 165000, km: 25000, status: "APPROVED" as const, views: 189 },
  { id: "4", make: "סקודה", model: "אוקטביה", year: 2024, price: 135000, km: 15000, status: "DRAFT" as const, views: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  SOLD: "bg-violet-500/10 text-violet-400",
};

export default function DealerCarsPage() {
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

      {/* Cars list */}
      <div className="space-y-3">
        {MOCK_DEALER_CARS.map((car) => (
          <div
            key={car.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:bg-accent transition-colors"
          >
            {/* Car icon placeholder */}
            <div className="hidden sm:flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-card">
              <span className="text-2xl">🚗</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">
                {car.make} {car.model} {car.year}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatPrice(car.price)} · {formatKm(car.km)}
              </p>
            </div>

            {/* Status */}
            <span className={`hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[car.status]}`}>
              {CAR_STATUS_LABELS[car.status]}
            </span>

            {/* Views */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {car.views}
            </div>

            {/* Actions */}
            <Link
              href={`/dealer/cars/${car.id}/edit`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
