"use client";

import { useState } from "react";
import { Phone, Send, Calculator, Shield } from "lucide-react";
import { ADMIN_PHONE } from "@/lib/constants";
import { formatPhone } from "@/lib/format";
import { PriceInput } from "@/components/shared/PriceInput";

type LeadType = "CALL" | "FINANCE" | "INSURANCE";

interface LeadFormProps {
  carId: string;
  dealerId: string;
  dealerPhone: string;
  carTitle: string;
}

const TABS: { type: LeadType; label: string; icon: React.ReactNode }[] = [
  { type: "CALL", label: "התקשרו אליי", icon: <Phone className="h-4 w-4" /> },
  { type: "FINANCE", label: "בדוק מימון", icon: <Calculator className="h-4 w-4" /> },
  { type: "INSURANCE", label: "בדוק ביטוח", icon: <Shield className="h-4 w-4" /> },
];

export function LeadForm({ carId, dealerId, dealerPhone, carTitle }: LeadFormProps) {
  const [activeTab, setActiveTab] = useState<LeadType>("CALL");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    downPayment: 30000,
    months: 48,
    driverAge: 30,
    youngDriver: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) return;

    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          dealerId,
          type: activeTab,
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          message: form.message || undefined,
          downPayment: activeTab === "FINANCE" ? form.downPayment : undefined,
          months: activeTab === "FINANCE" ? form.months : undefined,
          driverAge: activeTab === "INSURANCE" ? form.driverAge : undefined,
          youngDriver: activeTab === "INSURANCE" ? form.youngDriver : undefined,
          sourcePage: "car_page",
        }),
      });
      setSubmitted(true);
    } catch {
      // Still show success for now (mock)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const isFinance = activeTab === "FINANCE";
    const isInsurance = activeTab === "INSURANCE";
    const serviceName = isFinance ? "צוות המימון" : isInsurance ? "צוות הביטוח" : "";

    // For finance/insurance: admin handles, never expose dealer phone
    if (isFinance || isInsurance) {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            {isFinance ? (
              <Calculator className="h-7 w-7 text-emerald-500" />
            ) : (
              <Shield className="h-7 w-7 text-emerald-500" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">הפנייה נשלחה!</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {serviceName} שלנו יחזור אליך בהקדם עם הצעה מותאמת אישית.
          </p>
          <p className="text-xs text-muted-foreground">
            אין צורך ליצור קשר עם הסוחר — אנחנו כאן בשבילך בכל הנוגע ל
            {isFinance ? "מימון" : "ביטוח"}.
          </p>
        </div>
      );
    }

    // CALL tab → direct connection with the dealer
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Phone className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">הפנייה נשלחה בהצלחה!</h3>
        <p className="text-sm text-muted-foreground mb-6">
          נחזור אליך בהקדם. בינתיים, אפשר להתקשר ישירות:
        </p>
        <a
          href={`tel:${dealerPhone}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400"
        >
          <Phone className="h-5 w-5" />
          {formatPhone(dealerPhone)}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
              activeTab === type
                ? "bg-primary/5 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              שם מלא *
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="השם שלך"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              טלפון *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="050-1234567"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Finance fields */}
        {activeTab === "FINANCE" && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                מקדמה
              </label>
              <PriceInput
                value={String(form.downPayment)}
                onChange={(v) => setForm({ ...form, downPayment: Number(v) || 0 })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                חודשים
              </label>
              <select
                value={form.months}
                onChange={(e) => setForm({ ...form, months: Number(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {[24, 36, 48, 60, 72, 84].map((m) => (
                  <option key={m} value={m}>{m} חודשים</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Insurance fields */}
        {activeTab === "INSURANCE" && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                גיל נהג
              </label>
              <input
                type="number"
                value={form.driverAge}
                onChange={(e) => setForm({ ...form, driverAge: Number(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.youngDriver}
                  onChange={(e) => setForm({ ...form, youngDriver: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                נהג צעיר
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            הודעה (אופציונלי)
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={`מעוניין ב${carTitle}...`}
            rows={2}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "שולח..." : "שלח פנייה"}
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
