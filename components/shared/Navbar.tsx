"use client";

import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "בית" },
  { href: "/search", label: "כל הרכבים" },
  { href: "/login", label: "לסוחרים" },
  { href: "#how", label: "איך זה עובד" },
  { href: "#contact", label: "צור קשר" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" variant="light" />

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] backdrop-blur border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.12] transition-all"
          >
            <User className="h-4 w-4" />
            אזור סוחרים
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
            aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b1220]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground text-center mt-2"
          >
            אזור סוחרים
          </Link>
        </div>
      )}
    </header>
  );
}
