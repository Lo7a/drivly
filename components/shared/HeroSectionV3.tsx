"use client";

/**
 * HeroSection V3 — Cinematic Typography
 * Full-bleed typography, ambient aurora background, minimal UI.
 * Think Linear / Vercel / Stripe.
 */

import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";

export function HeroSectionV3() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <section
      onMouseMove={handleMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050816]"
    >
      {/* Aurora layers */}
      <div
        className="absolute inset-0 opacity-60 transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(1000px circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, hsl(192 90% 35% / 0.3), transparent 50%)`,
        }}
      />
      <div className="absolute top-1/4 start-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 end-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[120px] animate-[pulse_8s_ease-in-out_infinite_1s]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Eyebrow */}
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur px-4 py-1.5 text-xs font-medium text-white/70 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping" />
            <span className="relative rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          השוואת מחירים · מימון · ביטוח — בלחיצה אחת
        </div>

        {/* Massive cinematic headline */}
        <h1 className="animate-fade-up delay-150 font-black text-white leading-[0.88] tracking-[-0.04em]">
          <span className="block text-[clamp(2.5rem,8vw,7rem)]">כל הרכבים.</span>
          <span className="block text-[clamp(2.5rem,8vw,7rem)] bg-gradient-to-l from-cyan-200 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
            מקום אחד.
          </span>
          <span className="block text-[clamp(1.75rem,5.5vw,4.5rem)] text-white/60 font-light mt-2">
            החלטה אחת חכמה.
          </span>
        </h1>

        <p className="animate-fade-up delay-300 mt-8 max-w-2xl mx-auto text-base sm:text-lg text-white/60 leading-relaxed">
          אלפי רכבים מסוחרים מאומתים. עלות חודשית אמיתית כולל מימון וביטוח.
          <br className="hidden sm:block" />
          מנוע חיפוש חכם שמוצא בדיוק את מה שאתם מחפשים.
        </p>

        {/* Search — prominent */}
        <div className="animate-fade-up delay-400 mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/50 via-cyan-300/30 to-cyan-500/50 blur-lg opacity-40" />
            <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl">
              <SearchBar size="lg" placeholder="חפש יצרן, דגם, או מילה..." />
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/40">
            <span>פופולריים:</span>
            {["היברידי", "יד ראשונה", "משפחתי", "חסכוני", "יוקרה"].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/70 hover:bg-white/[0.08] hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary actions */}
        <div className="animate-fade-up delay-500 mt-10 flex items-center justify-center gap-6 text-sm text-white/50">
          <Link
            href="/search"
            className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Search className="h-4 w-4" />
            חיפוש מתקדם
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
          <span className="h-4 w-px bg-white/10" />
          <Link
            href="/register"
            className="hover:text-white transition-colors"
          >
            לסוחרים →
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
