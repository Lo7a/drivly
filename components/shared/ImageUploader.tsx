"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  dealerId?: string;
  carId?: string;
  maxImages?: number;
}

export function ImageUploader({
  value,
  onChange,
  dealerId,
  carId,
  maxImages = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files: File[]) => {
    if (value.length + files.length > maxImages) {
      toast.error(`מקסימום ${maxImages} תמונות`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append("carId", carId || "temp");
      form.append("dealerId", dealerId || "temp");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "שגיאה בהעלאה");
        }
        const data = await res.json();
        uploaded.push(data.url);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "שגיאה בהעלאת קובץ");
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} תמונות הועלו`);
    }

    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) uploadFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) uploadFiles(files);
  };

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const makeMain = (idx: number) => {
    if (idx === 0) return;
    const newArr = [value[idx], ...value.filter((_, i) => i !== idx)];
    onChange(newArr);
    toast.success("הוגדרה כתמונה ראשית");
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div
              key={url}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted"
            >
              <Image
                src={url}
                alt={`תמונה ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />

              {/* Primary badge */}
              {idx === 0 && (
                <div className="absolute top-2 start-2 inline-flex items-center gap-1 rounded-full bg-cyan-500 text-white px-2 py-0.5 text-[10px] font-bold">
                  <Star className="h-3 w-3 fill-current" />
                  ראשית
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(idx)}
                    className="rounded-full bg-white/90 text-slate-900 p-2 hover:bg-white transition-colors"
                    aria-label="הגדר כתמונה ראשית"
                    title="הגדר כתמונה ראשית"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="rounded-full bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
                  aria-label="הסר תמונה"
                  title="הסר תמונה"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50"
          } disabled:opacity-50`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">מעלה תמונות...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {value.length === 0 ? "העלה תמונות" : "הוסף עוד תמונות"}
              </p>
              <p className="text-xs text-muted-foreground">
                גרור לכאן או לחץ לבחירה · JPEG / PNG / WebP · עד 10MB
              </p>
              <p className="text-[11px] text-muted-foreground">
                {value.length} / {maxImages}
              </p>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {value.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg px-3 py-2">
          <ImageIcon className="h-4 w-4 shrink-0" />
          הוסף לפחות תמונה אחת — התמונה הראשונה תוצג ככרטיסייה
        </div>
      )}
    </div>
  );
}
