import { CheckCircle, Clock, Ban } from "lucide-react";
import { DEALER_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { DealerActions } from "@/components/admin/DealerActions";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING: { color: "bg-amber-500/10 text-amber-500", icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED: { color: "bg-emerald-500/10 text-emerald-500", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  BLOCKED: { color: "bg-red-500/10 text-red-500", icon: <Ban className="h-3.5 w-3.5" /> },
};

async function getDealers() {
  try {
    const dealers = await prisma.dealer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { cars: true } },
      },
    });
    return dealers;
  } catch {
    return [];
  }
}

export default async function AdminDealersPage() {
  const dealers = await getDealers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">ניהול סוחרים</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-500">{dealers.filter((d) => d.status === "APPROVED").length}</p>
          <p className="text-xs text-muted-foreground mt-1">מאושרים</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{dealers.filter((d) => d.status === "PENDING").length}</p>
          <p className="text-xs text-muted-foreground mt-1">ממתינים</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{dealers.filter((d) => d.status === "BLOCKED").length}</p>
          <p className="text-xs text-muted-foreground mt-1">חסומים</p>
        </div>
      </div>

      <div className="space-y-3">
        {dealers.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">אין סוחרים במערכת</p>
        ) : (
          dealers.map((dealer) => {
            const statusConf = STATUS_CONFIG[dealer.status];
            return (
              <div
                key={dealer.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:bg-accent transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground">{dealer.businessName}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusConf.color}`}>
                        {statusConf.icon}
                        {DEALER_STATUS_LABELS[dealer.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dealer.contactName} · {dealer.phone} · {dealer.city} · {dealer._count.cars} רכבים
                    </p>
                  </div>

                  <DealerActions dealerId={dealer.id} currentStatus={dealer.status} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
