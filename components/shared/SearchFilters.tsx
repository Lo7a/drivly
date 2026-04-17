"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORY_TAGS, REGIONS } from "@/lib/constants";

export function SearchFilters() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [region, setRegion] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (year) params.set("minYear", year);
    if (region) params.set("region", region);
    router.push(`/search?${params.toString()}`);
  };

  const selectClass =
    "rounded-2xl border border-white/10 bg-[#151d30] px-4 py-4 text-sm text-white outline-none transition focus:border-cyan-400 appearance-none w-full";

  return (
    <section className="relative z-20 -mt-8 pb-8 sm:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="rounded-[28px] border border-white/10 bg-[#0b1224]/80 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_160px_160px_160px_160px]">
            {/* חיפוש טקסט */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש לפי יצרן, דגם או מילה..."
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400 w-full"
            />

            {/* סוג רכב */}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">סוג רכב</option>
              {CATEGORY_TAGS.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* שנת ייצור */}
            <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
              <option value="">שנת ייצור</option>
              {Array.from({ length: 10 }, (_, i) => 2026 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* אזור */}
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
              <option value="">אזור</option>
              {Object.entries(REGIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* כפתור חיפוש */}
            <button
              type="submit"
              className="md:col-span-2 xl:col-span-1 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-white transition hover:bg-cyan-400"
            >
              חפש רכבים
              <Search className="ms-2 h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
