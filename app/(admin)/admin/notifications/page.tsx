import { prisma } from "@/lib/prisma";
import { Bell, FileText, UserPlus, Car, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getNotifications() {
  try {
    const [newLeads, pendingDealers, pendingCars] = await Promise.all([
      prisma.lead.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { car: { select: { make: true, model: true } } },
      }),
      prisma.dealer.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.car.findMany({
        where: { status: "PENDING_APPROVAL" },
        orderBy: { createdAt: "desc" },
        include: { dealer: { select: { businessName: true } } },
      }),
    ]);

    return { newLeads, pendingDealers, pendingCars };
  } catch {
    return { newLeads: [], pendingDealers: [], pendingCars: [] };
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

export default async function NotificationsPage() {
  const { newLeads, pendingDealers, pendingCars } = await getNotifications();
  const total = newLeads.length + pendingDealers.length + pendingCars.length;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">התראות</h1>
        {total > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold h-6 min-w-6 px-2">
            {total}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-cyan-500" />
            <p className="text-sm font-medium text-foreground">לידים חדשים</p>
          </div>
          <p className="text-3xl font-bold text-cyan-500">{newLeads.length}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-foreground">רכבים ממתינים</p>
          </div>
          <p className="text-3xl font-bold text-amber-500">{pendingCars.length}</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-medium text-foreground">סוחרים ממתינים</p>
          </div>
          <p className="text-3xl font-bold text-violet-500">{pendingDealers.length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* New leads */}
        {newLeads.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-500" />
              לידים חדשים ({newLeads.length})
            </h2>
            <div className="space-y-2">
              {newLeads.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/leads"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {lead.fullName} - {lead.type === "FINANCE" ? "מימון" : lead.type === "INSURANCE" ? "ביטוח" : "התקשרות"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {lead.car.make} {lead.car.model} · {lead.phone}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(lead.createdAt)}</span>
                </Link>
              ))}
              {newLeads.length > 5 && (
                <Link href="/admin/leads" className="block text-center text-xs text-primary hover:underline pt-2">
                  הצג את כל {newLeads.length} הלידים
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Pending cars */}
        {pendingCars.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-500" />
              רכבים ממתינים לאישור ({pendingCars.length})
            </h2>
            <div className="space-y-2">
              {pendingCars.map((car) => (
                <Link
                  key={car.id}
                  href="/admin/cars"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Car className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {car.make} {car.model} {car.year}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {car.dealer.businessName}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(car.createdAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pending dealers */}
        {pendingDealers.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-violet-500" />
              סוחרים ממתינים לאישור ({pendingDealers.length})
            </h2>
            <div className="space-y-2">
              {pendingDealers.map((dealer) => (
                <Link
                  key={dealer.id}
                  href="/admin/dealers"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{dealer.businessName}</p>
                    <p className="text-xs text-muted-foreground truncate">{dealer.contactName} · {dealer.phone}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(dealer.createdAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">אין התראות חדשות</p>
          </div>
        )}
      </div>
    </div>
  );
}
