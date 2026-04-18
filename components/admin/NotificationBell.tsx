"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/notifications/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.total);
        }
      } catch {
        // silent
      }
    };

    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    // Real-time: subscribe to new leads via Supabase
    const supabase = createClient();
    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as { full_name?: string; type?: string };
          const typeLabel = lead.type === "FINANCE" ? "מימון" : lead.type === "INSURANCE" ? "ביטוח" : "התקשרות";
          toast.info(`ליד חדש! ${lead.full_name || ""} - ${typeLabel}`, {
            action: {
              label: "צפה",
              onClick: () => (window.location.href = "/admin/leads"),
            },
          });
          fetchCount();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cars" },
        () => fetchCount()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dealers" },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/admin/notifications"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="התראות"
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-1 -end-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
