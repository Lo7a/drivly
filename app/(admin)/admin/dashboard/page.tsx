import Link from "next/link";
import { Car, Users, FileText, TrendingUp, DollarSign, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LEAD_TYPE_LABELS } from "@/lib/constants";

const TYPE_COLORS: Record<string, string> = {
  CALL: "bg-amber-500/10 text-amber-500",
  FINANCE: "bg-cyan-500/10 text-cyan-500",
  INSURANCE: "bg-emerald-500/10 text-emerald-500",
};

async function getStats() {
  try {
    const [carsCount, dealersCount, leadsCount, newLeads, financeLeads, insuranceLeads, recentLeads] = await Promise.all([
      prisma.car.count({ where: { status: "APPROVED" } }),
      prisma.dealer.count({ where: { status: "APPROVED" } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { type: "FINANCE" } }),
      prisma.lead.count({ where: { type: "INSURANCE" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          car: { select: { make: true, model: true, year: true } },
        },
      }),
    ]);
    return { carsCount, dealersCount, leadsCount, newLeads, financeLeads, insuranceLeads, recentLeads };
  } catch {
    return { carsCount: 0, dealersCount: 0, leadsCount: 0, newLeads: 0, financeLeads: 0, insuranceLeads: 0, recentLeads: [] };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "רכבים זמינים", value: String(stats.carsCount), icon: Car, color: "text-cyan-500 bg-cyan-500/10" },
    { label: "סוחרים מאומתים", value: String(stats.dealersCount), icon: Users, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "לידים בסה״כ", value: String(stats.leadsCount), icon: FileText, color: "text-amber-500 bg-amber-500/10" },
    { label: "לידים חדשים", value: String(stats.newLeads), icon: TrendingUp, color: "text-violet-500 bg-violet-500/10" },
    { label: "לידי מימון", value: String(stats.financeLeads), icon: DollarSign, color: "text-cyan-500 bg-cyan-500/10" },
    { label: "לידי ביטוח", value: String(stats.insuranceLeads), icon: Phone, color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">דשבורד אדמין</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color} mb-2`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">לידים אחרונים</h2>
          <Link href="/admin/leads" className="text-xs text-primary hover:underline">
            הצג הכל →
          </Link>
        </div>

        {stats.recentLeads.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">אין לידים עדיין</p>
        ) : (
          <>
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
                  {stats.recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border hover:bg-accent transition-colors">
                      <td className="py-3 text-foreground font-medium">{lead.fullName}</td>
                      <td className="py-3 text-muted-foreground" dir="ltr">{lead.phone}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[lead.type]}`}>
                          {LEAD_TYPE_LABELS[lead.type]}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {lead.car.make} {lead.car.model} {lead.car.year}
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-3">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground text-sm">{lead.fullName}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}>
                      {LEAD_TYPE_LABELS[lead.type]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{lead.car.make} {lead.car.model} {lead.car.year}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground" dir="ltr">{lead.phone}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
