import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import type { CarStatus, FuelType, Region, TransmissionType } from "@prisma/client";

const VALID_STATUSES: CarStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "SOLD",
  "ARCHIVED",
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      dealer: { select: { id: true, userId: true, businessName: true } },
    },
  });

  if (!car) {
    return NextResponse.json({ error: "הרכב לא נמצא" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && car.dealer.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  return NextResponse.json({ car });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const car = await prisma.car.findUnique({
    where: { id },
    include: { dealer: { select: { userId: true } } },
  });

  if (!car) {
    return NextResponse.json({ error: "הרכב לא נמצא" }, { status: 404 });
  }

  const isAdmin = user.role === "ADMIN";
  if (!isAdmin && car.dealer.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};

  if (typeof body.make === "string") updates.make = body.make;
  if (typeof body.model === "string") updates.model = body.model;
  if (typeof body.year === "number") updates.year = body.year;
  if (typeof body.price === "number") updates.price = body.price;
  if ("originalPrice" in body) updates.originalPrice = body.originalPrice ?? null;
  if (typeof body.km === "number") updates.km = body.km;
  if (typeof body.hand === "number") updates.hand = body.hand;
  if (typeof body.fuelType === "string") updates.fuelType = body.fuelType as FuelType;
  if (typeof body.transmission === "string")
    updates.transmission = body.transmission as TransmissionType;
  if ("engineSize" in body) updates.engineSize = body.engineSize ?? null;
  if ("color" in body) updates.color = body.color ?? null;
  if ("region" in body) updates.region = (body.region || null) as Region | null;
  if ("annualFee" in body) updates.annualFee = body.annualFee ?? null;
  if ("description" in body) updates.description = body.description ?? null;
  if (typeof body.hasFinancing === "boolean") updates.hasFinancing = body.hasFinancing;
  if (typeof body.hasTradeIn === "boolean") updates.hasTradeIn = body.hasTradeIn;
  if (typeof body.hasWarranty === "boolean") updates.hasWarranty = body.hasWarranty;

  // Only admin can change status directly; dealer edits return to review.
  if (isAdmin && typeof body.status === "string") {
    if (VALID_STATUSES.includes(body.status as CarStatus)) {
      updates.status = body.status as CarStatus;
    }
  } else if (!isAdmin && (car.status === "APPROVED" || car.status === "REJECTED")) {
    updates.status = "PENDING_APPROVAL" as CarStatus;
  }

  try {
    if (Array.isArray(body.images)) {
      const urls: string[] = body.images;
      await prisma.carImage.deleteMany({ where: { carId: id } });
      if (urls.length > 0) {
        await prisma.carImage.createMany({
          data: urls.map((url, idx) => ({
            carId: id,
            url,
            order: idx,
            isPrimary: idx === 0,
          })),
        });
      }
    }

    const updated = await prisma.car.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, car: updated });
  } catch (e) {
    console.error("[cars PATCH]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בעדכון" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const car = await prisma.car.findUnique({
    where: { id },
    include: { dealer: { select: { userId: true } } },
  });
  if (!car) {
    return NextResponse.json({ error: "הרכב לא נמצא" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && car.dealer.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  try {
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[cars DELETE]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה במחיקה" },
      { status: 500 }
    );
  }
}
