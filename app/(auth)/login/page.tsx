"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Replace with Supabase Auth
      // const { error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      // router.push("/dealer/dashboard");

      // Mock for now — test credentials:
      // admin/admin → admin dashboard
      // socher/socher → dealer dashboard
      await new Promise((r) => setTimeout(r, 1000));
      if (email === "admin" && password === "admin") {
        router.push("/admin/dashboard");
      } else if (email === "socher" && password === "socher") {
        router.push("/dealer/dashboard");
      } else {
        setError("לבדיקה: admin/admin או socher/socher");
      }
    } catch {
      setError("שגיאה בהתחברות. נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">כניסה למערכת</h1>
        <p className="text-white/50 text-sm">הכנס את פרטי ההתחברות שלך</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 space-y-5">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

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

        <div>
          <label className="text-xs font-medium text-white/50 mb-1.5 block">סיסמה</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הסיסמה שלך"
              className="w-full rounded-xl border border-white/10 bg-white/5 pe-11 ps-11 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
            />
            <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-white/50">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20" />
            זכור אותי
          </label>
          <Link href="/reset-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            שכחת סיסמה?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-base font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחברות"}
          <LogIn className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        עדיין אין לך חשבון?{" "}
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          הרשמה כסוחר
        </Link>
      </p>
    </>
  );
}
