import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MOCK_CARS } from "@/lib/mock-data";
import { FUEL_TYPES, TRANSMISSION_TYPES, REGIONS } from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";

async function getCar(slug: string) {
  try {
    const car = await prisma.car.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        dealer: { select: { businessName: true, contactName: true, phone: true, city: true, id: true } },
      },
    });
    if (car) {
      return {
        ...car,
        images: car.images.length > 0 ? car.images.map((i) => i.url) : ["/hero-bg.png"],
        dealerName: car.dealer.businessName,
        dealerPhone: car.dealer.phone,
        dealerCity: car.dealer.city,
        dealerId: car.dealer.id,
        city: car.dealer.city,
      };
    }
  } catch {
    // DB not available, fall through to mock
  }

  // Fallback to mock
  return MOCK_CARS.find((c) => c.slug === slug);
}
import { CarContactPanel } from "@/components/shared/CarContactPanel";
import { TotalMonthlyCostCard } from "@/components/calculators/TotalMonthlyCost";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  Gauge,
  Fuel,
  Calendar,
  MapPin,
  Car,
  Palette,
  Users,
  Settings,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { CarGallery } from "@/components/shared/CarGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return { title: "רכב לא נמצא" };

  return {
    title: `${car.make} ${car.model} ${car.year} למכירה | ${formatPrice(car.price)}`,
    description: `${car.make} ${car.model} ${car.year}, ${formatKm(car.km)}, יד ${car.hand}, ${FUEL_TYPES[car.fuelType]}. ${car.city}.`,
    openGraph: {
      title: `${car.make} ${car.model} ${car.year} למכירה`,
      description: car.description || "",
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) notFound();

  // Increment views (fire and forget)
  try {
    await prisma.car.update({
      where: { slug },
      data: { viewsCount: { increment: 1 } },
    });
  } catch {
    // ignore
  }

  const specs = [
    { icon: Calendar, label: "שנה", value: String(car.year) },
    { icon: Gauge, label: 'ק"מ', value: formatKm(car.km) },
    { icon: Car, label: "יד", value: `יד ${car.hand}` },
    { icon: Fuel, label: "דלק", value: FUEL_TYPES[car.fuelType] },
    { icon: Settings, label: "גיר", value: TRANSMISSION_TYPES[car.transmission] },
    { icon: Palette, label: "צבע", value: car.color || "—" },
    { icon: Users, label: "מקומות", value: String(car.seats) },
    { icon: MapPin, label: "אזור", value: car.city || (car.region ? REGIONS[car.region] : "—") },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Car",
          name: `${car.make} ${car.model} ${car.year}`,
          manufacturer: car.make,
          model: car.model,
          vehicleModelDate: String(car.year),
          mileageFromOdometer: { "@type": "QuantitativeValue", value: car.km, unitCode: "KMT" },
          fuelType: car.fuelType,
          offers: {
            "@type": "Offer",
            price: car.price,
            priceCurrency: "ILS",
            availability: "https://schema.org/InStock",
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">ראשי</Link>
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            <Link href="/search" className="hover:text-foreground transition-colors">חיפוש</Link>
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            <span className="text-foreground font-medium">{car.make} {car.model} {car.year}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* ── Left Column: Car Details ── */}
          <div className="space-y-6">
            {/* Gallery */}
            <div className="relative">
              <CarGallery
                images={car.images}
                alt={`${car.make} ${car.model} ${car.year}`}
              />
              {car.originalPrice && car.originalPrice > car.price && (
                <div className="absolute top-4 start-4 z-20 rounded-lg bg-red-500 text-white px-3 py-1.5 text-sm font-bold shadow-lg">
                  הנחה {Math.round((1 - car.price / car.originalPrice) * 100)}%
                </div>
              )}
              <div className="absolute top-4 end-4 z-20">
                <FavoriteButton carId={car.id} carTitle={`${car.make} ${car.model}`} />
              </div>
            </div>

            {/* Title + Price */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {car.make} {car.model} {car.year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {car.city} · {FUEL_TYPES[car.fuelType]} · {TRANSMISSION_TYPES[car.transmission]} · יד {car.hand}
                </p>
              </div>
              <div className="text-start sm:text-end">
                <p className="text-3xl font-bold text-primary">{formatPrice(car.price)}</p>
                {car.originalPrice && car.originalPrice > car.price && (
                  <p className="text-sm text-muted-foreground line-through">{formatPrice(car.originalPrice)}</p>
                )}
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {car.hasFinancing && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1.5 text-xs font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  מימון זמין
                </span>
              )}
              {car.hasWarranty && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 text-xs font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  אחריות
                </span>
              )}
              {car.hasTradeIn && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 text-xs font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  טרייד אין
                </span>
              )}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className="text-lg font-bold mb-3">תיאור הרכב</h2>
                <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Dealer Info */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-bold">פרטי הסוחר</h2>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  סוחר מאומת
                </div>
              </div>
              <div>
                <p className="font-semibold">{car.dealerName}</p>
                {car.dealerCity && (
                  <p className="text-sm text-muted-foreground">{car.dealerCity}</p>
                )}
              </div>
            </div>

            {/* Monthly Cost Calculator */}
            <TotalMonthlyCostCard
              carPrice={car.price}
              carYear={car.year}
              fuelConsumption={car.fuelConsumption || 14}
              fuelType={car.fuelType}
              annualFee={"annualFee" in car ? car.annualFee : null}
            />
          </div>

          {/* ── Right Column: Contact Panel (sticky) ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CarContactPanel
              carId={car.id}
              dealerId={car.dealerId}
              dealerPhone={car.dealerPhone}
              dealerName={car.dealerName}
              carTitle={`${car.make} ${car.model} ${car.year}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
