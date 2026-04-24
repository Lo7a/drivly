"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Car as CarIcon, Plus, X, GripVertical, Store } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatPrice } from "@/lib/format";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type DealerCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string | null;
};

type Dealer = {
  id: string;
  businessName: string;
  carsCount: number;
  cars: DealerCar[];
};

type FeaturedCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string | null;
  dealerName: string;
};

export function FeaturedManager({
  dealers,
  initialFeatured,
}: {
  dealers: Dealer[];
  initialFeatured: FeaturedCar[];
}) {
  const [featured, setFeatured] = useState<FeaturedCar[]>(initialFeatured);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [pendingAdd, setPendingAdd] = useState<string | null>(null);
  const [isReordering, startReorder] = useTransition();

  const featuredIds = new Set(featured.map((c) => c.id));
  const selectedDealer = dealers.find((d) => d.id === selectedDealerId);
  const dealerCars = selectedDealer?.cars ?? [];

  async function onAddFeatured(car: DealerCar) {
    if (featuredIds.has(car.id) || !selectedDealer) return;
    setPendingAdd(car.id);
    try {
      const res = await fetch("/api/admin/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "שגיאה בהוספה");
      }
      setFeatured((prev) => [
        ...prev,
        {
          ...car,
          dealerName: selectedDealer.businessName,
        },
      ]);
      toast.success("הרכב נוסף למומלצים");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setPendingAdd(null);
    }
  }

  async function onRemoveFeatured(carId: string) {
    const before = featured;
    setFeatured((prev) => prev.filter((c) => c.id !== carId));
    try {
      const res = await fetch(`/api/admin/featured/${carId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("שגיאה בהסרה");
      toast.success("הרכב הוסר מהמומלצים");
    } catch (e) {
      setFeatured(before);
      toast.error(e instanceof Error ? e.message : "שגיאה");
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = featured.findIndex((c) => c.id === active.id);
    const newIndex = featured.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(featured, oldIndex, newIndex);
    setFeatured(next);
    startReorder(async () => {
      try {
        const res = await fetch("/api/admin/featured/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: next.map((c) => c.id) }),
        });
        if (!res.ok) throw new Error("שגיאה בשינוי הסדר");
      } catch (err) {
        setFeatured(featured);
        toast.error(err instanceof Error ? err.message : "שגיאה");
      }
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Picker side ── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">בחר רכבים להוספה</h2>
        </div>

        <Select
          value={selectedDealerId ?? undefined}
          onValueChange={setSelectedDealerId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר סוחר…" />
          </SelectTrigger>
          <SelectContent>
            {dealers.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                אין סוחרים מאושרים
              </div>
            )}
            {dealers.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.businessName} ({d.carsCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4 space-y-2 max-h-135 overflow-y-auto pe-1">
          {!selectedDealerId && (
            <EmptyState label="בחר סוחר כדי לראות את הרכבים שלו" />
          )}
          {selectedDealerId && dealerCars.length === 0 && (
            <EmptyState label="לסוחר הזה אין רכבים מאושרים" />
          )}
          {dealerCars.map((car) => {
            const already = featuredIds.has(car.id);
            const adding = pendingAdd === car.id;
            return (
              <div
                key={car.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-2.5"
              >
                <CarThumb url={car.imageUrl} alt={`${car.make} ${car.model}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {car.make} {car.model} {car.year}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(car.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddFeatured(car)}
                  disabled={already || adding}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    already
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  }`}
                >
                  {already ? "במומלצים" : adding ? "מוסיף…" : (<><Plus className="h-3.5 w-3.5" />הוסף</>)}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Featured list side ── */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">בדף הבית</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1">
            {featured.length} רכבים
            {isReordering && <span className="text-[10px] opacity-70">· שומר</span>}
          </span>
        </div>

        {featured.length === 0 ? (
          <EmptyState label="עדיין לא בחרת רכבים. הוסף מהצד השני." />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={featured.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {featured.map((car, index) => (
                  <SortableRow
                    key={car.id}
                    car={car}
                    position={index + 1}
                    onRemove={() => onRemoveFeatured(car.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}

        {featured.length > 0 && (
          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
            גררו את השורות כדי לשנות את סדר ההצגה. 1–2 רכבים יוצגו בעמודות רחבות,
            3 בשלוש, ו-4 ומעלה בארבע עמודות בדסקטופ.
          </p>
        )}
      </section>
    </div>
  );
}

function SortableRow({
  car,
  position,
  onRemove,
}: {
  car: FeaturedCar;
  position: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: car.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-background p-2.5 ${
        isDragging ? "border-primary shadow-lg" : "border-border"
      }`}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        aria-label="גרור לשינוי סדר"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold">
        {position}
      </span>

      <CarThumb url={car.imageUrl} alt={`${car.make} ${car.model}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {car.make} {car.model} {car.year}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {car.dealerName} · {formatPrice(car.price)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        aria-label="הסר מהמומלצים"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}

function CarThumb({ url, alt }: { url: string | null; alt: string }) {
  return (
    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
      {url ? (
        <Image src={url} alt={alt} fill className="object-cover" sizes="64px" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <CarIcon className="h-5 w-5 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
