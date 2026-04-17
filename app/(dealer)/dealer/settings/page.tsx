"use client";

import { useState } from "react";
import { Building2, Phone, MapPin, Save } from "lucide-react";
import { REGIONS } from "@/lib/constants";

export default function DealerSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-cyan-400";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">הגדרות</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">פרטי העסק</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>שם העסק</label>
              <input type="text" defaultValue="אוטו פלוס תל אביב" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>טלפון</label>
              <input type="tel" defaultValue="050-1234567" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>עיר</label>
              <input type="text" defaultValue="תל אביב" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>אזור</label>
              <select defaultValue="CENTER" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400 appearance-none">
                {Object.entries(REGIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>תיאור העסק</label>
              <textarea
                rows={3}
                defaultValue="סוכנות רכב מובילה בתל אביב. מתמחים ברכבים יד שנייה מאומתים."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-foreground transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "שומר..." : "שמור שינויים"}
          <Save className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
