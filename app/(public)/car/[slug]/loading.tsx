import { Skeleton } from "@/components/ui/skeleton";

export default function CarDetailLoading() {
  return (
    <div className="min-h-[80dvh] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-36" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Image gallery */}
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-20 rounded-lg" />
              ))}
            </div>

            {/* Title + price */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Specs grid */}
            <div className="rounded-2xl border border-border p-6">
              <Skeleton className="h-5 w-24 mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border p-6 space-y-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Lead form */}
            <div className="rounded-2xl border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Monthly cost card */}
            <div className="rounded-2xl border border-border p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-3.5 w-14" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
