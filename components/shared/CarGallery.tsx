"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

export function CarGallery({ images, alt }: Props) {
  const pics = images.length > 0 ? images : ["/hero-bg.png"];
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const hasMultiple = pics.length > 1;

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % pics.length);
  }, [pics.length]);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + pics.length) % pics.length);
  }, [pics.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") e.shiftKey ? next() : prev();
      if (e.key === "ArrowRight") e.shiftKey ? prev() : next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  useEffect(() => {
    if (lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, next, prev]);

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted group">
          {pics.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              priority={i === 0}
              className={`object-cover transition-opacity duration-500 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ))}

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-3 end-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 hover:bg-background transition-opacity cursor-pointer"
            aria-label="הגדל תמונה"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Prev/Next */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute start-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-background transition-colors cursor-pointer shadow-lg"
                aria-label="תמונה קודמת"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute end-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-background transition-colors cursor-pointer shadow-lg"
                aria-label="תמונה הבאה"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 start-3 z-10 rounded-full bg-black/60 backdrop-blur text-white text-xs font-medium px-3 py-1">
                {idx + 1} / {pics.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultiple && (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {pics.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  i === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
                aria-label={`הצג תמונה ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
            className="absolute top-4 end-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="סגור"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-6xl aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={pics[idx]}
              alt={`${alt} ${idx + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="תמונה קודמת"
                >
                  <ChevronRight className="h-6 w-6 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="תמונה הבאה"
                >
                  <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium px-4 py-1.5">
                  {idx + 1} / {pics.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
