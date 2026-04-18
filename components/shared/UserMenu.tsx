"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, LayoutDashboard, Shield, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UserInfo {
  fullName: string;
  email: string;
  role: "ADMIN" | "DEALER" | "CUSTOMER";
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || !mounted) return;

      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.user) {
          setUser(data.user);
        }
      } catch {
        // silent
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN") {
        loadUser();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("התנתקת");
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] backdrop-blur border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.12] transition-all"
      >
        <User className="h-4 w-4" />
        כניסה
      </Link>
    );
  }

  const roleLabel = user.role === "ADMIN" ? "אדמין" : user.role === "DEALER" ? "סוחר" : "לקוח";
  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const dashboardHref = user.role === "ADMIN" ? "/admin/dashboard" : "/dealer/dashboard";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] backdrop-blur border border-white/15 px-3 py-2 text-sm text-white hover:bg-white/[0.12] transition-all"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {initials}
        </div>
        <div className="hidden sm:block text-start">
          <p className="text-xs font-semibold leading-tight">{user.fullName}</p>
          <p className="text-[10px] text-white/50 leading-tight">{roleLabel}</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-semibold text-sm text-foreground">{user.fullName}</p>
            <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">{user.email}</p>
            <span className={`inline-flex items-center gap-1 mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              user.role === "ADMIN"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-cyan-500/10 text-cyan-500"
            }`}>
              {user.role === "ADMIN" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
              {roleLabel}
            </span>
          </div>

          <div className="p-1">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              דשבורד
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              יציאה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
