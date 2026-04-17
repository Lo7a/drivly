"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import {
  CAR_MAKES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  REGIONS,
  HAND_OPTIONS,
  CATEGORY_TAGS,
  MIN_YEAR,
  MAX_YEAR,
} from "@/lib/constants";
import { formatPrice, formatKm } from "@/lib/format";

const PRICE_MIN = 0;
const PRICE_MAX = 500000;
const PRICE_STEP = 5000;
const KM_MIN = 0;
const KM_MAX = 300000;
const KM_STEP = 5000;

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read current filters from URL
  const currentFilters = useMemo(() => ({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    minPrice: Number(searchParams.get("minPrice")) || PRICE_MIN,
    maxPrice: Number(searchParams.get("maxPrice")) || PRICE_MAX,
    minYear: Number(searchParams.get("minYear")) || MIN_YEAR,
    maxYear: Number(searchParams.get("maxYear")) || MAX_YEAR,
    minKm: Number(searchParams.get("minKm")) || KM_MIN,
    maxKm: Number(searchParams.get("maxKm")) || KM_MAX,
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
    region: searchParams.get("region") || "",
    hand: searchParams.get("hand") || "",
    category: searchParams.get("category") || "",
  }), [searchParams]);

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (currentFilters.make) count++;
    if (currentFilters.model) count++;
    if (currentFilters.minPrice > PRICE_MIN) count++;
    if (currentFilters.maxPrice < PRICE_MAX) count++;
    if (currentFilters.minYear > MIN_YEAR) count++;
    if (currentFilters.maxYear < MAX_YEAR) count++;
    if (currentFilters.minKm > KM_MIN) count++;
    if (currentFilters.maxKm < KM_MAX) count++;
    if (currentFilters.fuelType) count++;
    if (currentFilters.transmission) count++;
    if (currentFilters.region) count++;
    if (currentFilters.hand) count++;
    if (currentFilters.category) count++;
    return count;
  }, [currentFilters]);

  // Update URL params
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const updateRangeFilter = useCallback(
    (minKey: string, maxKey: string, values: number[], min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values[0] > min) {
        params.set(minKey, String(values[0]));
      } else {
        params.delete(minKey);
      }
      if (values[1] < max) {
        params.set(maxKey, String(values[1]));
      } else {
        params.delete(maxKey);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    const sort = searchParams.get("sort");
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Get models for selected make
  const availableModels = useMemo(() => {
    if (!currentFilters.make) return [];
    const found = CAR_MAKES.find((m) => m.value === currentFilters.make);
    return found?.models || [];
  }, [currentFilters.make]);

  const filterContent = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-sm">סינון</h2>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            נקה הכל
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["make", "price", "year", "fuel", "region"]}
        className="w-full"
      >
        {/* ─── Make & Model ─── */}
        <AccordionItem value="make">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            יצרן ודגם
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <select
              value={currentFilters.make}
              onChange={(e) => {
                updateFilter("make", e.target.value);
                if (e.target.value !== currentFilters.make) {
                  updateFilter("model", "");
                }
              }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">כל היצרנים</option>
              {CAR_MAKES.filter((m) => m.value !== "other").map((make) => (
                <option key={make.value} value={make.value}>
                  {make.label}
                </option>
              ))}
            </select>

            {availableModels.length > 0 && (
              <select
                value={currentFilters.model}
                onChange={(e) => updateFilter("model", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">כל הדגמים</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* ─── Price Range ─── */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            טווח מחירים
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={[currentFilters.minPrice, currentFilters.maxPrice]}
              onValueCommit={(values) =>
                updateRangeFilter("minPrice", "maxPrice", values, PRICE_MIN, PRICE_MAX)
              }
              className="mt-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatPrice(currentFilters.minPrice)}</span>
              <span>{formatPrice(currentFilters.maxPrice)}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ─── Year Range ─── */}
        <AccordionItem value="year">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            שנת ייצור
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <Slider
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={[currentFilters.minYear, currentFilters.maxYear]}
              onValueCommit={(values) =>
                updateRangeFilter("minYear", "maxYear", values, MIN_YEAR, MAX_YEAR)
              }
              className="mt-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentFilters.minYear}</span>
              <span>{currentFilters.maxYear}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ─── KM Range ─── */}
        <AccordionItem value="km">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            קילומטראז&#39;
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <Slider
              min={KM_MIN}
              max={KM_MAX}
              step={KM_STEP}
              value={[currentFilters.minKm, currentFilters.maxKm]}
              onValueCommit={(values) =>
                updateRangeFilter("minKm", "maxKm", values, KM_MIN, KM_MAX)
              }
              className="mt-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatKm(currentFilters.minKm)}</span>
              <span>{formatKm(currentFilters.maxKm)}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ─── Fuel Type ─── */}
        <AccordionItem value="fuel">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            סוג דלק
          </AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-4">
            {Object.entries(FUEL_TYPES).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2.5">
                <Checkbox
                  id={`fuel-${key}`}
                  checked={currentFilters.fuelType === key}
                  onCheckedChange={(checked) =>
                    updateFilter("fuelType", checked ? key : "")
                  }
                />
                <Label
                  htmlFor={`fuel-${key}`}
                  className="text-sm cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ─── Transmission ─── */}
        <AccordionItem value="transmission">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            תיבת הילוכים
          </AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-4">
            {Object.entries(TRANSMISSION_TYPES).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2.5">
                <Checkbox
                  id={`trans-${key}`}
                  checked={currentFilters.transmission === key}
                  onCheckedChange={(checked) =>
                    updateFilter("transmission", checked ? key : "")
                  }
                />
                <Label
                  htmlFor={`trans-${key}`}
                  className="text-sm cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ─── Region ─── */}
        <AccordionItem value="region">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            אזור
          </AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-4">
            {Object.entries(REGIONS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2.5">
                <Checkbox
                  id={`region-${key}`}
                  checked={currentFilters.region === key}
                  onCheckedChange={(checked) =>
                    updateFilter("region", checked ? key : "")
                  }
                />
                <Label
                  htmlFor={`region-${key}`}
                  className="text-sm cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ─── Hand ─── */}
        <AccordionItem value="hand">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            יד
          </AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-4">
            {HAND_OPTIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2.5">
                <Checkbox
                  id={`hand-${value}`}
                  checked={currentFilters.hand === String(value)}
                  onCheckedChange={(checked) =>
                    updateFilter("hand", checked ? String(value) : "")
                  }
                />
                <Label
                  htmlFor={`hand-${value}`}
                  className="text-sm cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* ─── Category ─── */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            קטגוריה
          </AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-4">
            {CATEGORY_TAGS.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2.5">
                <Checkbox
                  id={`cat-${value}`}
                  checked={currentFilters.category === value}
                  onCheckedChange={(checked) =>
                    updateFilter("category", checked ? value : "")
                  }
                />
                <Label
                  htmlFor={`cat-${value}`}
                  className="text-sm cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* ─── Mobile Toggle Button ─── */}
      <Button
        variant="outline"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        סינון
        {activeCount > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-80 max-w-[85vw] bg-background border-e border-border shadow-2xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">סינון תוצאות</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-4">
              <Button
                onClick={() => setMobileOpen(false)}
                className="w-full"
              >
                הצגת תוצאות
                <ChevronLeft className="h-4 w-4 ms-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 max-h-[calc(100dvh-7rem)] overflow-y-auto">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
