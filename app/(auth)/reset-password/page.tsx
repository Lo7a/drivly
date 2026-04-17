"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase password reset
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
          <CheckCircle className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">נשלח!</h1>
        <p className="text-white/50 text-sm mb-8">
          אם האימייל קיים במערכת, תקבל קישור לאיפוס סיסמה.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          חזרה להתחברות
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">איפוס סיסמה</h1>
        <p className="text-white/50 text-sm">הכנס את האימייל שלך ונשלח לך קישור</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 space-y-5">
        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">אימייל</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 pe-4 ps-11 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
              dir="ltr"
            />
            <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "שולח..." : "שלח קישור לאיפוס"}
        </button>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
          חזרה להתחברות
        </Link>
      </p>
    </>
  );
}
