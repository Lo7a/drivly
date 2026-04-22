"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Shield,
  BarChart3,
  Activity,
  Bell,
  UserCog,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/shared/UserMenu";
import { NotificationBell } from "@/components/admin/NotificationBell";

const NAV_SECTIONS = [
  {
    label: "ראשי",
    items: [
      { href: "/admin/dashboard", label: "דשבורד", icon: LayoutDashboard },
      { href: "/admin/notifications", label: "התראות", icon: Bell },
      { href: "/admin/analytics", label: "אנליטיקס", icon: BarChart3 },
      { href: "/admin/activity", label: "פעילות", icon: Activity },
    ],
  },
  {
    label: "ניהול",
    items: [
      { href: "/admin/leads", label: "לידים", icon: FileText },
      { href: "/admin/cars", label: "רכבים", icon: Car },
      { href: "/admin/dealers", label: "סוחרים", icon: Users },
      { href: "/admin/users", label: "משתמשים", icon: UserCog },
    ],
  },
  {
    label: "אחר",
    items: [
      { href: "/dealer/dashboard", label: "תצוגת סוחר", icon: Eye, target: "_blank" as const },
      { href: "/admin/settings", label: "הגדרות", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`;

  return (
    <div className="min-h-dvh bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/[0.06] h-16">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12] transition-colors"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground text-sm">D</div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">Driv</span><span className="text-primary">ly</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 border border-amber-500/30 bg-amber-500/10 rounded-full px-2.5 py-1">
              <Shield className="h-3 w-3" />
              אדמין
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="hidden lg:flex fixed top-16 start-0 bottom-0 w-56 flex-col border-e border-border bg-card p-4 overflow-y-auto">
          <nav className="space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest mb-2 px-3">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        target={"target" in item ? item.target : undefined}
                        className={linkClass(active)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed top-16 start-0 bottom-0 z-50 w-64 flex-col border-e border-border bg-card p-4 lg:hidden overflow-y-auto">
              <nav className="space-y-5">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest mb-2 px-3">
                      {section.label}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            target={"target" in item ? item.target : undefined}
                            onClick={() => setSidebarOpen(false)}
                            className={linkClass(active)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
          </>
        )}

        <main className="flex-1 lg:ms-56 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
