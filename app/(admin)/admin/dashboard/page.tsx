import { Car, Users, FileText, TrendingUp, DollarSign, Phone } from "lucide-react";

const STATS = [
  { label: "רכבים זמינים", value: "2,847", icon: Car, color: "text-cyan-500 bg-cyan-500/10", change: "+12%" },
  { label: "סוחרים מאומתים", value: "156", icon: Users, color: "text-emerald-500 bg-emerald-500/10", change: "+5" },
  { label: "לידים החודש", value: "1,248", icon: FileText, color: "text-amber-500 bg-amber-500/10", change: "+23%" },
  { label: "לידים מימון", value: "487", icon: DollarSign, color: "text-violet-500 bg-violet-500/10", change: "+18%" },
  { label: "לידים ביטוח", value: "312", icon: Phone, color: "text-rose-500 bg-rose-500/10", change: "+9%" },
  { label: "צמיחה חודשית", value: "+15%", icon: TrendingUp, color: "text-cyan-500 bg-cyan-500/10", change: "" },
];

const RECENT_LEADS = [
  { name: "ישראל כהן", phone: "050-1234567", type: "מימון", car: "טויוטה קורולה 2023", time: "לפני 12 דקות" },
  { name: "שרה לוי", phone: "052-9876543", type: "ביטוח", car: "יונדאי טוסון 2022", time: "לפני שעה" },
  { name: "דוד אברהם", phone: "054-5551234", type: "התקשרות", car: "מאזדה CX-5 2023", time: "לפני שעתיים" },
  { name: "רחל מזרחי", phone: "050-7778888", type: "מימון", car: "סקודה אוקטביה 2024", time: "לפני 3 שעות" },
  { name: "משה גולד", phone: "053-1112222", type: "ביטוח", car: "טסלה Model 3 2023", time: "אתמול" },
];

const TYPE_COLORS: Record<string, string> = {
  מימון: "bg-cyan-500/10 text-cyan-400",
  ביטוח: "bg-emerald-500/10 text-emerald-400",
  התקשרות: "bg-amber-500/10 text-amber-400",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">דשבורד אדמין</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color} mb-2`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              {change && <span className="text-[10px] text-emerald-400">{change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads — THE key screen */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">לידים אחרונים</h2>
          <a href="/admin/leads" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            הצג הכל →
          </a>
        </div>

        {/* Table — desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-start py-3 font-medium">שם</th>
                <th className="text-start py-3 font-medium">טלפון</th>
                <th className="text-start py-3 font-medium">סוג</th>
                <th className="text-start py-3 font-medium">רכב</th>
                <th className="text-start py-3 font-medium">זמן</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_LEADS.map((lead) => (
                <tr key={lead.phone} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="py-3 text-foreground font-medium">{lead.name}</td>
                  <td className="py-3 text-muted-foreground dir-ltr">{lead.phone}</td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[lead.type]}`}>
                      {lead.type}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{lead.car}</td>
                  <td className="py-3 text-muted-foreground text-xs">{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="sm:hidden space-y-3">
          {RECENT_LEADS.map((lead) => (
            <div key={lead.phone} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-foreground text-sm">{lead.name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}>
                  {lead.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{lead.car}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{lead.phone}</p>
                <p className="text-[10px] text-muted-foreground">{lead.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
