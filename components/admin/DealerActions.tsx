"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, CheckCircle } from "lucide-react";

export function DealerActions({
  dealerId,
  currentStatus,
}: {
  dealerId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "APPROVED" | "BLOCKED") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dealers/${dealerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("שגיאה");
      toast.success(status === "BLOCKED" ? "הסוחר נחסם" : "החסימה הוסרה");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "BLOCKED") {
    return (
      <button
        onClick={() => updateStatus("APPROVED")}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        הסר חסימה
      </button>
    );
  }

  // APPROVED (or any non-blocked state) → offer Block
  return (
    <button
      onClick={() => updateStatus("BLOCKED")}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors disabled:opacity-50 cursor-pointer"
    >
      <Ban className="h-3.5 w-3.5" />
      חסום
    </button>
  );
}
