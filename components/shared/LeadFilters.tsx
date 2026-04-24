"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Phone, Calculator, Shield, Sparkles } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "הכל" },
  { value: "NEW", label: "חדשים" },
  { value: "IN_PROGRESS", label: "בטיפול" },
  { value: "CLOSED", label: "סגורים" },
] as const;

const TYPE_OPTIONS = [
  { value: "all", label: "כל הסוגים", icon: Sparkles },
  { value: "CALL", label: "התקשרות", icon: Phone },
  { value: "FINANCE", label: "מימון", icon: Calculator },
  { value: "INSURANCE", label: "ביטוח", icon: Shield },
] as const;

export function LeadFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const currentType = searchParams.get("type") || "all";

  const buildUrl = (param: "status" | "type", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(param);
    else params.set(param, value);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold me-1">
          סטטוס:
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const active = currentStatus === opt.value;
          return (
            <Link
              key={opt.value}
              href={buildUrl("status", opt.value)}
              scroll={false}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold me-1">
          סוג:
        </span>
        {TYPE_OPTIONS.map((opt) => {
          const active = currentType === opt.value;
          const Icon = opt.icon;
          return (
            <Link
              key={opt.value}
              href={buildUrl("type", opt.value)}
              scroll={false}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3 w-3" />
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
