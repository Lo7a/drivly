"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronDown,
  Search,
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  Hand,
  Tag,
  Settings2,
  Sparkles,
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

// ─── Searchable Combobox ────────────────────────────────

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  emptyText = "לא נמצאו תוצאות",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all ${
          open
            ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
            : "border-border bg-background hover:border-primary/30"
        } ${value ? "text-foreground" : "text-muted-foreground"}`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden animate-scale-in">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש..."
                className="w-full rounded-lg bg-muted/50 ps-8 pe-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:bg-muted"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {/* Clear option */}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-start px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                {placeholder}
              </button>
            )}
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-start px-3 py-2 text-sm transition-colors ${
                    opt.value === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                {emptyText}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter Section ─────────────────────────────────────

function FilterSection({
  icon: Icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 py-3.5 text-sm font-semibold hover:text-primary transition-colors group"
      >
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="flex-1 text-start">{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// ─── Chip Select ────────────────────────────────────────

function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(value === opt.key ? "" : opt.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            value === opt.key
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentFilters = useMemo(
    () => ({
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
    }),
    [searchParams]
  );

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

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const updateRangeFilter = useCallback(
    (minKey: string, maxKey: string, values: number[], min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values[0] > min) params.set(minKey, String(values[0]));
      else params.delete(minKey);
      if (values[1] < max) params.set(maxKey, String(values[1]));
      else params.delete(maxKey);
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

  const availableModels = useMemo(() => {
    if (!currentFilters.make) return [];
    const found = CAR_MAKES.find((m) => m.value === currentFilters.make);
    return found?.models || [];
  }, [currentFilters.make]);

  const makeOptions = CAR_MAKES.filter((m) => m.value !== "other").map((m) => ({
    value: m.value,
    label: m.label,
  }));

  const modelOptions = availableModels.map((m) => ({
    value: m,
    label: m,
  }));

  const filterContent = (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-sm">סינון תוצאות</h2>
            {activeCount > 0 && (
              <p className="text-[11px] text-primary font-medium">
                {activeCount} פילטרים פעילים
              </p>
            )}
          </div>
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors rounded-lg px-2 py-1 hover:bg-destructive/5"
          >
            <RotateCcw className="h-3 w-3" />
            נקה
          </button>
        )}
      </div>

      {/* ─── Make ─── */}
      <FilterSection icon={Sparkles} title="יצרן" defaultOpen>
        <SearchableSelect
          value={currentFilters.make}
          onChange={(val) => {
            updateFilter("make", val);
            if (val !== currentFilters.make) updateFilter("model", "");
          }}
          options={makeOptions}
          placeholder="כל היצרנים"
          emptyText="לא נמצא יצרן"
        />
      </FilterSection>

      {/* ─── Model (conditional) ─── */}
      {availableModels.length > 0 && (
        <FilterSection icon={Settings2} title="דגם" defaultOpen>
          <SearchableSelect
            value={currentFilters.model}
            onChange={(val) => updateFilter("model", val)}
            options={modelOptions}
            placeholder="כל הדגמים"
            emptyText="לא נמצא דגם"
          />
        </FilterSection>
      )}

      {/* ─── Price ─── */}
      <FilterSection icon={Tag} title="טווח מחירים" defaultOpen>
        <div className="space-y-3">
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={[currentFilters.minPrice, currentFilters.maxPrice]}
            onValueCommit={(values) =>
              updateRangeFilter("minPrice", "maxPrice", values, PRICE_MIN, PRICE_MAX)
            }
          />
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {formatPrice(currentFilters.minPrice)}
            </span>
            <div className="h-px flex-1 mx-2 bg-border" />
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {formatPrice(currentFilters.maxPrice)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* ─── Year ─── */}
      <FilterSection icon={Calendar} title="שנת ייצור" defaultOpen>
        <div className="space-y-3">
          <Slider
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={[currentFilters.minYear, currentFilters.maxYear]}
            onValueCommit={(values) =>
              updateRangeFilter("minYear", "maxYear", values, MIN_YEAR, MAX_YEAR)
            }
          />
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {currentFilters.minYear}
            </span>
            <div className="h-px flex-1 mx-2 bg-border" />
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {currentFilters.maxYear}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* ─── KM ─── */}
      <FilterSection icon={Gauge} title="קילומטראז'">
        <div className="space-y-3">
          <Slider
            min={KM_MIN}
            max={KM_MAX}
            step={KM_STEP}
            value={[currentFilters.minKm, currentFilters.maxKm]}
            onValueCommit={(values) =>
              updateRangeFilter("minKm", "maxKm", values, KM_MIN, KM_MAX)
            }
          />
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {formatKm(currentFilters.minKm)}
            </span>
            <div className="h-px flex-1 mx-2 bg-border" />
            <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
              {formatKm(currentFilters.maxKm)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* ─── Fuel Type ─── */}
      <FilterSection icon={Fuel} title="סוג דלק" defaultOpen>
        <ChipSelect
          options={Object.entries(FUEL_TYPES).map(([key, label]) => ({
            key,
            label,
          }))}
          value={currentFilters.fuelType}
          onChange={(val) => updateFilter("fuelType", val)}
        />
      </FilterSection>

      {/* ─── Transmission ─── */}
      <FilterSection icon={Settings2} title="תיבת הילוכים">
        <ChipSelect
          options={Object.entries(TRANSMISSION_TYPES).map(([key, label]) => ({
            key,
            label,
          }))}
          value={currentFilters.transmission}
          onChange={(val) => updateFilter("transmission", val)}
        />
      </FilterSection>

      {/* ─── Region ─── */}
      <FilterSection icon={MapPin} title="אזור">
        <ChipSelect
          options={Object.entries(REGIONS).map(([key, label]) => ({
            key,
            label,
          }))}
          value={currentFilters.region}
          onChange={(val) => updateFilter("region", val)}
        />
      </FilterSection>

      {/* ─── Hand ─── */}
      <FilterSection icon={Hand} title="יד">
        <ChipSelect
          options={HAND_OPTIONS.map(({ value, label }) => ({
            key: String(value),
            label,
          }))}
          value={currentFilters.hand}
          onChange={(val) => updateFilter("hand", val)}
        />
      </FilterSection>

      {/* ─── Category ─── */}
      <FilterSection icon={Tag} title="קטגוריה">
        <ChipSelect
          options={CATEGORY_TAGS.map(({ value, label }) => ({
            key: value,
            label,
          }))}
          value={currentFilters.category}
          onChange={(val) => updateFilter("category", val)}
        />
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* ─── Mobile Toggle ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary/30 hover:shadow-sm transition-all"
      >
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        סינון
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
            {activeCount}
          </span>
        )}
      </button>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-80 max-w-[85vw] bg-background shadow-2xl shadow-black/30 overflow-hidden flex flex-col animate-fade-up">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-bold text-sm">סינון תוצאות</h2>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {filterContent}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-4 border-t border-border bg-card/50">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                הצגת תוצאות
                <ChevronLeft className="h-4 w-4 ms-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:block w-[272px] shrink-0">
        <div className="sticky top-24 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 max-h-[calc(100dvh-7rem)] overflow-y-auto shadow-sm">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
