"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

export function HeroInteractive({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax from mouse
  const offsetX = (mousePos.x - 0.5) * 20;
  const offsetY = (mousePos.y - 0.5) * 15;

  // Zoom on scroll (1.05 → 1.25 over 600px scroll)
  const scrollZoom = 1.05 + Math.min(scrollY / 600, 0.2) * 1;

  // Fade out content on scroll
  const contentOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      className="relative h-[100vh] min-h-[600px] max-h-[950px] overflow-hidden"
    >
      {/* Background image — parallax + zoom on scroll */}
      <div
        className="absolute inset-[-40px] will-change-transform"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scrollZoom})`,
          transition: isHovering
            ? "transform 0.15s ease-out"
            : "transform 0.4s ease-out",
        }}
      >
        <Image
          src="/hero-car.jpg"
          alt="רכב יוקרה"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Dark overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Mouse-following cyan spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(192 80% 50% / 0.1), transparent 55%)`,
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)]" />

      {/* Content — fades on scroll */}
      <div
        className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </div>

      {/* Bottom gradient to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
