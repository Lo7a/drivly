"use client";

/**
 * HeroSection V4 — Stacked Gallery / Parallax Cards
 * Playful, product-led. Floating car cards with 3D tilt on hover.
 * Background: soft pastel mesh.
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, Sparkles, TrendingUp, Shield } from "lucide-react";
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

export function HeroSectionV4({ featured }: { featured: FeaturedCar[] }) {
  const cards = featured.slice(0, 4);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-24 pb-16">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 start-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-300/30 via-cyan-200/20 to-transparent blur-3xl dark:from-cyan-500/20 dark:via-cyan-400/10" />
        <div className="absolute top-1/3 end-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-indigo-300/25 via-indigo-200/15 to-transparent blur-3xl dark:from-indigo-500/15 dark:via-indigo-400/10" />
        <div className="absolute bottom-0 start-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-pink-200/20 to-transparent blur-3xl dark:from-pink-500/10" />
      </div>

      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">

          {/* ── Content ── */}
          <div className="relative z-10">
            {/* Pill badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                חדש ב-2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-medium">
                <Shield className="h-3 w-3" />
                סוחרים מאומתים
              </span>
            </div>

            <h1 className="font-black tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,6vw,5rem)] text-foreground">
              מצא את הרכב
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-l from-cyan-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                  המושלם
                </span>
                <svg
                  className="absolute left-0 right-0 -bottom-2 w-full text-cyan-500/40"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,4 T100,4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              בשבילך.
            </h1>

            <p className="mt-7 max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
              השוואה חכמה של מחיר, מימון, ביטוח וצריכת דלק —
              <span className="font-semibold text-foreground"> מה שחשוב באמת</span>.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/search"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
              >
                חפש רכבים
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-7 py-4 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                לסוחרים
              </Link>
            </div>

            {/* Inline stats */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">10K+</span> רכבים
                </span>
              </div>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-500" />
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">300+</span> סוחרים
                </span>
              </div>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">4.9★</span> דירוג
                </span>
              </div>
            </div>
          </div>

          {/* ── Stacked tilt cards ── */}
          <div className="relative h-[520px] lg:h-[640px] [perspective:1500px]">
            {cards.map((car, i) => (
              <TiltCard key={car.id} car={car} index={i} total={cards.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TiltCard({
  car,
  index,
  total,
}: {
  car: FeaturedCar;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  // Stack positioning
  const positions = [
    { top: "0%", start: "50%", rotate: "6deg", z: 4 },
    { top: "10%", start: "10%", rotate: "-4deg", z: 3 },
    { top: "40%", start: "55%", rotate: "-2deg", z: 2 },
    { top: "50%", start: "15%", rotate: "4deg", z: 1 },
  ];
  const pos = positions[index] ?? positions[0];

  return (
    <Link
      ref={ref}
      href={`/car/${car.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      className="absolute w-[260px] sm:w-[300px] rounded-3xl bg-card border border-border overflow-hidden shadow-2xl transition-transform duration-200 ease-out [transform-style:preserve-3d] hover:z-50"
      style={{
        top: pos.top,
        insetInlineStart: pos.start,
        transform: `rotate(${pos.rotate})`,
        zIndex: pos.z,
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {car.imageUrl && (
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="300px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 start-3 rounded-full bg-white/90 backdrop-blur text-slate-900 px-2.5 py-1 text-[10px] font-bold">
          {car.year}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-foreground mb-1 truncate">
          {car.make} {car.model}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-black text-lg tabular-nums">
            {formatPrice(car.price)}
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
