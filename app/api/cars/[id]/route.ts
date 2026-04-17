import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single car by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        dealer: { select: { businessName: true, contactName: true, phone: true, city: true } },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "רכב לא נמצא" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: "שגיאה" }, { status: 500 });
  }
}

// PATCH — update car (dealer owner or admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const car = await prisma.car.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון" }, { status: 500 });
  }
}

// DELETE — archive car
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.car.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "שגיאה במחיקה" }, { status: 500 });
  }
}
