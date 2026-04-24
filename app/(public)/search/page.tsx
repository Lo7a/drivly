import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Home,
  ChevronLeft,
  SearchX,
} from "lucide-react";
import { CarCard } from "@/components/shared/CarCard";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SITE_NAME,
  CAR_MAKES,
  FUEL_TYPES,
  REGIONS,
  CATEGORY_TAGS,
} from "@/lib/constants";
import { searchParamsSchema, type SearchParams } from "@/lib/validators";
import type { FuelType, Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ─── SEO ────────────────────────────────────────────────

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Metadata {
  return {
    title: `חיפוש רכבים | ${SITE_NAME}`,
    description:
      "חפשו מבין אלפי רכבים יד שנייה מסוחרים מאומתים בכל רחבי ישראל. סינון לפי יצרן, דגם, מחיר, שנה ועוד.",
  };
}

const ITEMS_PER_PAGE = 12;

// Same shape as old MOCK_CARS, built from real DB
type CarItem = {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number | null;
  km: number;
  hand: number;
  fuelType: FuelType;
  region: Region;
  city: string;
  imageUrl?: string | null;
  images?: string[];
  categoryTag?: string | null;
};

async function queryCars(filters: SearchParams): Promise<CarItem[]> {
  const where: Record<string, unknown> = { status: "APPROVED" };

  if (filters.q) {
    where.OR = [
      { make: { contains: filters.q, mode: "insensitive" } },
      { model: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.make) {
    const makeLabel = CAR_MAKES.find((m) => m.value === filters.make)?.label;
    if (makeLabel) where.make = makeLabel;
  }
  if (filters.model) where.model = filters.model;
  if (filters.minPrice || (filters.maxPrice && filters.maxPrice < 500000)) {
    const priceFilter: Record<string, number> = {};
    if (filters.minPrice) priceFilter.gte = filters.minPrice;
    if (filters.maxPrice && filters.maxPrice < 500000) priceFilter.lte = filters.maxPrice;
    where.price = priceFilter;
  }
  if ((filters.minYear && filters.minYear > 2005) || (filters.maxYear && filters.maxYear < new Date().getFullYear() + 1)) {
    const yearFilter: Record<string, number> = {};
    if (filters.minYear && filters.minYear > 2005) yearFilter.gte = filters.minYear;
    if (filters.maxYear && filters.maxYear < new Date().getFullYear() + 1) yearFilter.lte = filters.maxYear;
    where.year = yearFilter;
  }
  if (filters.minKm || (filters.maxKm && filters.maxKm < 300000)) {
    const kmFilter: Record<string, number> = {};
    if (filters.minKm) kmFilter.gte = filters.minKm;
    if (filters.maxKm && filters.maxKm < 300000) kmFilter.lte = filters.maxKm;
    where.km = kmFilter;
  }
  if (filters.fuelType) where.fuelType = filters.fuelType;
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.region) where.region = filters.region;
  if (filters.hand) {
    // "4+" means fourth-hand or more; 1/2/3 are exact
    where.hand = filters.hand >= 4 ? { gte: 4 } : filters.hand;
  }
  if (filters.category) where.categoryTag = filters.category;

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (filters.sort) {
    case "price-asc": orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "year-desc": orderBy = { year: "desc" }; break;
    case "km-asc": orderBy = { km: "asc" }; break;
  }

  try {
    const cars = await prisma.car.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { order: "asc" } },
        dealer: { select: { city: true } },
      },
      take: 100,
    });

    return cars.map((c) => ({
      slug: c.slug,
      make: c.make,
      model: c.model,
      year: c.year,
      price: c.price,
      originalPrice: c.originalPrice,
      km: c.km,
      hand: c.hand,
      fuelType: c.fuelType,
      region: c.region ?? "CENTER",
      city: c.dealer.city ?? "",
      imageUrl: c.images[0]?.url ?? null,
      images: c.images.map((i) => i.url),
      categoryTag: c.categoryTag,
    }));
  } catch {
    return [];
  }
}

const SORT_OPTIONS = [
  { value: "newest", label: "החדשים ביותר" },
  { value: "price-asc", label: "מחיר: נמוך לגבוה" },
  { value: "price-desc", label: "מחיר: גבוה לנמוך" },
  { value: "year-desc", label: "שנה: חדש לישן" },
  { value: "km-asc", label: 'ק"מ: נמוך לגבוה' },
];

// ─── Helpers ────────────────────────────────────────────

function buildActiveTagsLabel(
  filters: SearchParams
): { key: string; label: string }[] {
  const tags: { key: string; label: string }[] = [];
  if (filters.make) {
    const found = CAR_MAKES.find((m) => m.value === filters.make);
    if (found) tags.push({ key: "make", label: found.label });
  }
  if (filters.model) tags.push({ key: "model", label: filters.model });
  if (filters.fuelType) {
    const label = FUEL_TYPES[filters.fuelType as keyof typeof FUEL_TYPES];
    if (label) tags.push({ key: "fuelType", label });
  }
  if (filters.region) {
    const label = REGIONS[filters.region as keyof typeof REGIONS];
    if (label) tags.push({ key: "region", label });
  }
  if (filters.category) {
    const cat = CATEGORY_TAGS.find((c) => c.value === filters.category);
    if (cat) tags.push({ key: "category", label: cat.label });
  }
  if (filters.q) tags.push({ key: "q", label: `"${filters.q}"` });
  return tags;
}


// ─── Page Component ─────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const flat: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawParams)) {
    if (typeof val === "string") flat[key] = val;
    else if (Array.isArray(val) && val[0]) flat[key] = val[0];
  }
  const filters = searchParamsSchema.parse(flat);

  const allCars = await queryCars(filters);
  const totalCount = allCars.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const page = Math.min(filters.page, totalPages);
  const cars = allCars.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const activeTags = buildActiveTagsLabel(filters);

  return (
    <div className="min-h-[80dvh]">
      {/* ═══ Dark Hero Header ═══ */}
      <section className="relative overflow-hidden bg-[#050816] pt-20 pb-6 sm:pt-28 sm:pb-14">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_70%_20%,_hsl(192_80%_40%_/_0.15),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_20%_80%,_hsl(220_60%_50%_/_0.1),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-4 sm:mb-6 animate-fade-in">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-white/70 transition-colors"
            >
              <Home className="h-3 w-3" />
              ראשי
            </Link>
            <ChevronLeft className="h-3 w-3 rtl:rotate-180" />
            <span className="text-white/70">חיפוש רכבים</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-5">
            <div className="animate-fade-up">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                חיפוש <span className="text-cyan-400">רכבים</span>
              </h1>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/50">
                {totalCount > 0 ? (
                  <>
                    נמצאו{" "}
                    <span className="text-cyan-400 font-semibold">
                      {totalCount}
                    </span>{" "}
                    רכבים מתאימים
                  </>
                ) : (
                  "לא נמצאו רכבים מתאימים לחיפוש"
                )}
              </p>
            </div>

            {/* Sort Pills */}
            <div className="animate-fade-up delay-150 -mx-4 sm:mx-0">
              <SortSelect
                currentSort={filters.sort || "newest"}
                searchParams={flat}
              />
            </div>
          </div>

          {/* Active Filters */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 animate-fade-up delay-200">
              <span className="text-[11px] text-white/30 font-medium">
                פילטרים:
              </span>
              {activeTags.map((tag) => (
                <RemovableTag
                  key={tag.key}
                  label={tag.label}
                  paramKey={tag.key}
                  searchParams={flat}
                />
              ))}
              {activeTags.length > 1 && (
                <Link
                  href="/search"
                  className="text-[11px] text-white/40 hover:text-cyan-400 transition-colors underline underline-offset-2"
                >
                  נקה הכל
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Bottom edge gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-cyan-500/20 to-transparent" />
      </section>

      {/* ═══ Main Content ═══ */}
      <section className="relative pb-12 sm:pb-16">
        <div className="absolute inset-0 mesh-gradient pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar (desktop) + Horizontal chips (mobile, full width) */}
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {cars.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {cars.map((car, i) => (
                      <div
                        key={car.slug}
                        className="animate-fade-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <CarCard {...car} />
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-xs text-muted-foreground mt-6 sm:mt-8">
                    מציג {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, totalCount)} מתוך{" "}
                    {totalCount} רכבים
                  </p>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      searchParams={flat}
                    />
                  )}
                </>
              ) : (
                <EmptyState hasFilters={activeTags.length > 0} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────

function RemovableTag({
  label,
  paramKey,
  searchParams,
}: {
  label: string;
  paramKey: string;
  searchParams: Record<string, string>;
}) {
  const params = new URLSearchParams(searchParams);
  params.delete(paramKey);
  params.delete("page");

  return (
    <Link
      href={`/search?${params.toString()}`}
      className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] border border-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/[0.12] hover:border-cyan-500/30 transition-all"
    >
      {label}
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 group-hover:bg-red-500/80 group-hover:text-white transition-all">
        <span className="text-[8px] leading-none">&times;</span>
      </span>
    </Link>
  );
}

function SortSelect({
  currentSort,
  searchParams,
}: {
  currentSort: string;
  searchParams: Record<string, string>;
}) {
  function buildSortUrl(sort: string) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (sort === "newest") params.delete("sort");
    else params.set("sort", sort);
    return `/search?${params.toString()}`;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xs sm:text-sm text-white/40 font-semibold shrink-0 ps-4 sm:ps-0">
        מיון:
      </span>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none lg:flex-wrap lg:overflow-visible pe-4 sm:pe-0">
        {SORT_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={buildSortUrl(opt.value)}
            className={`shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              currentSort === opt.value
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white/70"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}) {
  function buildPageUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    return `/search?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="ניווט בין עמודים"
      className="flex items-center justify-center gap-1.5 mt-10"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-sm hover:bg-primary/5 hover:border-primary/30 transition-all"
          aria-label="עמוד קודם"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground/30">
          <ArrowRight className="h-4 w-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-10 w-6 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildPageUrl(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
              p === currentPage
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border border-border bg-card hover:bg-primary/5 hover:border-primary/30"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-sm hover:bg-primary/5 hover:border-primary/30 transition-all"
          aria-label="עמוד הבא"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground/30">
          <ArrowLeft className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl scale-150" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/80 border border-border">
          <SearchX className="h-10 w-10 text-muted-foreground/40" />
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">לא נמצאו רכבים</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {hasFilters
          ? "נסו לשנות את הסינון או להרחיב את טווח החיפוש כדי לראות יותר תוצאות"
          : "כרגע אין רכבים זמינים במערכת. חזרו בקרוב!"}
      </p>
      {hasFilters && (
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          הצגת כל הרכבים
          <Search className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
      <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-4 w-20 mt-2" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-4 w-16 mt-2" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-4 w-20 mt-2" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </aside>
  );
}
