"use client";

import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function HeroParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="hero-particles"
      init={particlesInit}
      className="absolute inset-0 z-[1]"
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: {
            value: 50,
            density: { enable: true, width: 1920, height: 1080 },
          },
          color: { value: ["#22d3ee", "#06b6d4", "#0891b2", "#67e8f9"] },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.1, max: 0.4 },
            animation: {
              enable: true,
              speed: 0.5,
              startValue: "random",
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 1,
              startValue: "random",
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 0.3, max: 0.8 },
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          links: {
            enable: true,
            distance: 150,
            color: "#0891b2",
            opacity: 0.12,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 180,
              links: { opacity: 0.25 },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
