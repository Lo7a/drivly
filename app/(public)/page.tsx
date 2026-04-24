import { HeroSection } from "@/components/shared/HeroSection";
import { SearchFilters } from "@/components/shared/SearchFilters";
import { CATEGORY_TAGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatKm } from "@/lib/format";
import { FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/constants";
import Image from "next/image";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import {
  Car,
  Calculator,
  Shield,
  Fuel,
  GraduationCap,
  Users,
  Baby,
  Leaf,
  Gem,
  Mountain,
  ArrowLeft,
  TrendingDown,
  Headset,
  MapPin,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  students: <GraduationCap className="h-5 w-5" />,
  families: <Users className="h-5 w-5" />,
  "large-families": <Baby className="h-5 w-5" />,
  economical: <Leaf className="h-5 w-5" />,
  luxury: <Gem className="h-5 w-5" />,
  offroad: <Mountain className="h-5 w-5" />,
};

async function getFeaturedCars() {
  try {
    return await prisma.car.findMany({
      where: { isFeatured: true, status: "APPROVED" },
      orderBy: [{ featuredOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    });
  } catch {
    return [];
  }
}

function featuredGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();

  return (
    <>
      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ SEARCH FILTERS ═══ */}
      <SearchFilters />

      {/* ═══ "WHY DRIVLY?" ═══ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 block">
              <span className="text-foreground">Driv</span>
              <span className="text-primary">ly</span>
            </span>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              למה Drivly?
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              החוויה המושלמת לקניית רכב
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                icon: Headset,
                title: "ליווי מקצועי",
                desc: "צוות מומחים זמין לכל שאלה",
                color: "text-cyan-500 bg-cyan-500/10",
              },
              {
                icon: MapPin,
                title: "כל הארץ",
                desc: "אלפי רכבים מסוחרים בכל רחבי ישראל",
                color: "text-rose-500 bg-rose-500/10",
              },
              {
                icon: CheckCircle,
                title: "קל ומהיר",
                desc: "חיפוש מתקדם, סינון חכם וצפייה בכל הפרטים",
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                icon: ShieldCheck,
                title: "בטוח ושקוף",
                desc: "רק סוחרים מאומתים ורכבים בדוקים",
                color: "text-amber-500 bg-amber-500/10",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="card-hover rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                קטגוריות
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">מה מתאים לכם?</h2>
            </div>
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              כל הרכבים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:pb-0">
            {CATEGORY_TAGS.map((category) => (
              <Link
                key={category.value}
                href={`/search?category=${category.value}`}
                className="card-hover group shrink-0 w-36 sm:w-auto snap-start flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
                  {CATEGORY_ICONS[category.value] || <Car className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{category.label}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ "REAL COST" ═══ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Content */}
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                הפיצ&apos;ר שלנו
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
                כמה זה עולה
                <br />
                <span className="text-primary">באמת?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                המחיר על השלט זה רק ההתחלה. אנחנו מחשבים עבורכם את העלות
                החודשית המלאה — כדי שתדעו בדיוק מה מחכה לכם.
              </p>

              <div className="space-y-4 flex-1">
                {[
                  { icon: Calculator, title: "מחשבון מימון", desc: "תשלום חודשי מדויק לפי מקדמה וריבית", color: "text-cyan-500 bg-cyan-500/10" },
                  { icon: Shield, title: "הערכת ביטוח", desc: "עלות ביטוח משוערת לפי גיל וסוג רכב", color: "text-emerald-500 bg-emerald-500/10" },
                  { icon: Fuel, title: "עלות דלק", desc: "צריכה חודשית לפי ק״מ וסוג מנוע", color: "text-amber-500 bg-amber-500/10" },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-card hover:shadow-sm transition-all border border-transparent hover:border-border"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost card */}
            <div className="relative flex flex-col">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-cyan-400/10 to-transparent blur-2xl scale-110" />

              <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div>
                    <h4 className="font-bold">טויוטה קורולה 2023</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      32,000 ק&quot;מ · יד ראשונה · אוטומט
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary">115,000₪</p>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: "מימון חודשי", amount: "1,200₪", bar: "w-[65%]", color: "bg-cyan-500" },
                    { label: "ביטוח חודשי", amount: "350₪", bar: "w-[25%]", color: "bg-emerald-500" },
                    { label: "דלק חודשי", amount: "600₪", bar: "w-[40%]", color: "bg-amber-500" },
                  ].map(({ label, amount, bar, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold">{amount}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${color} ${bar}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">סה&quot;כ עלות חודשית</p>
                    <p className="text-xs text-muted-foreground mt-0.5">כולל מימון + ביטוח + דלק</p>
                  </div>
                  <p className="text-3xl font-bold text-primary">2,150₪</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <span>זול ב-15% מהממוצע בקטגוריה</span>
                  <TrendingDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED CARS ═══ */}
      {featuredCars.length > 0 && (
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">חדש במערכת</p>
              <h2 className="text-2xl sm:text-3xl font-bold">רכבים מומלצים</h2>
            </div>
            <Link href="/search" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              הצגת הכל
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className={`grid gap-5 ${featuredGridClass(featuredCars.length)}`}>
            {featuredCars.map((car) => {
              const imageUrl = car.images[0]?.url || "/hero-bg.png";
              const monthly = Math.round(((car.price * 0.8) / 48 + 350 + 600) / 10) * 10;
              const hasDiscount = car.originalPrice && car.originalPrice > car.price;
              const discountPct = hasDiscount
                ? Math.round((1 - car.price / (car.originalPrice as number)) * 100)
                : 0;
              return (
                <Link
                  key={car.id}
                  href={`/car/${car.slug}`}
                  className="card-hover group block overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${car.make} ${car.model} ${car.year}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Car className="h-16 w-16 text-muted-foreground/10" />
                      </div>
                    )}
                    <div className="absolute bottom-3 start-3 glass rounded-lg px-3 py-1.5 shadow-lg">
                      <span className="text-base font-bold text-primary">{formatPrice(car.price)}</span>
                      {hasDiscount && (
                        <span className="ms-2 text-[11px] text-muted-foreground line-through">
                          {formatPrice(car.originalPrice as number)}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 start-3 rounded-md bg-foreground/80 text-background px-2.5 py-1 text-xs font-medium">
                      יד {car.hand}
                    </div>
                    {hasDiscount ? (
                      <div className="absolute top-3 end-3 rounded-md bg-red-500 text-white px-2.5 py-1 text-xs font-bold shadow-md">
                        הנחה {discountPct}%
                      </div>
                    ) : (
                      <div className="absolute top-3 end-3 rounded-md bg-primary/90 text-primary-foreground px-2.5 py-1 text-xs font-medium">
                        ~{formatPrice(monthly)}/חודש
                      </div>
                    )}
                    <div className="absolute bottom-3 end-3">
                      <FavoriteButton carId={car.id} carTitle={`${car.make} ${car.model}`} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">
                      {car.make} {car.model} {car.year}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[formatKm(car.km), TRANSMISSION_TYPES[car.transmission], FUEL_TYPES[car.fuelType]].map((tag) => (
                        <span key={tag} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ═══ DEALER CTA ═══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_hsl(192_80%_40%_/_0.3),_transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">לסוחרי רכב</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                הגיעו לאלפי
                <br />
                לקוחות חדשים
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
                העלו את הרכבים שלכם בחינם. בלי עמלות, בלי התחייבות. הרשמה פשוטה תוך דקה אחת.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-7 py-3.5 text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5">
                  הרשמה כסוחר
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/15 text-white px-7 py-3.5 text-sm font-medium hover:bg-white/20 transition-all">
                  כניסה למערכת
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "0₪", label: "עלות הרשמה", sub: "חינם לגמרי" },
                { num: "24/7", label: "חשיפה", sub: "הרכבים שלכם תמיד נראים" },
                { num: "100%", label: "ניהול עצמאי", sub: "העלאה ועריכה בקליק" },
                { num: "∞", label: "רכבים", sub: "ללא הגבלת כמות" },
              ].map(({ num, label, sub }) => (
                <div key={label} className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/10 transition-colors">
                  <p className="text-2xl font-bold text-cyan-400 mb-1">{num}</p>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
