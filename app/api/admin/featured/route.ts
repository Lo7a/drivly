import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

async function ensureAdmin() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }

  const cars = await prisma.car.findMany({
    where: { isFeatured: true },
    orderBy: [{ featuredOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      dealer: { select: { id: true, businessName: true } },
    },
  });

  return NextResponse.json({ cars });
}

export async function POST(request: Request) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const carId = typeof body.carId === "string" ? body.carId : null;
  if (!carId) {
    return NextResponse.json({ error: "חסר carId" }, { status: 400 });
  }

  try {
    const car = await prisma.$transaction(async (tx) => {
      const existing = await tx.car.findUnique({
        where: { id: carId },
        select: { id: true, isFeatured: true },
      });
      if (!existing) throw new Error("הרכב לא נמצא");
      if (existing.isFeatured) return existing;

      const last = await tx.car.aggregate({
        where: { isFeatured: true },
        _max: { featuredOrder: true },
      });
      const nextOrder = (last._max.featuredOrder ?? -1) + 1;

      return tx.car.update({
        where: { id: carId },
        data: { isFeatured: true, featuredOrder: nextOrder },
        select: { id: true, isFeatured: true, featuredOrder: true },
      });
    });

    return NextResponse.json({ success: true, car });
  } catch (e) {
    console.error("[admin featured] add failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בהוספה" },
      { status: 500 }
    );
  }
}
