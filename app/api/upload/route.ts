import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const carId = formData.get("carId") as string;
    const dealerId = formData.get("dealerId") as string;

    if (!file || !carId || !dealerId) {
      return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "סוג קובץ לא נתמך. השתמש ב-JPEG, PNG או WebP" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "הקובץ גדול מדי. מקסימום 5MB" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${dealerId}/${carId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "שגיאה בהעלאת הקובץ" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("car-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch {
    return NextResponse.json({ error: "שגיאה בהעלאה" }, { status: 500 });
  }
}
