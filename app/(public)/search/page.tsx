import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Car } from "lucide-react";
import { CarCard } from "@/components/shared/CarCard";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_NAME, CAR_MAKES, FUEL_TYPES, REGIONS, CATEGORY_TAGS } from "@/lib/constants";
import { searchParamsSchema, type SearchParams } from "@/lib/validators";
import type { FuelType, Region } from "@prisma/client";

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

// ─── Mock Data (will be replaced with Prisma queries) ───

const MOCK_CARS: Array<{
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
  categoryTag?: string | null;
}> = [
  { slug: "toyota-corolla-2023-a1b2", make: "טויוטה", model: "קורולה", year: 2023, price: 115000, originalPrice: 125000, km: 32000, hand: 1, fuelType: "PETROL", region: "CENTER", city: "ראשון לציון", categoryTag: "families" },
  { slug: "hyundai-tucson-2022-c3d4", make: "יונדאי", model: "טוסון", year: 2022, price: 145000, km: 48000, hand: 1, fuelType: "PETROL", region: "TEL_AVIV", city: "תל אביב", categoryTag: "families" },
  { slug: "mazda-cx5-2023-e5f6", make: "מאזדה", model: "CX-5", year: 2023, price: 165000, km: 25000, hand: 1, fuelType: "PETROL", region: "HAIFA", city: "חיפה", categoryTag: "luxury" },
  { slug: "skoda-octavia-2024-g7h8", make: "סקודה", model: "אוקטביה", year: 2024, price: 135000, km: 15000, hand: 1, fuelType: "PETROL", region: "CENTER", city: "פתח תקווה", categoryTag: "families" },
  { slug: "kia-sportage-2023-i9j0", make: "קיה", model: "ספורטג'", year: 2023, price: 155000, km: 35000, hand: 1, fuelType: "HYBRID", region: "JERUSALEM", city: "ירושלים", categoryTag: "families" },
  { slug: "toyota-yaris-2022-k1l2", make: "טויוטה", model: "יאריס", year: 2022, price: 75000, km: 40000, hand: 2, fuelType: "PETROL", region: "SOUTH", city: "באר שבע", categoryTag: "students" },
  { slug: "hyundai-i20-2023-m3n4", make: "יונדאי", model: "i20", year: 2023, price: 82000, km: 28000, hand: 1, fuelType: "PETROL", region: "CENTER", city: "נתניה", categoryTag: "students" },
  { slug: "volkswagen-golf-2023-o5p6", make: "פולקסווגן", model: "גולף", year: 2023, price: 130000, km: 22000, hand: 1, fuelType: "PETROL", region: "TEL_AVIV", city: "תל אביב", categoryTag: "luxury" },
  { slug: "tesla-model3-2023-q7r8", make: "טסלה", model: "Model 3", year: 2023, price: 175000, km: 18000, hand: 1, fuelType: "ELECTRIC", region: "CENTER", city: "הרצליה", categoryTag: "luxury" },
  { slug: "suzuki-swift-2022-s9t0", make: "סוזוקי", model: "סוויפט", year: 2022, price: 65000, km: 52000, hand: 2, fuelType: "PETROL", region: "NORTH", city: "טבריה", categoryTag: "economical" },
  { slug: "bmw-x3-2022-u1v2", make: "ב.מ.וו", model: "X3", year: 2022, price: 245000, km: 38000, hand: 1, fuelType: "PETROL", region: "TEL_AVIV", city: "רמת גן", categoryTag: "luxury" },
  { slug: "nissan-qashqai-2023-w3x4", make: "ניסאן", model: "קשקאי", year: 2023, price: 140000, km: 27000, hand: 1, fuelType: "PETROL", region: "HAIFA", city: "חיפה", categoryTag: "families" },
];

const ITEMS_PER_PAGE = 12;

// ─── Sort Options ───────────────────────────────────────

const SORT_OPTIONS = [
  { value: "newest", label: "החדשים ביותר" },
  { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
  { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
  { value: "year-desc", label: "שנה: מהחדש לישן" },
  { value: "km-asc", label: 'ק"מ: מהנמוך לגבוה' },
];

// ─── Helpers ────────────────────────────────────────────

function buildActiveTagsLabel(filters: SearchParams): string[] {
  const tags: string[] = [];
  if (filters.make) {
    const found = CAR_MAKES.find((m) => m.value === filters.make);
    if (found) tags.push(found.label);
  }
  if (filters.model) tags.push(filters.model);
  if (filters.fuelType) {
    const label = FUEL_TYPES[filters.fuelType as keyof typeof FUEL_TYPES];
    if (label) tags.push(label);
  }
  if (filters.region) {
    const label = REGIONS[filters.region as keyof typeof REGIONS];
    if (label) tags.push(label);
  }
  if (filters.category) {
    const cat = CATEGORY_TAGS.find((c) => c.value === filters.category);
    if (cat) tags.push(cat.label);
  }
  if (filters.q) tags.push(`"${filters.q}"`);
  return tags;
}

function filterMockCars(filters: SearchParams) {
  let cars = [...MOCK_CARS];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    cars = cars.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }
  if (filters.make) {
    const makeLabel = CAR_MAKES.find((m) => m.value === filters.make)?.label;
    if (makeLabel) cars = cars.filter((c) => c.make === makeLabel);
  }
  if (filters.model) {
    cars = cars.filter((c) => c.model === filters.model);
  }
  if (filters.minPrice) {
    cars = cars.filter((c) => c.price >= filters.minPrice!);
  }
  if (filters.maxPrice && filters.maxPrice < 500000) {
    cars = cars.filter((c) => c.price <= filters.maxPrice!);
  }
  if (filters.minYear && filters.minYear > 2005) {
    cars = cars.filter((c) => c.year >= filters.minYear!);
  }
  if (filters.maxYear && filters.maxYear < new Date().getFullYear() + 1) {
    cars = cars.filter((c) => c.year <= filters.maxYear!);
  }
  if (filters.fuelType) {
    cars = cars.filter((c) => c.fuelType === filters.fuelType);
  }
  if (filters.region) {
    cars = cars.filter((c) => c.region === filters.region);
  }
  if (filters.hand) {
    cars = cars.filter((c) => c.hand <= filters.hand!);
  }
  if (filters.category) {
    cars = cars.filter((c) => c.categoryTag === filters.category);
  }

  // Sort
  switch (filters.sort) {
    case "price-asc":
      cars.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      cars.sort((a, b) => b.price - a.price);
      break;
    case "year-desc":
      cars.sort((a, b) => b.year - a.year);
      break;
    case "km-asc":
      cars.sort((a, b) => a.km - b.km);
      break;
    default:
      // newest first (by year desc then km asc)
      cars.sort((a, b) => b.year - a.year || a.km - b.km);
  }

  return cars;
}

// ─── Page Component ─────────────────────────────────────

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  // Flatten arrays to single values
  const flat: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawParams)) {
    if (typeof val === "string") flat[key] = val;
    else if (Array.isArray(val) && val[0]) flat[key] = val[0];
  }
  const filters = searchParamsSchema.parse(flat);

  const allCars = filterMockCars(filters);
  const totalCount = allCars.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const page = Math.min(filters.page, totalPages);
  const cars = allCars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeTags = buildActiveTagsLabel(filters);

  return (
    <div className="min-h-[80dvh] pb-16">
      {/* ─── Page Header ─── */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              ראשי
            </Link>
            <span>/</span>
            <span className="text-foreground">חיפוש רכבים</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">חיפוש רכבים</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {totalCount > 0
                  ? `נמצאו ${totalCount} רכבים`
                  : "לא נמצאו רכבים מתאימים"}
              </p>
            </div>

            {/* Sort */}
            <SortSelect currentSort={filters.sort || "newest"} searchParams={flat} />
          </div>

          {/* Active Filter Tags */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2.5 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <Suspense fallback={<FilterSidebarSkeleton />}>
            <FilterSidebar />
          </Suspense>

          {/* Results */}
          <div className="flex-1 min-w-0">

            {cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {cars.map((car) => (
                    <CarCard key={car.slug} {...car} />
                  ))}
                </div>

                {/* Pagination */}
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
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────

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
    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    return `/search?${params.toString()}`;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">מיון:</span>
      <div className="flex flex-wrap gap-1.5">
        {SORT_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={buildSortUrl(opt.value)}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              currentSort === opt.value
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    return `/search?${params.toString()}`;
  }

  // Build page numbers to display
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
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors"
          aria-label="עמוד קודם"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground/40">
          <ArrowRight className="h-4 w-4" />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildPageUrl(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card hover:bg-muted"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors"
          aria-label="עמוד הבא"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground/40">
          <ArrowLeft className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-5">
        <Car className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h2 className="text-lg font-bold mb-2">לא נמצאו רכבים</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {hasFilters
          ? "נסו לשנות את הסינון או להרחיב את טווח החיפוש"
          : "כרגע אין רכבים זמינים במערכת. חזרו בקרוב!"}
      </p>
      {hasFilters && (
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          הצגת כל הרכבים
        </Link>
      )}
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-5 w-24 mt-4" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-5 w-28 mt-4" />
        <Skeleton className="h-9 w-full" />
      </div>
    </aside>
  );
}
