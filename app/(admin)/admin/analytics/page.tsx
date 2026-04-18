import { prisma } from "@/lib/prisma";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { TrendingUp, Users, Car, FileText } from "lucide-react";

async function getAnalytics() {
  try {
    // Last 30 days leads
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leads = await prisma.lead.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "asc" },
    });

    // Group by day
    const leadsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
      leadsByDay[key] = 0;
    }
    leads.forEach((lead) => {
      const key = new Date(lead.createdAt).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
      if (key in leadsByDay) leadsByDay[key]++;
    });

    // By type
    const leadsByType = [
      { name: "התקשרות", value: leads.filter((l) => l.type === "CALL").length, color: "#f59e0b" },
      { name: "מימון", value: leads.filter((l) => l.type === "FINANCE").length, color: "#0891b2" },
      { name: "ביטוח", value: leads.filter((l) => l.type === "INSURANCE").length, color: "#10b981" },
    ].filter((t) => t.value > 0);

    // Top cars
    const topCarsRaw = await prisma.car.findMany({
      orderBy: { viewsCount: "desc" },
      take: 5,
      select: { make: true, model: true, year: true, viewsCount: true, leadsCount: true },
    });
    const topCars = topCarsRaw.map((c) => ({
      name: `${c.make} ${c.model} ${c.year}`,
      views: c.viewsCount,
      leads: c.leadsCount,
    }));

    // Top dealers
    const topDealersRaw = await prisma.dealer.findMany({
      where: { status: "APPROVED" },
      include: {
        cars: { select: { viewsCount: true } },
        _count: { select: { cars: true } },
      },
      take: 5,
    });
    const topDealers = topDealersRaw
      .map((d) => ({
        name: d.businessName,
        cars: d._count.cars,
        views: d.cars.reduce((sum, c) => sum + c.viewsCount, 0),
      }))
      .sort((a, b) => b.views - a.views);

    return {
      leadsByDay: Object.entries(leadsByDay).map(([date, count]) => ({ date, count })),
      leadsByType,
      topCars,
      topDealers,
      totals: {
        leads: leads.length,
        cars: topCarsRaw.length,
        dealers: topDealers.length,
        avgLeadsPerDay: Math.round(leads.length / 30),
      },
    };
  } catch {
    return {
      leadsByDay: [],
      leadsByType: [],
      topCars: [],
      topDealers: [],
      totals: { leads: 0, cars: 0, dealers: 0, avgLeadsPerDay: 0 },
    };
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  const kpis = [
    { label: "לידים ב-30 יום", value: data.totals.leads, icon: FileText, color: "text-cyan-500 bg-cyan-500/10" },
    { label: "ממוצע יומי", value: data.totals.avgLeadsPerDay, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "רכבים פעילים", value: data.totals.cars, icon: Car, color: "text-amber-500 bg-amber-500/10" },
    { label: "סוחרים פעילים", value: data.totals.dealers, icon: Users, color: "text-violet-500 bg-violet-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">אנליטיקס</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color} mb-2`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts
        leadsByDay={data.leadsByDay}
        leadsByType={data.leadsByType}
        topCars={data.topCars}
        topDealers={data.topDealers}
      />
    </div>
  );
}
