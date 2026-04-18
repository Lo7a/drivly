"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DealerActions({ dealerId, currentStatus }: { dealerId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "APPROVED" | "BLOCKED" | "PENDING") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dealers/${dealerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("שגיאה");
      const messages = { APPROVED: "הסוחר אושר", BLOCKED: "הסוחר נחסם", PENDING: "הסוחר שוחרר" };
      toast.success(messages[status]);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateStatus("APPROVED")}
          disabled={loading}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          אשר
        </button>
        <button
          onClick={() => updateStatus("BLOCKED")}
          disabled={loading}
          className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          דחה
        </button>
      </div>
    );
  }

  if (currentStatus === "APPROVED") {
    return (
      <button
        onClick={() => updateStatus("BLOCKED")}
        disabled={loading}
        className="rounded-lg bg-muted border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors disabled:opacity-50"
      >
        חסום
      </button>
    );
  }

  return (
    <button
      onClick={() => updateStatus("APPROVED")}
      disabled={loading}
      className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
    >
      שחרר
    </button>
  );
}
