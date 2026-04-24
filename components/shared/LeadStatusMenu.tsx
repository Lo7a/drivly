"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

type LeadStatus = "NEW" | "IN_PROGRESS" | "CLOSED";

const OPTIONS: { value: LeadStatus; className: string }[] = [
  { value: "NEW", className: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { value: "IN_PROGRESS", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { value: "CLOSED", className: "bg-muted text-muted-foreground border-border" },
];

export function LeadStatusMenu({
  leadId,
  current,
}: {
  leadId: string;
  current: LeadStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(current);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setStatus(current), [current]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const change = async (next: LeadStatus) => {
    if (next === status) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("שגיאה");
      setStatus(next);
      toast.success(`הסטטוס עודכן ל״${LEAD_STATUS_LABELS[next]}״`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה בעדכון");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const currentOpt = OPTIONS.find((o) => o.value === status)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50 ${currentOpt.className}`}
      >
        {LEAD_STATUS_LABELS[status]}
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div
          role="menu"
          dir="rtl"
          className="absolute z-20 mt-1 end-0 w-36 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => change(opt.value)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors text-start"
            >
              <span>{LEAD_STATUS_LABELS[opt.value]}</span>
              {opt.value === status && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
