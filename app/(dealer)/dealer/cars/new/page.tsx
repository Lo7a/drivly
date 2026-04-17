"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, REGIONS, HAND_OPTIONS } from "@/lib/constants";

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");

  const models = CAR_MAKES.find((m) => m.value === selectedMake)?.models || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Submit to API
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dealer/cars");
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400";
  const selectClass =
    "w-full rounded-xl border border-white/10 bg-[#151d30] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 appearance-none";
  const labelClass = "text-xs font-medium text-white/50 mb-1.5 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">הוספת רכב חדש</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-4">פרטי הרכב</h2>
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
              <select className={selectClass} required disabled={!selectedMake}>
                <option value="">בחר דגם</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>שנה *</label>
              <select className={selectClass} required>
                <option value="">בחר שנה</option>
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>מחיר (₪) *</label>
              <input type="number" placeholder="למשל: 115000" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>קילומטראז *</label>
              <input type="number" placeholder="למשל: 32000" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>יד *</label>
              <select className={selectClass} required>
                {HAND_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-4">מפרט טכני</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>סוג דלק *</label>
              <select className={selectClass} required>
                {Object.entries(FUEL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>תיבת הילוכים *</label>
              <select className={selectClass} required>
                {Object.entries(TRANSMISSION_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>נפח מנוע (סמ"ק)</label>
              <input type="number" placeholder="1800" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>צבע</label>
              <input type="text" placeholder="לבן" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>אזור *</label>
              <select className={selectClass} required>
                <option value="">בחר אזור</option>
                {Object.entries(REGIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>עיר</label>
              <input type="text" placeholder="תל אביב" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-4">תיאור</h2>
          <textarea
            rows={4}
            placeholder="תארו את הרכב — מצב, היסטוריה, אבזור מיוחד..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-4">אפשרויות נוספות</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "financing", label: "מימון זמין" },
              { id: "tradeIn", label: "טרייד אין" },
              { id: "warranty", label: "אחריות" },
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
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
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/70 transition hover:bg-white/10"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
