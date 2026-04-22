import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const auth = await createClient();
    const { data: { user: authUser } } = await auth.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const carId = (formData.get("carId") as string) || "temp";
    const dealerId = (formData.get("dealerId") as string) || authUser.id;

    if (!file) {
      return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `סוג קובץ לא נתמך (${file.type}). השתמש ב-JPEG, PNG או WebP` },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "הקובץ גדול מדי. מקסימום 10MB" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    const fileName = `${dealerId}/${carId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const bytes = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(fileName, bytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("[upload] Supabase upload error:", error);
      return NextResponse.json(
        { error: `שגיאה בהעלאה: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from("car-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch (e) {
    console.error("[upload] Unexpected error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה לא ידועה בהעלאה" },
      { status: 500 }
    );
  }
}
