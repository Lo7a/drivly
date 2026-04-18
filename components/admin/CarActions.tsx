"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export function CarActions({ carId }: { carId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("שגיאה בעדכון");
      toast.success(status === "APPROVED" ? "הרכב אושר" : "הרכב נדחה");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateStatus("APPROVED")}
        disabled={loading}
        className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        אשר
      </button>
      <button
        onClick={() => updateStatus("REJECTED")}
        disabled={loading}
        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
      >
        <XCircle className="h-3.5 w-3.5" />
        דחה
      </button>
    </div>
  );
}
