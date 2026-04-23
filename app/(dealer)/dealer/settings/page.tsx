"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { REGIONS } from "@/lib/constants";

type DealerForm = {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  region: string;
  address: string;
  description: string;
};

const EMPTY: DealerForm = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  city: "",
  region: "",
  address: "",
  description: "",
};

export default function DealerSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<DealerForm>(EMPTY);

  useEffect(() => {
    setLoading(true);
    fetch("/api/dealer/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.dealer) {
          setForm({
            businessName: data.dealer.businessName || "",
            contactName: data.dealer.contactName || "",
            phone: data.dealer.phone || "",
            email: data.dealer.email || "",
            city: data.dealer.city || "",
            region: data.dealer.region || "",
            address: data.dealer.address || "",
            description: data.dealer.description || "",
          });
        }
      })
      .catch(() => toast.error("לא ניתן לטעון את ההגדרות"))
      .finally(() => setLoading(false));
  }, []);

  const update = (field: keyof DealerForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/dealer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בשמירה");
      toast.success("ההגדרות נשמרו בהצלחה");
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
      <h1 className="text-2xl font-bold text-foreground mb-6">הגדרות</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={loading || saving} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">פרטי העסק</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>שם העסק *</label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>איש קשר *</label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>טלפון *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>אימייל</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>עיר</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>אזור</label>
                <select
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400 appearance-none disabled:opacity-50"
                >
                  <option value="">בחר אזור</option>
                  {Object.entries(REGIONS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>כתובת</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>תיאור העסק</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {saving ? "שומר..." : loading ? "טוען..." : "שמור שינויים"}
            <Save className="h-4 w-4" />
          </button>
        </fieldset>
      </form>
    </div>
  );
}
