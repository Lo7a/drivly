import { Phone, Mail, MessageSquare, Filter } from "lucide-react";
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants";

const MOCK_LEADS = [
  { id: "1", fullName: "ישראל כהן", phone: "050-1234567", email: "israel@gmail.com", type: "FINANCE" as const, status: "NEW" as const, car: "טויוטה קורולה 2023", dealer: "אוטו פלוס", message: "מעוניין במימון ל-48 חודשים", createdAt: "17/04/2026 14:32" },
  { id: "2", fullName: "שרה לוי", phone: "052-9876543", email: "", type: "INSURANCE" as const, status: "NEW" as const, car: "יונדאי טוסון 2022", dealer: "מוטורס פלוס", message: "", createdAt: "17/04/2026 13:15" },
  { id: "3", fullName: "דוד אברהם", phone: "054-5551234", email: "david@walla.co.il", type: "CALL" as const, status: "IN_PROGRESS" as const, car: "מאזדה CX-5 2023", dealer: "צפון אוטו", message: "רוצה לתאם נסיעת מבחן", createdAt: "17/04/2026 11:45" },
  { id: "4", fullName: "רחל מזרחי", phone: "050-7778888", email: "rachel@gmail.com", type: "FINANCE" as const, status: "CLOSED" as const, car: "סקודה אוקטביה 2024", dealer: "אוטו פלוס", message: "מקדמה 30,000₪", createdAt: "16/04/2026 18:20" },
  { id: "5", fullName: "משה גולד", phone: "053-1112222", email: "", type: "INSURANCE" as const, status: "NEW" as const, car: "טסלה Model 3 2023", dealer: "פרימיום מוטורס", message: "גיל 28, נהג צעיר", createdAt: "16/04/2026 15:10" },
  { id: "6", fullName: "יעל ביטון", phone: "058-3334444", email: "yael@gmail.com", type: "CALL" as const, status: "IN_PROGRESS" as const, car: "קיה פיקנטו 2023", dealer: "דיל אוטו", message: "", createdAt: "16/04/2026 10:00" },
];

const TYPE_COLORS: Record<string, string> = {
  CALL: "bg-amber-500/10 text-amber-400",
  FINANCE: "bg-cyan-500/10 text-cyan-400",
  INSURANCE: "bg-emerald-500/10 text-emerald-400",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-cyan-500/10 text-cyan-400",
  IN_PROGRESS: "bg-amber-500/10 text-amber-400",
  CLOSED: "bg-white/10 text-white/50",
};

export default function AdminLeadsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">ניהול לידים</h1>
        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition-colors">
          <Filter className="h-4 w-4" />
          סינון
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{MOCK_LEADS.filter((l) => l.status === "NEW").length}</p>
          <p className="text-xs text-white/50 mt-1">חדשים</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{MOCK_LEADS.filter((l) => l.status === "IN_PROGRESS").length}</p>
          <p className="text-xs text-white/50 mt-1">בטיפול</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-2xl font-bold text-white/50">{MOCK_LEADS.filter((l) => l.status === "CLOSED").length}</p>
          <p className="text-xs text-white/50 mt-1">סגורים</p>
        </div>
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {MOCK_LEADS.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Name + contact */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">{lead.fullName}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}>
                    {LEAD_TYPE_LABELS[lead.type]}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[lead.status]}`}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </span>
                </div>
                <p className="text-sm text-white/50">{lead.car} · {lead.dealer}</p>
                {lead.message && (
                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {lead.message}
                  </p>
                )}
              </div>

              {/* Contact actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {lead.phone}
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                <span className="text-[10px] text-white/30">{lead.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
