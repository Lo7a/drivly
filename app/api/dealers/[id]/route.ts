import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — approve/block dealer (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!["APPROVED", "BLOCKED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
    }

    const dealer = await prisma.dealer.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(dealer);
  } catch {
    return NextResponse.json({ error: "שגיאה בעדכון" }, { status: 500 });
  }
}
