"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, REGIONS, HAND_OPTIONS } from "@/lib/constants";

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [form, setForm] = useState({
    model: "",
    year: "",
    price: "",
    km: "",
    hand: "1",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    engineSize: "",
    color: "",
    region: "",
    city: "",
    description: "",
    hasFinancing: false,
    hasTradeIn: false,
    hasWarranty: false,
  });

  const models = CAR_MAKES.find((m) => m.value === selectedMake)?.models || [];

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMake) {
      toast.error("בחר יצרן");
      return;
    }

    setLoading(true);
    try {
      const makeLabel = CAR_MAKES.find((m) => m.value === selectedMake)?.label || selectedMake;
      const slug = `${selectedMake}-${form.model.toLowerCase().replace(/\s+/g, "-")}-${form.year}-${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          make: makeLabel,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          km: Number(form.km),
          hand: Number(form.hand),
          fuelType: form.fuelType,
          transmission: form.transmission,
          engineSize: form.engineSize ? Number(form.engineSize) : null,
          color: form.color || null,
          region: form.region || null,
          description: form.description || null,
          hasFinancing: form.hasFinancing,
          hasTradeIn: form.hasTradeIn,
          hasWarranty: form.hasWarranty,
          status: "PENDING_APPROVAL",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה");
      }

      toast.success("הרכב נשלח לאישור!");
      router.push("/dealer/cars");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-cyan-400";
  const selectClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400 appearance-none";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">הוספת רכב חדש</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">פרטי הרכב</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>יצרן *</label>
              <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className={selectClass} required>
                <option value="">בחר יצרן</option>
                {CAR_MAKES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>דגם *</label>
              <select value={form.model} onChange={(e) => update("model", e.target.value)} className={selectClass} required disabled={!selectedMake}>
                <option value="">בחר דגם</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>שנה *</label>
              <select value={form.year} onChange={(e) => update("year", e.target.value)} className={selectClass} required>
                <option value="">בחר שנה</option>
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>מחיר (₪) *</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="115000" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>קילומטראז *</label>
              <input type="number" value={form.km} onChange={(e) => update("km", e.target.value)} placeholder="32000" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>יד *</label>
              <select value={form.hand} onChange={(e) => update("hand", e.target.value)} className={selectClass} required>
                {HAND_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">מפרט טכני</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>סוג דלק *</label>
              <select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} className={selectClass} required>
                {Object.entries(FUEL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>תיבת הילוכים *</label>
              <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)} className={selectClass} required>
                {Object.entries(TRANSMISSION_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>נפח מנוע (סמ&quot;ק)</label>
              <input type="number" value={form.engineSize} onChange={(e) => update("engineSize", e.target.value)} placeholder="1800" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>צבע</label>
              <input type="text" value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="לבן" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>אזור *</label>
              <select value={form.region} onChange={(e) => update("region", e.target.value)} className={selectClass} required>
                <option value="">בחר אזור</option>
                {Object.entries(REGIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>עיר</label>
              <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="תל אביב" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">תיאור</h2>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="תארו את הרכב — מצב, היסטוריה, אבזור מיוחד..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">אפשרויות נוספות</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "hasFinancing", label: "מימון זמין" },
              { id: "hasTradeIn", label: "טרייד אין" },
              { id: "hasWarranty", label: "אחריות" },
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[id as keyof typeof form] as boolean}
                  onChange={(e) => update(id, e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "שומר..." : "שלח לאישור"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-muted-foreground transition hover:bg-muted"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
