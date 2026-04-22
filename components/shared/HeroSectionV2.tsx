"use client";

/**
 * HeroSection V2 — Editorial Split
 * Magazine-style, confident typography, minimal ornament.
 * Split layout: headline + search on right, live car spotlight on left.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Play, Circle } from "lucide-react";
import { formatPrice } from "@/lib/format";

type FeaturedCar = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string | null;
};

export function HeroSectionV2({ featured }: { featured: FeaturedCar[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const cars = featured.length ? featured : null;

  useEffect(() => {
    if (!cars) return;
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % cars.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [cars]);

  const active = cars?.[activeIdx];

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Editorial grid lines */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Warm gradient glow */}
      <div className="absolute top-1/2 -translate-y-1/2 start-0 w-[45%] aspect-square rounded-full bg-gradient-to-tr from-cyan-500/10 via-cyan-400/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen pt-24 pb-16 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">

        {/* ── Content (right in RTL) ── */}
        <div className="order-2 lg:order-1">
          {/* Tiny serial number */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 tracking-widest mb-6">
            <Circle className="h-1.5 w-1.5 fill-current" />
            ISSUE 01 · 2026 · EDITION
          </div>

          {/* Massive headline */}
          <h1 className="font-black tracking-[-0.04em] leading-[0.92] text-[clamp(2.75rem,7vw,6rem)] text-foreground">
            הרכב הבא
            <br />
            שלך.
            <span className="inline-block ms-3 align-middle">
              <span className="inline-flex h-[0.6em] w-[0.6em] rounded-full bg-cyan-500 animate-pulse" />
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
            אלפי רכבים, סוחרים מאומתים, ועלות חודשית אמיתית —
            <span className="text-foreground font-semibold"> במקום אחד</span>.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/search"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-4 text-sm font-bold transition-all hover:bg-foreground/90 hover:gap-3"
            >
              <Search className="h-4 w-4" />
              התחל חיפוש
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              איך זה עובד?
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-12 pt-6 border-t border-border grid grid-cols-3 gap-4 max-w-md">
            {[
              { n: "10K+", l: "רכבים" },
              { n: "300+", l: "סוחרים" },
              { n: "4.9★", l: "דירוג" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="font-black text-xl text-foreground tabular-nums">{n}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Spotlight card (left in RTL) ── */}
        <div className="order-1 lg:order-2 relative">
          <div className="relative rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 aspect-[4/5] overflow-hidden shadow-2xl">
            {/* Decorative rings */}
            <div className="absolute inset-6 rounded-[26px] border border-white/10" />
            <div className="absolute inset-10 rounded-[22px] border border-white/5" />

            {/* Animated car rotation */}
            {active && (
              <Link
                href={`/car/${active.slug}`}
                className="absolute inset-0 group"
              >
                {active.imageUrl && (
                  <Image
                    src={active.imageUrl}
                    alt={`${active.make} ${active.model}`}
                    fill
                    priority
                    className="object-cover scale-110 group-hover:scale-115 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Top label */}
                <div className="absolute top-5 start-5 end-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 tracking-widest">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE · מוצג עכשיו
                  </div>
                  <span className="rounded-full bg-white/10 backdrop-blur border border-white/10 px-2.5 py-1 text-[10px] text-white/80">
                    {activeIdx + 1} / {cars?.length ?? 0}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 start-0 end-0 p-6">
                  <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest mb-2">
                    Featured
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {active.make}
                    <br />
                    {active.model} <span className="text-white/60 font-light">{active.year}</span>
                  </h3>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider">החל מ-</div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {formatPrice(active.price)}
                      </div>
                    </div>
                    <div className="rounded-full bg-white text-slate-900 p-2.5 group-hover:bg-cyan-400 transition-colors">
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Indicator dots */}
            {cars && cars.length > 1 && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {cars.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === activeIdx ? "w-6 bg-cyan-400" : "w-1 bg-white/30"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Marquee of brands */}
      <div className="relative border-t border-border py-5 overflow-hidden">
        <div className="flex items-center gap-12 text-sm font-medium text-muted-foreground whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {Array(2).fill([
            "טויוטה",
            "•",
            "יונדאי",
            "•",
            "מאזדה",
            "•",
            "ב.מ.וו",
            "•",
            "מרצדס",
            "•",
            "טסלה",
            "•",
            "סקודה",
            "•",
            "פולקסווגן",
            "•",
            "קיה",
            "•",
            "סוזוקי",
          ]).flat().map((item, i) => (
            <span key={i} className={item === "•" ? "text-primary" : ""}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
