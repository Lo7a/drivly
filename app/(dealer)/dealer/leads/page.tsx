import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import { FileText, Clock, Phone, Calculator, Shield, Info } from "lucide-react";
import { LEAD_TYPE_LABELS } from "@/lib/constants";
import Link from "next/link";

const TYPE_ICONS = {
  CALL: Phone,
  FINANCE: Calculator,
  INSURANCE: Shield,
};

const TYPE_COLORS = {
  CALL: "text-amber-500 bg-amber-500/10",
  FINANCE: "text-cyan-500 bg-cyan-500/10",
  INSURANCE: "text-emerald-500 bg-emerald-500/10",
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `לפני ${days} ימים`;
  const weeks = Math.floor(days / 7);
  return `לפני ${weeks} שב׳`;
}

export default async function DealerLeadsPage() {
  const user = await getUser();
  if (!user?.dealer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">לא נמצא פרופיל סוחר</p>
      </div>
    );
  }

  const leads = await prisma.lead.findMany({
    where: { dealerId: user.dealer.id },
    orderBy: { createdAt: "desc" },
    include: {
      car: { select: { id: true, slug: true, make: true, model: true, year: true } },
    },
  });

  // Group by car
  const byCar = new Map<
    string,
    {
      car: { id: string; slug: string; make: string; model: string; year: number };
      total: number;
      newCount: number;
      typeCounts: Record<string, number>;
      latest: Date;
    }
  >();

  for (const lead of leads) {
    const existing = byCar.get(lead.car.id);
    if (existing) {
      existing.total++;
      if (lead.status === "NEW") existing.newCount++;
      existing.typeCounts[lead.type] = (existing.typeCounts[lead.type] || 0) + 1;
      if (lead.createdAt > existing.latest) existing.latest = lead.createdAt;
    } else {
      byCar.set(lead.car.id, {
        car: lead.car,
        total: 1,
        newCount: lead.status === "NEW" ? 1 : 0,
        typeCounts: { [lead.type]: 1 },
        latest: lead.createdAt,
      });
    }
  }

  const cars = Array.from(byCar.values()).sort(
    (a, b) => b.latest.getTime() - a.latest.getTime()
  );

  const totalNew = leads.filter((l) => l.status === "NEW").length;
  const totalInProgress = leads.filter((l) => l.status === "IN_PROGRESS").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">לידים</h1>
          <p className="text-sm text-muted-foreground mt-1">
            כמות הפניות שקיבלת על הרכבים שלך
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-foreground">איך זה עובד?</p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
            לקוחות מעוניינים ממלאים טופס בדף הרכב שלך. אנחנו מטפלים בהם ומעבירים אליך את הרלוונטיים.
            בינתיים, כאן אפשר לראות כמה פניות כל רכב משך ובאיזה נושא.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <p className="text-[11px] uppercase tracking-widest text-cyan-500 font-semibold">חדשים</p>
          <p className="text-3xl font-bold text-foreground mt-2">{totalNew}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-[11px] uppercase tracking-widest text-amber-500 font-semibold">בטיפול</p>
          <p className="text-3xl font-bold text-foreground mt-2">{totalInProgress}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">סה״כ</p>
          <p className="text-3xl font-bold text-foreground mt-2">{leads.length}</p>
        </div>
      </div>

      {/* Per-car breakdown */}
      {cars.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">עדיין לא נרשמו פניות</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            ברגע שלקוחות יתעניינו ברכבים שלך, הפניות יופיעו כאן
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            פניות לפי רכב
          </h2>
          {cars.map(({ car, total, newCount, typeCounts, latest }) => (
            <div
              key={car.id}
              className="rounded-2xl border border-border bg-card p-5 hover:bg-accent/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/car/${car.slug}`}
                    target="_blank"
                    className="font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {car.make} {car.model} {car.year}
                  </Link>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>פנייה אחרונה {timeAgo(latest)}</span>
                  </div>
                </div>

                {/* Type breakdown */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(["CALL", "FINANCE", "INSURANCE"] as const).map((type) => {
                    const count = typeCounts[type] || 0;
                    if (count === 0) return null;
                    const Icon = TYPE_ICONS[type];
                    return (
                      <div
                        key={type}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_COLORS[type]}`}
                        title={LEAD_TYPE_LABELS[type]}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {count}
                      </div>
                    );
                  })}
                </div>

                {/* Total + new badge */}
                <div className="flex items-center gap-3 sm:min-w-[100px] sm:justify-end">
                  <div className="text-end">
                    <p className="text-2xl font-bold text-foreground tabular-nums">{total}</p>
                    <p className="text-[10px] text-muted-foreground">פניות</p>
                  </div>
                  {newCount > 0 && (
                    <span className="rounded-full bg-cyan-500 text-white px-2 py-0.5 text-[10px] font-bold">
                      {newCount} חדשות
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
