import { SearchBar } from "@/components/shared/SearchBar";
import { CarIllustration } from "@/components/shared/CarIllustration";
import { CATEGORY_TAGS } from "@/lib/constants";
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
  CheckCircle2,
  TrendingDown,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  students: <GraduationCap className="h-5 w-5" />,
  families: <Users className="h-5 w-5" />,
  "large-families": <Baby className="h-5 w-5" />,
  economical: <Leaf className="h-5 w-5" />,
  luxury: <Gem className="h-5 w-5" />,
  offroad: <Mountain className="h-5 w-5" />,
};

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO — Split layout with car illustration ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800/95 to-background">
        {/* Ambient glow */}
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_hsl(192_80%_50%_/_0.15),_transparent_65%)]" />
        <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_hsl(192_80%_45%_/_0.1),_transparent_65%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[85vh] py-16 lg:py-0">

            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              {/* Eyebrow */}
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm text-cyan-300 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                סוחרים מאומתים · עדכון יומי
              </div>

              <h1 className="animate-fade-up delay-150 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                הרכב הבא שלכם
                <br />
                <span className="bg-gradient-to-l from-cyan-300 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  מתחיל כאן.
                </span>
              </h1>

              <p className="animate-fade-up delay-300 text-base sm:text-lg text-slate-300 max-w-lg mb-8 leading-relaxed">
                גלו את העלות החודשית
                <span className="text-white font-semibold"> האמיתית </span>
                של כל רכב — כולל מימון, ביטוח ודלק.
              </p>

              {/* Search */}
              <div className="animate-fade-up delay-400 max-w-lg">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-2 shadow-2xl shadow-cyan-900/20">
                  <SearchBar size="lg" placeholder="חפשו יצרן, דגם או מחיר..." />
                </div>
              </div>

              {/* Trust badges */}
              <div className="animate-fade-up delay-500 flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ללא עמלות
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  סוחרים מאומתים
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  מחשבון חכם
                </span>
              </div>
            </div>

            {/* Right: Car Illustration + Stats */}
            <div className="order-1 lg:order-2 relative">
              <div className="animate-fade-up delay-200 relative">
                {/* Glow behind car */}
                <div className="absolute inset-0 scale-125 bg-[radial-gradient(ellipse_at_center,_hsl(192_80%_50%_/_0.12),_transparent_60%)]" />

                {/* Car SVG */}
                <CarIllustration className="w-full max-w-[600px] mx-auto drop-shadow-2xl" />

                {/* Floating stat cards on top of car */}
                <div className="hidden sm:block absolute top-4 end-4 animate-fade-up delay-500">
                  <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/15 px-4 py-3 shadow-xl">
                    <p className="text-2xl font-bold text-white">1,200+</p>
                    <p className="text-xs text-slate-400">רכבים במערכת</p>
                  </div>
                </div>

                <div className="hidden sm:block absolute bottom-12 start-4 animate-fade-up delay-600">
                  <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/15 px-4 py-3 shadow-xl">
                    <p className="text-xs text-slate-400 mb-0.5">עלות חודשית מ-</p>
                    <p className="text-xl font-bold text-cyan-400">1,500₪</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES — Horizontal scroll on mobile, grid on desktop ═══ */}
      <section className="py-14 sm:py-20 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                קטגוריות
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">
                מה מתאים לכם?
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              כל הרכבים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* Horizontal scroll mobile, grid desktop */}
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:pb-0">
            {CATEGORY_TAGS.map((category) => (
              <Link
                key={category.value}
                href={`/search?category=${category.value}`}
                className="card-hover group flex-shrink-0 w-36 sm:w-auto snap-start flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
                  {CATEGORY_ICONS[category.value] || (
                    <Car className="h-5 w-5" />
                  )}
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

      {/* ═══ "REAL COST" — The differentiator, editorial layout ═══ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Two-column editorial layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div>
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

              {/* Feature list */}
              <div className="space-y-4">
                {[
                  {
                    icon: Calculator,
                    title: "מחשבון מימון",
                    desc: "תשלום חודשי מדויק לפי מקדמה וריבית",
                    color: "text-cyan-500 bg-cyan-500/10",
                  },
                  {
                    icon: Shield,
                    title: "הערכת ביטוח",
                    desc: "עלות ביטוח משוערת לפי גיל וסוג רכב",
                    color: "text-emerald-500 bg-emerald-500/10",
                  },
                  {
                    icon: Fuel,
                    title: "עלות דלק",
                    desc: "צריכה חודשית לפי ק״מ וסוג מנוע",
                    color: "text-amber-500 bg-amber-500/10",
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-card hover:shadow-sm transition-all border border-transparent hover:border-border"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive cost card */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-cyan-400/10 to-transparent blur-2xl scale-110" />

              <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div>
                    <h4 className="font-bold">טויוטה קורולה 2023</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      32,000 ק&quot;מ · יד ראשונה · אוטומט
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">115,000₪</p>
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-4 mb-6">
                  {[
                    {
                      label: "מימון חודשי",
                      amount: "1,200₪",
                      bar: "w-[65%]",
                      color: "bg-cyan-500",
                    },
                    {
                      label: "ביטוח חודשי",
                      amount: "350₪",
                      bar: "w-[25%]",
                      color: "bg-emerald-500",
                    },
                    {
                      label: "דלק חודשי",
                      amount: "600₪",
                      bar: "w-[40%]",
                      color: "bg-amber-500",
                    },
                  ].map(({ label, amount, bar, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold">{amount}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} ${bar} transition-all duration-1000`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      סה&quot;כ עלות חודשית
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      כולל מימון + ביטוח + דלק
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-primary">2,150₪</p>
                </div>

                {/* Savings hint */}
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>
                    זול ב-15% מהממוצע בקטגוריה
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED CARS — Asymmetric, editorial ═══ */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                חדש במערכת
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold">
                רכבים מובילים
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              הצגת הכל
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                make: "טויוטה",
                model: "קורולה",
                year: 2023,
                price: "115,000₪",
                km: "32,000",
                hand: 1,
                fuel: "בנזין",
                monthly: "~2,150₪",
              },
              {
                make: "יונדאי",
                model: "טוסון",
                year: 2022,
                price: "145,000₪",
                km: "48,000",
                hand: 1,
                fuel: "היברידי",
                monthly: "~2,800₪",
              },
              {
                make: "מאזדה",
                model: "CX-5",
                year: 2023,
                price: "165,000₪",
                km: "25,000",
                hand: 1,
                fuel: "בנזין",
                monthly: "~3,100₪",
              },
            ].map((car, i) => (
              <div
                key={i}
                className="card-hover group overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Image area */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="h-20 w-20 text-muted-foreground/10 group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Price chip */}
                  <div className="absolute bottom-3 start-3 glass rounded-lg px-3 py-1.5 shadow-lg">
                    <span className="text-lg font-bold">{car.price}</span>
                  </div>

                  {/* Hand badge */}
                  <div className="absolute top-3 start-3 rounded-md bg-foreground/80 text-background px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    יד {car.hand}
                  </div>

                  {/* Monthly estimate chip */}
                  <div className="absolute top-3 end-3 rounded-md bg-primary/90 text-primary-foreground px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    {car.monthly}/חודש
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">
                    {car.make} {car.model} {car.year}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    {[`${car.km} ק"מ`, "אוטומט", car.fuel].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              הצגת כל הרכבים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ DEALER CTA — Bold, dark, confident ═══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_hsl(192_80%_40%_/_0.3),_transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">
                לסוחרי רכב
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                הגיעו לאלפי
                <br />
                לקוחות חדשים
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
                העלו את הרכבים שלכם בחינם. בלי עמלות, בלי התחייבות.
                הרשמה פשוטה תוך דקה אחת.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-7 py-3.5 text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  הרשמה כסוחר
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/15 text-white px-7 py-3.5 text-sm font-medium hover:bg-white/20 transition-all"
                >
                  כניסה למערכת
                </Link>
              </div>
            </div>

            {/* Right: Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "0₪", label: "עלות הרשמה", sub: "חינם לגמרי" },
                { num: "24/7", label: "חשיפה", sub: "הרכבים שלכם תמיד נראים" },
                { num: "100%", label: "ניהול עצמאי", sub: "העלאה ועריכה בקליק" },
                { num: "∞", label: "רכבים", sub: "ללא הגבלת כמות" },
              ].map(({ num, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/10 transition-colors"
                >
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
