import { CheckCircle, XCircle, Clock, Ban } from "lucide-react";
import { DEALER_STATUS_LABELS, REGIONS } from "@/lib/constants";

const MOCK_DEALERS = [
  { id: "1", businessName: "אוטו פלוס תל אביב", contactName: "יוסי כהן", phone: "050-1234567", city: "תל אביב", region: "CENTER" as const, status: "APPROVED" as const, carsCount: 12 },
  { id: "2", businessName: "מוטורס פלוס", contactName: "דני לוי", phone: "052-2345678", city: "רמת גן", region: "CENTER" as const, status: "APPROVED" as const, carsCount: 8 },
  { id: "3", businessName: "רכבי הצפון", contactName: "אבי מזרחי", phone: "054-3456789", city: "חיפה", region: "HAIFA" as const, status: "PENDING" as const, carsCount: 0 },
  { id: "4", businessName: "דיל אוטו", contactName: "משה גולדשטיין", phone: "050-4567890", city: "תל אביב", region: "TEL_AVIV" as const, status: "APPROVED" as const, carsCount: 15 },
  { id: "5", businessName: "סאות' מוטורס", contactName: "רון אברהם", phone: "058-5678901", city: "באר שבע", region: "SOUTH" as const, status: "BLOCKED" as const, carsCount: 3 },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING: { color: "bg-amber-500/10 text-amber-400", icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED: { color: "bg-emerald-500/10 text-emerald-400", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  BLOCKED: { color: "bg-red-500/10 text-red-400", icon: <Ban className="h-3.5 w-3.5" /> },
};

export default function AdminDealersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">ניהול סוחרים</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{MOCK_DEALERS.filter((d) => d.status === "APPROVED").length}</p>
          <p className="text-xs text-white/50 mt-1">מאושרים</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{MOCK_DEALERS.filter((d) => d.status === "PENDING").length}</p>
          <p className="text-xs text-white/50 mt-1">ממתינים</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{MOCK_DEALERS.filter((d) => d.status === "BLOCKED").length}</p>
          <p className="text-xs text-white/50 mt-1">חסומים</p>
        </div>
      </div>

      {/* Dealers list */}
      <div className="space-y-3">
        {MOCK_DEALERS.map((dealer) => {
          const statusConf = STATUS_CONFIG[dealer.status];
          return (
            <div
              key={dealer.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white">{dealer.businessName}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusConf.color}`}>
                      {statusConf.icon}
                      {DEALER_STATUS_LABELS[dealer.status]}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">
                    {dealer.contactName} · {dealer.phone} · {dealer.city} · {dealer.carsCount} רכבים
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {dealer.status === "PENDING" && (
                    <>
                      <button className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                        אשר
                      </button>
                      <button className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                        דחה
                      </button>
                    </>
                  )}
                  {dealer.status === "APPROVED" && (
                    <button className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 transition-colors">
                      חסום
                    </button>
                  )}
                  {dealer.status === "BLOCKED" && (
                    <button className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                      שחרר
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
