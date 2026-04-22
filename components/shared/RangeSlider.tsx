"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

interface Props {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onCommit: (values: [number, number]) => void;
  formatValue?: (n: number) => string;
}

export function RangeSlider({ min, max, step, value, onCommit, formatValue }: Props) {
  const [local, setLocal] = useState<[number, number]>(value);

  // Sync external value changes (e.g. URL params, clear filters)
  useEffect(() => {
    setLocal(value);
  }, [value[0], value[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = formatValue ?? ((n: number) => n.toLocaleString("he-IL"));

  return (
    <div className="space-y-3">
      <Slider
        min={min}
        max={max}
        step={step}
        value={local}
        onValueChange={(v) => setLocal([v[0], v[1]])}
        onValueCommit={(v) => onCommit([v[0], v[1]])}
      />
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
          {fmt(local[0])}
        </span>
        <div className="h-px flex-1 mx-2 bg-border" />
        <span className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
          {fmt(local[1])}
        </span>
      </div>
    </div>
  );
}
