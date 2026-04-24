import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const ids: unknown = body.orderedIds;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every((v) => typeof v === "string")
  ) {
    return NextResponse.json({ error: "orderedIds חייב להיות מערך של מזהים" }, { status: 400 });
  }
  const orderedIds = ids as string[];

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.car.update({
          where: { id },
          data: { isFeatured: true, featuredOrder: index },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin featured] reorder failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בשינוי הסדר" },
      { status: 500 }
    );
  }
}
