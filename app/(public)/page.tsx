import { SearchBar } from "@/components/shared/SearchBar";
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
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  students: <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />,
  families: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
  "large-families": <Baby className="h-5 w-5 sm:h-6 sm:w-6" />,
  economical: <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />,
  luxury: <Gem className="h-5 w-5 sm:h-6 sm:w-6" />,
  offroad: <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />,
};

export default function HomePage() {
  return (
    <>
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden mesh-gradient">
        {/* Decorative blurred circles */}
        <div className="absolute -top-24 -end-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36 text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            סוחרים מאומתים בכל הארץ
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            מצאו את הרכב המושלם
            <br />
            <span className="bg-gradient-to-l from-cyan-700 via-primary to-teal-500 bg-clip-text text-transparent animate-gradient">
              במחיר שמתאים לכם
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            השוו בין מאות רכבים, חשבו עלות חודשית אמיתית כולל מימון, ביטוח ודלק
            — הכל במקום אחד ובחינם
          </p>

          {/* Search Bar - Glassmorphism */}
          <div className="animate-fade-up delay-300 max-w-2xl mx-auto mb-8">
            <div className="glass rounded-2xl p-2 shadow-lg shadow-primary/5">
              <SearchBar size="lg" />
            </div>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up delay-400 flex items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>סוחרים מאומתים</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>ללא עמלות</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>מחשבון מימון חכם</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              מה אתם מחפשים?
            </h2>
            <p className="text-muted-foreground">
              בחרו קטגוריה ונמצא לכם את הרכב המושלם
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_TAGS.map((category, index) => (
              <Link
                key={category.value}
                href={`/search?category=${category.value}`}
                className="card-glow group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 text-center transition-all duration-300"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary group-hover:to-blue-600 group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                  {CATEGORY_ICONS[category.value] || (
                    <Car className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-0.5">
                    {category.label}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ "How Much Does It Really Cost?" ═══ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />
        <div className="absolute inset-0 noise" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-4">
              <Calculator className="h-3.5 w-3.5" />
              כלי חישוב חכם
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              כמה זה{" "}
              <span className="text-primary">עולה באמת?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              לא רק מחיר הרכב — גלו את העלות החודשית האמיתית
              כולל כל ההוצאות
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {/* Finance Card */}
            <div className="card-glow group rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-500">
                <Calculator className="h-7 w-7 text-blue-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">מחשבון מימון</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                חשבו תשלום חודשי מדויק לפי מקדמה, תקופה וריבית
              </p>
            </div>

            {/* Insurance Card */}
            <div className="card-glow group rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-500">
                <Shield className="h-7 w-7 text-emerald-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">הערכת ביטוח</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                קבלו הערכה לעלות ביטוח חודשית לפי גיל הנהג וסוג הרכב
              </p>
            </div>

            {/* Fuel Card */}
            <div className="card-glow group rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500">
                <Fuel className="h-7 w-7 text-amber-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">עלות דלק</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                חשבו כמה תוציאו על דלק כל חודש לפי צריכת הרכב
              </p>
            </div>
          </div>

          {/* Example cost breakdown */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="glass rounded-2xl p-6 shadow-xl shadow-primary/5">
              <h4 className="text-sm font-semibold text-center mb-4 text-muted-foreground">
                דוגמה: טויוטה קורולה 2023
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">מימון חודשי</span>
                  <span className="font-semibold">~1,200₪</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ביטוח חודשי</span>
                  <span className="font-semibold">~350₪</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">דלק חודשי</span>
                  <span className="font-semibold">~600₪</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-bold">סה&quot;כ חודשי</span>
                  <span className="text-xl font-bold text-primary">~2,150₪</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Featured Cars ═══ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                רכבים מובילים
              </h2>
              <p className="text-muted-foreground text-sm">
                הרכבים הפופולריים ביותר במערכת
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              הצגת הכל
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { make: "טויוטה", model: "קורולה", year: 2023, price: "115,000₪", km: "32,000", hand: 1 },
              { make: "יונדאי", model: "טוסון", year: 2022, price: "145,000₪", km: "48,000", hand: 1 },
              { make: "מאזדה", model: "CX-5", year: 2023, price: "165,000₪", km: "25,000", hand: 1 },
            ].map((car, i) => (
              <div
                key={i}
                className="card-glow group overflow-hidden rounded-2xl border border-border/60 bg-card"
              >
                {/* Image placeholder */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="h-16 w-16 text-muted-foreground/15 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute bottom-3 start-3 rounded-lg glass px-3 py-1.5 shadow-sm">
                    <span className="text-lg font-bold text-primary">{car.price}</span>
                  </div>
                  <div className="absolute top-3 start-3 rounded-lg bg-foreground/80 text-background px-2.5 py-1 text-xs font-medium">
                    יד {car.hand}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-3 group-hover:text-primary transition-colors">
                    {car.make} {car.model} {car.year}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{car.km} ק&quot;מ</span>
                    <span>•</span>
                    <span>אוטומט</span>
                    <span>•</span>
                    <span>בנזין</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile "show all" link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              הצגת כל הרכבים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Dealer CTA ═══ */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 noise" />

        {/* Decorative elements */}
        <div className="absolute top-0 end-0 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 start-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              הצטרפו בחינם
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              סוחר רכבים?
              <br />
              הגיעו ללקוחות חדשים
            </h2>
            <p className="text-white/70 mb-10 text-base sm:text-lg leading-relaxed">
              העלו את הרכבים שלכם בחינם והגיעו לאלפי לקוחות פוטנציאליים.
              <br className="hidden sm:block" />
              הרשמה פשוטה תוך דקה.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white text-primary px-8 py-3.5 text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
              >
                הרשמה כסוחר
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 text-sm font-medium hover:bg-white/20 transition-all"
              >
                כניסה למערכת
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
