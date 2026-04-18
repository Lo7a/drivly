"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/shared/UserMenu";

const NAV_ITEMS = [
  { href: "/dealer/dashboard", label: "דשבורד", icon: LayoutDashboard },
  { href: "/dealer/cars", label: "הרכבים שלי", icon: Car },
  { href: "/dealer/settings", label: "הגדרות", icon: Settings },
];

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
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
            <span className="hidden sm:inline text-xs text-white/60 border border-white/15 bg-white/5 rounded-full px-2.5 py-1">אזור סוחרים</span>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex fixed top-16 start-0 bottom-0 w-56 flex-col border-e border-border bg-card p-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar — mobile */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed top-16 start-0 bottom-0 z-50 w-56 flex-col border-e border-border bg-card p-4 lg:hidden">
              <nav className="space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ms-56 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
