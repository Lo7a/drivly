"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Phone, Mail, Lock, Building2, MapPin, CheckCircle } from "lucide-react";
import { REGIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    password: "",
    region: "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.contactName,
            business_name: form.businessName,
            phone: form.phone,
            region: form.region,
            role: "DEALER",
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // TODO: Create User + Dealer records via API
      setSuccess(true);
    } catch {
      setError("שגיאה בהרשמה. נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dealer/dashboard`,
      },
    });
    if (error) {
      setError("שגיאה בהתחברות עם Google");
      setGoogleLoading(false);
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

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 space-y-5">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {googleLoading ? "מתחבר..." : "הרשמה עם Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#050816] px-3 text-white/30">או עם אימייל</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">שם העסק *</label>
            <div className="relative">
              <input type="text" required value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="למשל: אוטו פלוס" className={inputClass} />
              <Building2 className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">שם איש קשר *</label>
            <div className="relative">
              <input type="text" required value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="השם המלא שלך" className={inputClass} />
              <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 block">טלפון *</label>
              <div className="relative">
                <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="050-1234567" className={inputClass} />
                <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 block">אימייל *</label>
              <div className="relative">
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" className={inputClass} dir="ltr" />
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">סיסמה *</label>
            <div className="relative">
              <input type="password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="לפחות 6 תווים" className={inputClass} />
              <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">אזור</label>
            <div className="relative">
              <select value={form.region} onChange={(e) => update("region", e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#151d30] ps-11 pe-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 appearance-none">
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "נרשם..." : "הרשמה"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-white/40 mt-6">
        כבר יש לך חשבון?{" "}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          התחברות
        </Link>
      </p>
    </>
  );
}
