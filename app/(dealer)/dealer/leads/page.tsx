import { Phone, Mail, MessageSquare, Calculator, Shield, FileText } from "lucide-react";
import Link from "next/link";
import { LEAD_TYPE_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import { LeadFilters } from "@/components/shared/LeadFilters";
import { LeadStatusMenu } from "@/components/shared/LeadStatusMenu";
import type { LeadStatus, LeadType } from "@prisma/client";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  CALL: "bg-amber-500/10 text-amber-500",
  FINANCE: "bg-cyan-500/10 text-cyan-500",
  INSURANCE: "bg-emerald-500/10 text-emerald-500",
};

const TYPE_ICONS = {
  CALL: Phone,
  FINANCE: Calculator,
  INSURANCE: Shield,
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

interface PageProps {
  searchParams: Promise<{ status?: string; type?: string }>;
}

export default async function DealerLeadsPage({ searchParams }: PageProps) {
  const user = await getUser();
  if (!user?.dealer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">לא נמצא פרופיל סוחר</p>
      </div>
    );
  }

  const params = await searchParams;

  const where: { dealerId: string; status?: LeadStatus; type?: LeadType } = {
    dealerId: user.dealer.id,
  };
  if (params.status && ["NEW", "IN_PROGRESS", "CLOSED"].includes(params.status)) {
    where.status = params.status as LeadStatus;
  }
  if (params.type && ["CALL", "FINANCE", "INSURANCE"].includes(params.type)) {
    where.type = params.type as LeadType;
  }

  const [leads, totals] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        car: { select: { slug: true, make: true, model: true, year: true } },
      },
      take: 200,
    }),
    prisma.lead.groupBy({
      by: ["status"],
      where: { dealerId: user.dealer.id },
      _count: { _all: true },
    }),
  ]);

  const counts = {
    NEW: totals.find((t) => t.status === "NEW")?._count._all ?? 0,
    IN_PROGRESS: totals.find((t) => t.status === "IN_PROGRESS")?._count._all ?? 0,
    CLOSED: totals.find((t) => t.status === "CLOSED")?._count._all ?? 0,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">הפניות שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {leads.length} פניות מוצגות · {counts.NEW} חדשות · {counts.IN_PROGRESS} בטיפול
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-500">{counts.NEW}</p>
          <p className="text-xs text-muted-foreground mt-1">חדשים</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{counts.IN_PROGRESS}</p>
          <p className="text-xs text-muted-foreground mt-1">בטיפול</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{counts.CLOSED}</p>
          <p className="text-xs text-muted-foreground mt-1">סגורים</p>
        </div>
      </div>

      <LeadFilters />

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">אין עדיין פניות</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            ברגע שלקוחות יתעניינו ברכבים שלך, הפניות יופיעו כאן
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const TypeIcon = TYPE_ICONS[lead.type];
            return (
              <div
                key={lead.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-accent/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <p className="font-bold text-foreground">{lead.fullName}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {LEAD_TYPE_LABELS[lead.type]}
                      </span>
                      <LeadStatusMenu leadId={lead.id} current={lead.status} />
                    </div>

                    <Link
                      href={`/car/${lead.car.slug}`}
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {lead.car.make} {lead.car.model} {lead.car.year}
                    </Link>

                    {lead.type === "FINANCE" && (lead.downPayment || lead.months) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {lead.downPayment
                          ? `מקדמה: ${lead.downPayment.toLocaleString("he-IL")}₪`
                          : ""}
                        {lead.downPayment && lead.months ? " · " : ""}
                        {lead.months ? `${lead.months} חודשים` : ""}
                      </p>
                    )}
                    {lead.type === "INSURANCE" && lead.driverAge && (
                      <p className="text-xs text-muted-foreground mt-1">
                        גיל נהג: {lead.driverAge}
                        {lead.youngDriver ? " · נהג צעיר" : ""}
                      </p>
                    )}

                    {lead.message && (
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
                        <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{lead.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                        dir="ltr"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {lead.phone}
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-muted border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                          title={lead.email}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(lead.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
