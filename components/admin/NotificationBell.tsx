"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, FileText, Car, UserPlus, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { RecentNotification } from "@/app/api/admin/notifications/recent/route";

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string }> = {
  lead: { icon: FileText, bg: "bg-cyan-500/10 text-cyan-500" },
  car: { icon: Car, bg: "bg-amber-500/10 text-amber-500" },
  dealer: { icon: UserPlus, bg: "bg-violet-500/10 text-violet-500" },
};

const LEAD_TYPE_LABEL: Record<string, string> = {
  CALL: "התקשרות",
  FINANCE: "מימון",
  INSURANCE: "ביטוח",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

function notificationHref(n: RecentNotification): string {
  if (n.kind === "lead") return "/admin/leads";
  if (n.kind === "car") return "/admin/cars";
  return "/admin/dealers";
}

function notificationTitle(n: RecentNotification): string {
  if (n.kind === "lead") return `${n.fullName} — ${LEAD_TYPE_LABEL[n.leadType] ?? n.leadType}`;
  if (n.kind === "car") return `רכב חדש לאישור: ${n.carLabel}`;
  return `סוחר חדש: ${n.businessName}`;
}

function notificationSub(n: RecentNotification): string {
  if (n.kind === "lead") return `${n.carLabel} · ${n.phone}`;
  if (n.kind === "car") return n.dealerName;
  return `${n.contactName} · ${n.phone}`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<RecentNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/notifications/recent");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);

    const supabase = createClient();
    const channel = supabase
      .channel("notif-bell")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as { full_name?: string; type?: string };
          const label = LEAD_TYPE_LABEL[lead.type ?? ""] ?? "התקשרות";
          toast.info(`ליד חדש! ${lead.full_name || ""} — ${label}`, {
            action: {
              label: "צפה",
              onClick: () => (window.location.href = "/admin/leads"),
            },
          });
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cars" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dealers" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleOpen}
        aria-label="התראות"
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {total > 0 && (
          <span className="absolute -top-1 -end-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          dir="rtl"
          className="absolute top-full mt-2 end-0 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">התראות</span>
              {total > 0 && (
                <span className="rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                  {total}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {items.length > 0 ? "5 אחרונות" : ""}
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                טוען…
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">אין התראות חדשות</p>
                <p className="text-xs text-muted-foreground mt-1">הכל תחת שליטה</p>
              </div>
            ) : (
              <div className="py-1">
                {items.map((n) => {
                  const meta = TYPE_META[n.kind];
                  const Icon = meta.icon;
                  return (
                    <Link
                      key={`${n.kind}-${n.id}`}
                      href={notificationHref(n)}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {notificationTitle(n)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {notificationSub(n)}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-border">
            <Link
              href="/admin/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 px-4 py-3 text-sm font-semibold text-primary hover:bg-accent transition-colors"
            >
              הצג את כל ההתראות
              {total > items.length && (
                <span className="text-xs text-muted-foreground">({total})</span>
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
