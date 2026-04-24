import { Car, Eye, FileText, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import { CAR_STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getDealerStats() {
  try {
    const user = await getUser();
    if (!user?.dealer) return null;

    const [cars, activityCars] = await Promise.all([
      prisma.car.findMany({
        where: { dealerId: user.dealer.id },
        select: { id: true, status: true, viewsCount: true, leadsCount: true, make: true, model: true, year: true, updatedAt: true },
      }),
      prisma.car.findMany({
        where: { dealerId: user.dealer.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { make: true, model: true, year: true, status: true, updatedAt: true },
      }),
    ]);

    const approved = cars.filter((c) => c.status === "APPROVED");
    const totalViews = cars.reduce((sum, c) => sum + c.viewsCount, 0);
    const totalLeads = cars.reduce((sum, c) => sum + c.leadsCount, 0);
    const pending = cars.filter((c) => c.status === "PENDING_APPROVAL").length;

    return {
      activeCars: approved.length,
      totalCars: cars.length,
      totalViews,
      totalLeads,
      pending,
      activity: activityCars,
    };
  } catch {
    return null;
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דקות`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

export default async function DealerDashboardPage() {
  const stats = await getDealerStats();

  const cards = [
    {
      label: "רכבים פעילים",
      value: String(stats?.activeCars ?? 0),
      sub: stats?.pending ? `${stats.pending} ממתין לאישור` : undefined,
      icon: Car,
      color: "text-cyan-500 bg-cyan-500/10",
    },
    {
      label: "צפיות",
      value: stats?.totalViews.toLocaleString("he-IL") ?? "0",
      icon: Eye,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "לידים",
      value: String(stats?.totalLeads ?? 0),
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "סה״כ רכבים",
      value: String(stats?.totalCars ?? 0),
      icon: TrendingUp,
      color: "text-violet-500 bg-violet-500/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">דשבורד סוחר</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
            {sub && <p className="text-[10px] text-amber-500 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">פעילות אחרונה</h2>
        {!stats?.activity || stats.activity.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            עדיין אין פעילות. <a href="/dealer/cars/new" className="text-primary hover:underline">הוסף רכב ראשון</a>
          </p>
        ) : (
          <div className="space-y-3">
            {stats.activity.map((car, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm text-foreground">
                  {car.make} {car.model} {car.year} — {CAR_STATUS_LABELS[car.status]}
                </p>
                <p className="text-xs text-muted-foreground shrink-0">{timeAgo(car.updatedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
