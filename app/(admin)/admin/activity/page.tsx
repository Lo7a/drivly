import { prisma } from "@/lib/prisma";
import { Activity, Car, User, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

async function getActivity() {
  try {
    const [cars, leads, users, dealers] = await Promise.all([
      prisma.car.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
        include: { dealer: { select: { businessName: true } } },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { car: { select: { make: true, model: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.dealer.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
    ]);

    const events: Array<{
      id: string;
      type: "car" | "lead" | "user" | "dealer";
      action: string;
      description: string;
      icon: string;
      color: string;
      timestamp: Date;
    }> = [];

    cars.forEach((car) => {
      events.push({
        id: `car-${car.id}`,
        type: "car",
        action: car.status === "APPROVED" ? "רכב אושר" : car.status === "REJECTED" ? "רכב נדחה" : car.status === "PENDING_APPROVAL" ? "רכב ממתין לאישור" : "רכב עודכן",
        description: `${car.make} ${car.model} ${car.year} · ${car.dealer.businessName}`,
        icon: "Car",
        color: car.status === "APPROVED" ? "emerald" : car.status === "REJECTED" ? "red" : "amber",
        timestamp: car.updatedAt,
      });
    });

    leads.forEach((lead) => {
      events.push({
        id: `lead-${lead.id}`,
        type: "lead",
        action: "ליד חדש",
        description: `${lead.fullName} · ${lead.car.make} ${lead.car.model} (${lead.type === "FINANCE" ? "מימון" : lead.type === "INSURANCE" ? "ביטוח" : "התקשרות"})`,
        icon: "FileText",
        color: "cyan",
        timestamp: lead.createdAt,
      });
    });

    users.forEach((user) => {
      events.push({
        id: `user-${user.id}`,
        type: "user",
        action: "משתמש נרשם",
        description: `${user.fullName} · ${user.role === "ADMIN" ? "אדמין" : user.role === "DEALER" ? "סוחר" : "לקוח"}`,
        icon: "User",
        color: "violet",
        timestamp: user.createdAt,
      });
    });

    dealers.forEach((dealer) => {
      events.push({
        id: `dealer-${dealer.id}`,
        type: "dealer",
        action: dealer.status === "APPROVED" ? "סוחר אושר" : dealer.status === "BLOCKED" ? "סוחר נחסם" : "סוחר חדש",
        description: dealer.businessName,
        icon: "User",
        color: dealer.status === "APPROVED" ? "emerald" : dealer.status === "BLOCKED" ? "red" : "amber",
        timestamp: dealer.updatedAt,
      });
    });

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
  } catch {
    return [];
  }
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  User,
  FileText,
};

const COLORS: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-500",
  red: "bg-red-500/10 text-red-500",
  amber: "bg-amber-500/10 text-amber-500",
  cyan: "bg-cyan-500/10 text-cyan-500",
  violet: "bg-violet-500/10 text-violet-500",
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דקות`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

export default async function ActivityPage() {
  const events = await getActivity();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">פעילות במערכת</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">אין פעילות</p>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => {
              const Icon = ICONS[event.icon] || Clock;
              return (
                <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${COLORS[event.color]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{timeAgo(event.timestamp)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
