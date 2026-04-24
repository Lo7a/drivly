"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images, Save, X } from "lucide-react";
import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, REGIONS, HAND_OPTIONS, CAR_STATUS_LABELS } from "@/lib/constants";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { PriceInput } from "@/components/shared/PriceInput";

const DRAFT_STORAGE_KEY = "drivly:car-draft-v1";
const DRAFT_TIMESTAMP_KEY = "drivly:car-draft-ts-v1";
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface CarFormData {
  makeSlug: string; // for dropdown (maps to label on submit)
  model: string;
  year: string;
  price: string;
  originalPrice: string;
  km: string;
  hand: string;
  fuelType: string;
  transmission: string;
  engineSize: string;
  color: string;
  region: string;
  city: string;
  annualFee: string;
  description: string;
  hasFinancing: boolean;
  hasTradeIn: boolean;
  hasWarranty: boolean;
  images: string[];
}

const EMPTY: CarFormData = {
  makeSlug: "",
  model: "",
  year: "",
  price: "",
  originalPrice: "",
  km: "",
  hand: "1",
  fuelType: "PETROL",
  transmission: "AUTOMATIC",
  engineSize: "",
  color: "",
  region: "",
  city: "",
  annualFee: "",
  description: "",
  hasFinancing: false,
  hasTradeIn: false,
  hasWarranty: false,
  images: [],
};

interface Props {
  mode: "create" | "edit";
  carId?: string;
  initial?: Partial<CarFormData>;
  /** Admin can edit status. Dealer cannot. */
  isAdmin?: boolean;
  initialStatus?: string;
  dealerId?: string;
  /** Redirect after success. Defaults to /dealer/cars or /admin/cars depending on isAdmin. */
  redirectTo?: string;
  heading?: string;
  submitLabel?: string;
}

export function CarForm({
  mode,
  carId,
  initial,
  isAdmin = false,
  initialStatus,
  dealerId: dealerIdProp,
  redirectTo,
  heading,
  submitLabel,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CarFormData>({ ...EMPTY, ...initial });
  const [status, setStatus] = useState<string>(initialStatus || "PENDING_APPROVAL");
  const [dealerId, setDealerId] = useState<string | undefined>(dealerIdProp);

  // Draft state (only in create mode)
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const draftRestored = useRef(false);

  // Only fetch /api/me if we need a dealerId (create mode, non-admin)
  useEffect(() => {
    if (dealerId || mode !== "create" || isAdmin) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.dealerId) setDealerId(data.user.dealerId);
      })
      .catch(() => {});
  }, [dealerId, mode, isAdmin]);

  // ─── Load draft from localStorage on mount (create mode only) ───
  useEffect(() => {
    if (mode !== "create") {
      setDraftLoaded(true);
      return;
    }
    try {
      const ts = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      if (ts && Date.now() - Number(ts) > DRAFT_MAX_AGE_MS) {
        // expired
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      } else {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<CarFormData>;
          // Only restore if there's actual content (images are never persisted)
          const hasContent =
            saved.makeSlug ||
            saved.model ||
            saved.price ||
            saved.km ||
            saved.description;
          if (hasContent) {
            // Strip images from restored draft — always start with empty gallery
            const { images: _images, ...rest } = saved;
            void _images;
            setForm((prev) => ({ ...prev, ...rest }));
            draftRestored.current = true;
            setShowDraftBanner(true);
          }
        }
      }
    } catch {
      // Ignore malformed draft
    }
    setDraftLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Auto-save draft on every form change (create mode only) ───
  // Images are NOT persisted — they'd be orphans in Storage if the draft
  // is never submitted. User re-uploads after restoring a draft.
  useEffect(() => {
    if (mode !== "create" || !draftLoaded) return;
    try {
      // Skip saving an empty draft
      const isEmpty =
        !form.makeSlug &&
        !form.model &&
        !form.price &&
        !form.km &&
        !form.description;
      if (isEmpty) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
        return;
      }
      const { images: _images, ...toSave } = form;
      void _images;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toSave));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, String(Date.now()));
    } catch {
      // localStorage quota / unavailable — ignore silently
    }
  }, [form, mode, draftLoaded]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    } catch {}
  };

  const discardDraft = () => {
    clearDraft();
    setForm({ ...EMPTY, ...initial });
    setShowDraftBanner(false);
    toast.success("הטיוטה נמחקה");
  };

  const models = CAR_MAKES.find((m) => m.value === form.makeSlug)?.models || [];

  const update = <K extends keyof CarFormData>(field: K, value: CarFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.makeSlug) {
      toast.error("בחר יצרן");
      return;
    }
    if (form.images.length === 0) {
      toast.error("הוסף לפחות תמונה אחת");
      return;
    }

    setLoading(true);
    try {
      const makeLabel = CAR_MAKES.find((m) => m.value === form.makeSlug)?.label || form.makeSlug;

      const originalPriceNum = form.originalPrice ? Number(form.originalPrice) : null;
      const priceNum = Number(form.price);
      // Discount only applies if original > current price
      const effectiveOriginal =
        originalPriceNum && originalPriceNum > priceNum ? originalPriceNum : null;

      const payload = {
        make: makeLabel,
        model: form.model,
        year: Number(form.year),
        price: priceNum,
        originalPrice: effectiveOriginal,
        km: Number(form.km),
        hand: Number(form.hand),
        fuelType: form.fuelType,
        transmission: form.transmission,
        engineSize: form.engineSize ? Number(form.engineSize) : null,
        color: form.color || null,
        region: form.region || null,
        annualFee: form.annualFee ? Number(form.annualFee) : null,
        description: form.description || null,
        hasFinancing: form.hasFinancing,
        hasTradeIn: form.hasTradeIn,
        hasWarranty: form.hasWarranty,
        images: form.images,
        ...(isAdmin && status ? { status } : {}),
      };

      let res: Response;
      if (mode === "create") {
        const slug = `${form.makeSlug}-${form.model.toLowerCase().replace(/\s+/g, "-")}-${form.year}-${Math.random().toString(36).substring(2, 8)}`;
        res = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, ...payload, status: "PENDING_APPROVAL" }),
        });
      } else {
        res = await fetch(`/api/cars/${carId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "שגיאה");
      }

      toast.success(mode === "create" ? "הרכב נשלח לאישור!" : "השינויים נשמרו");
      if (mode === "create") clearDraft();
      router.push(redirectTo || (isAdmin ? "/admin/cars" : "/dealer/cars"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-cyan-400";
  const selectClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400 appearance-none";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1.5 block";

  const title = heading || (mode === "create" ? "הוספת רכב חדש" : "עריכת רכב");
  const btnLabel = submitLabel || (mode === "create" ? "שלח לאישור" : "שמור שינויים");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {mode === "create" && draftLoaded && !showDraftBanner && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Save className="h-3 w-3" />
            נשמר אוטומטית כטיוטה
          </span>
        )}
      </div>

      {showDraftBanner && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <Save className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">טיוטה שוחזרה</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              המשכנו מהמקום שבו הפסקת. תמונות צריכות להיות מועלות מחדש.
              לחיצה על &quot;שלח לאישור&quot; או &quot;ביטול&quot; תנקה את הטיוטה.
            </p>
          </div>
          <button
            type="button"
            onClick={discardDraft}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors shrink-0"
          >
            <X className="h-3 w-3" />
            מחק טיוטה
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">פרטי הרכב</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>יצרן *</label>
              <select
                value={form.makeSlug}
                onChange={(e) => update("makeSlug", e.target.value)}
                className={selectClass}
                required
              >
                <option value="">בחר יצרן</option>
                {CAR_MAKES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>דגם *</label>
              <select
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                className={selectClass}
                required
                disabled={!form.makeSlug}
              >
                <option value="">בחר דגם</option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>שנה *</label>
              <select
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className={selectClass}
                required
              >
                <option value="">בחר שנה</option>
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>מחיר נוכחי (₪) *</label>
              <PriceInput
                value={form.price}
                onChange={(v) => update("price", v)}
                placeholder="115,000"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>מחיר לפני הנחה (₪)</label>
              <PriceInput
                value={form.originalPrice}
                onChange={(v) => update("originalPrice", v)}
                placeholder="השאר ריק אם אין הנחה"
                className={inputClass}
              />
              {form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price) && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  הנחה של {Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)}% תוצג ללקוח
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>קילומטראז *</label>
              <PriceInput
                value={form.km}
                onChange={(v) => update("km", v)}
                placeholder="32,000"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>יד *</label>
              <select
                value={form.hand}
                onChange={(e) => update("hand", e.target.value)}
                className={selectClass}
                required
              >
                {HAND_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">מפרט טכני</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>סוג דלק *</label>
              <select
                value={form.fuelType}
                onChange={(e) => update("fuelType", e.target.value)}
                className={selectClass}
                required
              >
                {Object.entries(FUEL_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>תיבת הילוכים *</label>
              <select
                value={form.transmission}
                onChange={(e) => update("transmission", e.target.value)}
                className={selectClass}
                required
              >
                {Object.entries(TRANSMISSION_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>נפח מנוע (סמ&quot;ק)</label>
              <PriceInput
                value={form.engineSize}
                onChange={(v) => update("engineSize", v)}
                placeholder="1,800"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>צבע</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
                placeholder="לבן"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>אזור *</label>
              <select
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
                className={selectClass}
                required
              >
                <option value="">בחר אזור</option>
                {Object.entries(REGIONS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>עיר</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="תל אביב"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>אגרה שנתית (₪)</label>
              <PriceInput
                value={form.annualFee}
                onChange={(v) => update("annualFee", v)}
                placeholder="1,200"
                className={inputClass}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                אגרת רישוי שנתית שתוצג ללקוח במחשבון העלות החודשית
              </p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Images className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">תמונות הרכב</h2>
          </div>
          <ImageUploader
            value={form.images}
            onChange={(urls) => update("images", urls)}
            dealerId={dealerId}
            carId={carId}
            maxImages={10}
          />
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
            {(
              [
                { id: "hasFinancing", label: "מימון זמין" },
                { id: "hasTradeIn", label: "טרייד אין" },
                { id: "hasWarranty", label: "אחריות" },
              ] as const
            ).map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[id]}
                  onChange={(e) => update(id, e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Admin-only status */}
        {isAdmin && mode === "edit" && (
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">סטטוס (אדמין)</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              {Object.entries(CAR_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "שומר..." : btnLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (mode === "create") clearDraft();
              router.back();
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-muted-foreground transition hover:bg-muted"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
