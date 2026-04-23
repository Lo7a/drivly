"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Phone, Fuel, Save, Mail } from "lucide-react";

type Settings = {
  siteName: string;
  adminPhone: string;
  adminEmail: string;
  fuelPrice: number;
};

const EMPTY: Settings = {
  siteName: "",
  adminPhone: "",
  adminEmail: "",
  fuelPrice: 7.5,
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Settings>(EMPTY);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setForm({
            siteName: data.settings.siteName ?? "",
            adminPhone: data.settings.adminPhone ?? "",
            adminEmail: data.settings.adminEmail ?? "",
            fuelPrice: data.settings.fuelPrice ?? 7.5,
          });
        }
      })
      .catch(() => toast.error("לא ניתן לטעון את ההגדרות"))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בשמירה");
      toast.success("ההגדרות נשמרו");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-cyan-400 disabled:opacity-50";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">הגדרות מערכת</h1>

      <fieldset disabled={loading || saving} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-cyan-500" />
            <h2 className="text-lg font-bold text-foreground">פרטי קשר</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>שם האתר</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>טלפון אדמין (לידים)</label>
              <input
                type="tel"
                value={form.adminPhone}
                onChange={(e) => update("adminPhone", e.target.value)}
                className={inputClass}
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                מופיע בדף רכב לצד כפתורי מימון/ביטוח
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>
                <Mail className="inline h-3.5 w-3.5 me-1" />
                אימייל אדמין
              </label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => update("adminEmail", e.target.value)}
                className={inputClass}
                placeholder="admin@drivly.co.il"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">מחיר דלק</h2>
          </div>
          <div className="max-w-xs">
            <label className={labelClass}>מחיר לליטר (₪)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.fuelPrice}
              onChange={(e) => update("fuelPrice", Number(e.target.value))}
              className={inputClass}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              משמש במחשבון עלות חודשית בדף הרכב
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {saving ? "שומר..." : loading ? "טוען..." : "שמור הגדרות"}
          <Save className="h-4 w-4" />
        </button>
      </fieldset>
    </div>
  );
}
