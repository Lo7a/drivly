"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function HeroBackground({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePos({ x, y });
  }, []);

  // Parallax offsets
  const px = (mousePos.x - 0.5) * 30;
  const py = (mousePos.y - 0.5) * 20;
  const scrollOffset = scrollY * 0.4;
  const scrollZoom = 1 + Math.min(scrollY / 1200, 0.15);
  const contentOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      className="hero-section relative h-screen min-h-[650px] max-h-[1000px] overflow-hidden bg-slate-950"
    >
      {/* ── Animated geometric SVG background ── */}
      <div
        className="absolute inset-[-60px] will-change-transform"
        style={{
          transform: `translate(${px}px, ${py - scrollOffset}px) scale(${scrollZoom})`,
          transition: isHovering ? "transform 0.1s linear" : "transform 0.4s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Base gradient */}
          <rect width="1440" height="900" fill="url(#bgGrad)" />

          {/* Large rotating hexagon */}
          <g opacity="0.12">
            <polygon
              points="720,100 920,215 920,445 720,560 520,445 520,215"
              fill="none"
              stroke="url(#cyanGrad)"
              strokeWidth="1.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 720 330"
                to="360 720 330"
                dur="120s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>

          {/* Medium hexagon - counter rotate */}
          <g opacity="0.09">
            <polygon
              points="720,180 870,265 870,435 720,520 570,435 570,265"
              fill="none"
              stroke="url(#cyanGrad)"
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 720 350"
                to="0 720 350"
                dur="90s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>

          {/* Floating circles cluster - top right */}
          <circle cx="1100" cy="200" r="120" fill="none" stroke="hsl(192 80% 50% / 0.06)" strokeWidth="1">
            <animate attributeName="r" values="120;135;120" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="1150" cy="180" r="60" fill="none" stroke="hsl(192 80% 50% / 0.04)" strokeWidth="1">
            <animate attributeName="r" values="60;70;60" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="1050" cy="250" r="30" fill="hsl(192 80% 50% / 0.03)">
            <animate attributeName="r" values="30;38;30" dur="5s" repeatCount="indefinite" />
          </circle>

          {/* Floating circles cluster - bottom left */}
          <circle cx="200" cy="650" r="90" fill="none" stroke="hsl(192 80% 50% / 0.05)" strokeWidth="1">
            <animate attributeName="r" values="90;105;90" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="700" r="50" fill="hsl(192 80% 50% / 0.02)">
            <animate attributeName="r" values="50;60;50" dur="7s" repeatCount="indefinite" />
          </circle>

          {/* Diagonal lines grid */}
          <g opacity="0.07" strokeWidth="0.5" stroke="hsl(192 80% 60%)">
            <line x1="0" y1="0" x2="1440" y2="900" />
            <line x1="200" y1="0" x2="1440" y2="700" />
            <line x1="400" y1="0" x2="1440" y2="500" />
            <line x1="0" y1="200" x2="1200" y2="900" />
            <line x1="0" y1="400" x2="1000" y2="900" />
          </g>

          {/* Dots grid pattern */}
          <g opacity="0.1">
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 20 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={72 + col * 72}
                  cy={75 + row * 75}
                  r="1.2"
                  fill="hsl(192 80% 60%)"
                />
              ))
            )}
          </g>

          {/* Glowing orbs */}
          <circle cx="900" cy="300" r="200" fill="url(#orb1)" opacity="1">
            <animate attributeName="cx" values="900;950;900" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;260;300" dur="12s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="500" r="180" fill="url(#orb2)" opacity="0.8">
            <animate attributeName="cx" values="300;260;300" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="500;540;500" dur="14s" repeatCount="indefinite" />
          </circle>
          <circle cx="1200" cy="600" r="150" fill="url(#orb3)" opacity="0.7">
            <animate attributeName="cx" values="1200;1250;1200" dur="20s" repeatCount="indefinite" />
          </circle>

          {/* Triangle wireframes */}
          <g opacity="0.04">
            <polygon points="300,100 400,250 200,250" fill="none" stroke="hsl(192 80% 50%)" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" from="0 300 175" to="360 300 175" dur="60s" repeatCount="indefinite" />
            </polygon>
            <polygon points="1100,600 1200,750 1000,750" fill="none" stroke="hsl(192 80% 50%)" strokeWidth="0.8">
              <animateTransform attributeName="transform" type="rotate" from="360 1100 675" to="0 1100 675" dur="80s" repeatCount="indefinite" />
            </polygon>
          </g>

          {/* Speed lines - horizontal */}
          <g opacity="0.06">
            <line x1="50" y1="350" x2="250" y2="350" stroke="hsl(192 80% 50%)" strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="x1" values="50;80;50" dur="4s" repeatCount="indefinite" />
              <animate attributeName="x2" values="250;300;250" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.06;0.12;0.06" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="100" y1="380" x2="220" y2="380" stroke="hsl(192 80% 50%)" strokeWidth="1" strokeLinecap="round">
              <animate attributeName="x1" values="100;130;100" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="x2" values="220;280;220" dur="3.5s" repeatCount="indefinite" />
            </line>
            <line x1="70" y1="410" x2="180" y2="410" stroke="hsl(192 80% 50%)" strokeWidth="0.8" strokeLinecap="round">
              <animate attributeName="x1" values="70;100;70" dur="5s" repeatCount="indefinite" />
              <animate attributeName="x2" values="180;240;180" dur="5s" repeatCount="indefinite" />
            </line>
          </g>

          {/* Defs */}
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="1440" y2="900">
              <stop offset="0%" stopColor="hsl(220 45% 10%)" />
              <stop offset="40%" stopColor="hsl(215 40% 13%)" />
              <stop offset="70%" stopColor="hsl(200 35% 12%)" />
              <stop offset="100%" stopColor="hsl(192 30% 11%)" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(192 80% 50%)" />
              <stop offset="100%" stopColor="hsl(180 70% 40%)" />
            </linearGradient>
            <radialGradient id="orb1">
              <stop offset="0%" stopColor="hsl(192 80% 50% / 0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="orb2">
              <stop offset="0%" stopColor="hsl(200 70% 45% / 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="orb3">
              <stop offset="0%" stopColor="hsl(180 60% 40% / 0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Mouse-following spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(192 80% 50% / 0.07), transparent 50%)`,
        }}
      />

      {/* Content — centered vertically, on top */}
      <div
        className="absolute inset-0 z-20 flex items-center"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </div>

      {/* Bottom fade — smooth blend to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-10" style={{
        background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.8) 30%, hsl(var(--background) / 0.3) 60%, transparent 100%)"
      }} />
    </section>
  );
}
