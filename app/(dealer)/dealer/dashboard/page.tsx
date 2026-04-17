import { Car, Eye, MousePointerClick, TrendingUp } from "lucide-react";

const STATS = [
  { label: "רכבים פעילים", value: "8", icon: Car, color: "text-cyan-500 bg-cyan-500/10" },
  { label: "צפיות החודש", value: "1,247", icon: Eye, color: "text-emerald-500 bg-emerald-500/10" },
  { label: "קליקים", value: "342", icon: MousePointerClick, color: "text-amber-500 bg-amber-500/10" },
  { label: "מגמה", value: "+12%", icon: TrendingUp, color: "text-violet-500 bg-violet-500/10" },
];

export default function DealerDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">דשבורד סוחר</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white mb-4">פעילות אחרונה</h2>
        <div className="space-y-3">
          {[
            { text: 'רכב "טויוטה קורולה 2023" אושר', time: "לפני שעתיים" },
            { text: "342 צפיות ברכבים שלך השבוע", time: "לפני 3 שעות" },
            { text: 'רכב "יונדאי טוסון 2022" ממתין לאישור', time: "אתמול" },
          ].map(({ text, time }) => (
            <div key={text} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <p className="text-sm text-white/70">{text}</p>
              <p className="text-xs text-white/30">{time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
