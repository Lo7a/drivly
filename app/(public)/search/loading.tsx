import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-[80dvh]">
      {/* Header skeleton */}
      <section className="bg-[#050816] pt-24 pb-10 sm:pt-28 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-3 w-32 bg-white/10 mb-6" />
          <Skeleton className="h-10 w-56 bg-white/10 mb-3" />
          <Skeleton className="h-4 w-40 bg-white/10" />
          <div className="flex gap-2 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full bg-white/[0.06]" />
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-68 shrink-0">
            <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile filter bar skeleton */}
          <div className="lg:hidden flex gap-2 overflow-hidden mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
