import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ carId: string }> }
) {
  const { carId } = await params;

  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const car = await tx.car.findUnique({
        where: { id: carId },
        select: { isFeatured: true, featuredOrder: true },
      });
      if (!car || !car.isFeatured) return;

      const removedOrder = car.featuredOrder ?? 0;

      await tx.car.update({
        where: { id: carId },
        data: { isFeatured: false, featuredOrder: null },
      });

      // Close the gap — shift everyone above the removed slot down by 1.
      await tx.car.updateMany({
        where: { isFeatured: true, featuredOrder: { gt: removedOrder } },
        data: { featuredOrder: { decrement: 1 } },
      });
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin featured] remove failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בהסרה" },
      { status: 500 }
    );
  }
}
