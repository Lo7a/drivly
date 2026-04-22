import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/shared/HeroSection";
import { HeroSectionV2 } from "@/components/shared/HeroSectionV2";
import { HeroSectionV3 } from "@/components/shared/HeroSectionV3";
import { HeroSectionV4 } from "@/components/shared/HeroSectionV4";
import Link from "next/link";
import { Eye } from "lucide-react";

async function getFeatured() {
  try {
    const cars = await prisma.car.findMany({
      where: { status: "APPROVED" },
      orderBy: { viewsCount: "desc" },
      take: 6,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    });
    return cars.map((c) => ({
      id: c.id,
      slug: c.slug,
      make: c.make,
      model: c.model,
      year: c.year,
      price: c.price,
      imageUrl: c.images[0]?.url ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function HeroDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const variant = v || "v1";
  const featured = await getFeatured();

  return (
    <>
      {/* Variant switcher bar */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] rounded-full border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-1 flex items-center gap-1">
        {[
          { key: "v1", label: "V1 · Current" },
          { key: "v2", label: "V2 · Editorial" },
          { key: "v3", label: "V3 · Cinematic" },
          { key: "v4", label: "V4 · Gallery" },
        ].map((opt) => (
          <Link
            key={opt.key}
            href={`/hero-demo?v=${opt.key}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              variant === opt.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {variant === opt.key && <Eye className="h-3 w-3" />}
            {opt.label}
          </Link>
        ))}
      </div>

      {/* Render selected variant */}
      {variant === "v2" && <HeroSectionV2 featured={featured} />}
      {variant === "v3" && <HeroSectionV3 />}
      {variant === "v4" && <HeroSectionV4 featured={featured} />}
      {variant !== "v2" && variant !== "v3" && variant !== "v4" && <HeroSection />}

      {/* Info bar */}
      <div className="border-t border-border bg-muted/30 py-6">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            זה דף השוואה של וריאנטים להירו. בחר למעלה. כשתחליט,{" "}
            <span className="font-semibold text-foreground">תגיד איזו גרסה אתה אוהב</span>{" "}
            ואני אחליף את הנוכחית בה (ואמחק את השאר).
          </p>
        </div>
      </div>
    </>
  );
}
