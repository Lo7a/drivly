import { Phone, Mail, MessageSquare, Calculator, Shield, FileText } from "lucide-react";
import Link from "next/link";
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

const TYPE_COLORS: Record<string, string> = {
  CALL: "bg-amber-500/10 text-amber-500",
  FINANCE: "bg-cyan-500/10 text-cyan-500",
  INSURANCE: "bg-emerald-500/10 text-emerald-500",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-cyan-500/10 text-cyan-500",
  IN_PROGRESS: "bg-amber-500/10 text-amber-500",
  CLOSED: "bg-muted text-muted-foreground",
};

const TYPE_ICONS = {
  CALL: Phone,
  FINANCE: Calculator,
  INSURANCE: Shield,
};

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
      car: { select: { slug: true, make: true, model: true, year: true } },
    },
    take: 200,
  });

  const newCount = leads.filter((l) => l.status === "NEW").length;
  const progressCount = leads.filter((l) => l.status === "IN_PROGRESS").length;
  const closedCount = leads.filter((l) => l.status === "CLOSED").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">הפניות שלי</h1>
          <p className="text-sm text-muted-foreground mt-1">
            כל הפניות שהגיעו אליך על הרכבים שלך
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-500">{newCount}</p>
          <p className="text-xs text-muted-foreground mt-1">חדשים</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{progressCount}</p>
          <p className="text-xs text-muted-foreground mt-1">בטיפול</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{closedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">סגורים</p>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">עדיין לא נרשמו פניות</p>
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
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-accent transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-foreground">{lead.fullName}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {LEAD_TYPE_LABELS[lead.type]}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[lead.status]}`}
                      >
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </div>
                    <Link
                      href={`/car/${lead.car.slug}`}
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {lead.car.make} {lead.car.model} {lead.car.year}
                    </Link>

                    {/* Type-specific details */}
                    {lead.type === "FINANCE" &&
                      (lead.downPayment || lead.months) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {lead.downPayment ? `מקדמה: ₪${lead.downPayment.toLocaleString()}` : ""}
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
                      <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                        <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{lead.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                      dir="ltr"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {lead.phone}
                    </a>
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-muted border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors"
                        title={lead.email}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("he-IL", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
