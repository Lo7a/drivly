import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { CAR_STATUS_LABELS } from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";

const MOCK_ADMIN_CARS = [
  { id: "1", make: "טויוטה", model: "קורולה", year: 2023, price: 115000, km: 32000, dealer: "אוטו פלוס", status: "APPROVED" as const, views: 342 },
  { id: "2", make: "יונדאי", model: "טוסון", year: 2022, price: 145000, km: 48000, dealer: "מוטורס פלוס", status: "PENDING_APPROVAL" as const, views: 0 },
  { id: "3", make: "מאזדה", model: "CX-5", year: 2023, price: 165000, km: 25000, dealer: "צפון אוטו", status: "APPROVED" as const, views: 189 },
  { id: "4", make: "סקודה", model: "אוקטביה", year: 2024, price: 135000, km: 15000, dealer: "אוטו פלוס", status: "PENDING_APPROVAL" as const, views: 0 },
  { id: "5", make: "טסלה", model: "Model 3", year: 2023, price: 175000, km: 22000, dealer: "פרימיום מוטורס", status: "APPROVED" as const, views: 890 },
  { id: "6", make: "קיה", model: "פיקנטו", year: 2023, price: 65000, km: 20000, dealer: "דיל אוטו", status: "REJECTED" as const, views: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-white/10 text-white/60",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  SOLD: "bg-violet-500/10 text-violet-400",
};

export default function AdminCarsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">ניהול רכבים</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "מאושרים", count: MOCK_ADMIN_CARS.filter((c) => c.status === "APPROVED").length, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
          { label: "ממתינים", count: MOCK_ADMIN_CARS.filter((c) => c.status === "PENDING_APPROVAL").length, color: "border-amber-500/20 bg-amber-500/5 text-amber-400" },
          { label: "נדחו", count: MOCK_ADMIN_CARS.filter((c) => c.status === "REJECTED").length, color: "border-red-500/20 bg-red-500/5 text-red-400" },
          { label: "סה״כ", count: MOCK_ADMIN_CARS.length, color: "border-white/10 bg-white/[0.03] text-white" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-white/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Cars list */}
      <div className="space-y-3">
        {MOCK_ADMIN_CARS.map((car) => (
          <div
            key={car.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">{car.make} {car.model} {car.year}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[car.status]}`}>
                    {CAR_STATUS_LABELS[car.status]}
                  </span>
                </div>
                <p className="text-sm text-white/50">
                  {formatPrice(car.price)} · {formatKm(car.km)} · {car.dealer}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Eye className="h-3.5 w-3.5" />
                  {car.views}
                </span>

                {car.status === "PENDING_APPROVAL" && (
                  <>
                    <button className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      אשר
                    </button>
                    <button className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      דחה
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
