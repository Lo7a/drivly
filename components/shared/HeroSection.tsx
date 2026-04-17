"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  CarFront,
} from "lucide-react";
import { useCallback, useState } from "react";

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* תמונת רקע */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt="רכב יוקרה על במת תצוגה"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050816]/90 via-[#050816]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]/70" />
      </div>

      {/* זוהר תכלת שעוקב אחרי העכבר */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(34,211,238,0.08), transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="w-full max-w-lg me-auto lg:me-[10%] text-center lg:text-start pt-28 pb-16">
          <h1 className="animate-fade-up text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            הרכב הבא שלך
            <br />
            <span className="text-cyan-400">נמצא כאן</span>
          </h1>

          <p className="animate-fade-up delay-150 mt-5 text-base leading-8 text-white/75 sm:text-lg">
            המקום החכם, הבטוח והנוח ביותר
            <br className="hidden sm:block" />
            לקנות רכבים מסוחרים אמונים בכל הארץ
          </p>

          <div className="animate-fade-up delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_rgba(34,211,238,0.35)] transition hover:scale-[1.02] hover:bg-cyan-400"
            >
              חפש רכבים
              <Search className="ms-2 h-5 w-5" />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              לסוחרים
              <Building2 className="ms-2 h-5 w-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-400 mt-10 flex items-center gap-6 sm:gap-8 justify-center lg:justify-start">
            <div className="text-center lg:text-start">
              <p className="text-xl font-bold text-white">10,000+</p>
              <p className="mt-1 text-xs text-white/60">רכבים זמינים</p>
            </div>
            <div className="text-center lg:text-start">
              <p className="text-xl font-bold text-white">300+</p>
              <p className="mt-1 text-xs text-white/60">סוחרים מאומתים</p>
            </div>
            <div className="text-center lg:text-start">
              <p className="text-xl font-bold text-white">5,000+</p>
              <p className="mt-1 text-xs text-white/60">לקוחות מרוצים</p>
            </div>
          </div>

          {/* Badges */}
          <div className="animate-fade-up delay-500 mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60 lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
              <CarFront className="h-4 w-4 text-cyan-300" />
              אלפי רכבים
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              שקיפות מלאה
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-cyan-300" />
              סוחרים אמינים
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
