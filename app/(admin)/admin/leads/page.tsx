import { Phone, Mail, MessageSquare } from "lucide-react";
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

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

async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        car: { select: { make: true, model: true, year: true } },
        dealer: { select: { businessName: true } },
      },
      take: 100,
    });
    return leads;
  } catch {
    return [];
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  const newCount = leads.filter((l) => l.status === "NEW").length;
  const progressCount = leads.filter((l) => l.status === "IN_PROGRESS").length;
  const closedCount = leads.filter((l) => l.status === "CLOSED").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">ניהול לידים</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
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

      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">אין לידים עדיין</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-accent transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-foreground">{lead.fullName}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[lead.type]}`}>
                      {LEAD_TYPE_LABELS[lead.type]}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[lead.status]}`}>
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lead.car.make} {lead.car.model} {lead.car.year} · {lead.dealer.businessName}
                  </p>
                  {lead.message && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {lead.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
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
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleString("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
