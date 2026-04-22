"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, Fuel, Tag, Save, Plus, X } from "lucide-react";
import { CATEGORY_TAGS } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [adminPhone, setAdminPhone] = useState("050-0000000");
  const [fuelPrice, setFuelPrice] = useState(7.5);
  const [siteName, setSiteName] = useState("Drivly");
  const [categories, setCategories] = useState<string[]>(CATEGORY_TAGS.map((c) => c.label));
  const [newCategory, setNewCategory] = useState("");

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("ההגדרות נשמרו");
    } catch {
      toast.error("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-cyan-400";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">הגדרות מערכת</h1>

      <div className="space-y-6">
        {/* Contact Settings */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-cyan-500" />
            <h2 className="text-lg font-bold text-foreground">פרטי קשר</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>טלפון אדמין (לידים)</label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className={inputClass}
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                מופיע בדף רכב לצד כפתורי מימון/ביטוח
              </p>
            </div>
            <div>
              <label className={labelClass}>שם האתר</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Fuel Price */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">מחיר דלק</h2>
          </div>
          <div>
            <label className={labelClass}>מחיר לליטר (₪)</label>
            <input
              type="number"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className={inputClass}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              משמש במחשבון עלות חודשית בדף הרכב
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-bold text-foreground">קטגוריות רכבים</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium"
              >
                {cat}
                <button
                  onClick={() => removeCategory(idx)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label="מחק"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              placeholder="קטגוריה חדשה..."
              className={inputClass}
            />
            <button
              onClick={addCategory}
              className="inline-flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              הוסף
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "שומר..." : "שמור הגדרות"}
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
