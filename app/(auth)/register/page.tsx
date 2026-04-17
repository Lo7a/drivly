"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Phone, Mail, Lock, Building2, MapPin, CheckCircle } from "lucide-react";
import { REGIONS } from "@/lib/constants";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    password: "",
    city: "",
    region: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with Supabase Auth + create User + Dealer records
      await new Promise((r) => setTimeout(r, 1500));
      setSuccess(true);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 pe-4 ps-11 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30";

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">נרשמת בהצלחה!</h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          נבדוק את הפרטים שלך ונחזור אליך בהקדם.
          <br />
          בדרך כלל האישור לוקח עד 24 שעות.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-400"
        >
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">הרשמה כסוחר</h1>
        <p className="text-white/50 text-sm">הרשמה פשוטה ומהירה — בחינם</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 space-y-4">
        {/* Business name */}
        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">שם העסק *</label>
          <div className="relative">
            <input
              type="text"
              required
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="למשל: אוטו פלוס"
              className={inputClass}
            />
            <Building2 className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        {/* Contact name */}
        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">שם איש קשר *</label>
          <div className="relative">
            <input
              type="text"
              required
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              placeholder="השם המלא שלך"
              className={inputClass}
            />
            <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">טלפון *</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="050-1234567"
                className={inputClass}
              />
              <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">אימייל *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
                className={inputClass}
                dir="ltr"
              />
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">סיסמה *</label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="לפחות 6 תווים"
              className={inputClass}
            />
            <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">אזור</label>
          <div className="relative">
            <select
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#151d30] ps-11 pe-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 appearance-none"
            >
              <option value="">בחר אזור</option>
              {Object.entries(REGIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50 mt-2"
        >
          {loading ? "נרשם..." : "הרשמה"}
        </button>

        <p className="text-center text-[11px] text-white/30">
          בלחיצה על הרשמה אתה מסכים לתנאי השימוש ולמדיניות הפרטיות
        </p>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        כבר יש לך חשבון?{" "}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          התחברות
        </Link>
      </p>
    </>
  );
}
