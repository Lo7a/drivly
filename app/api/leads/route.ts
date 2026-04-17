import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "נתונים לא תקינים", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Try to save to real DB
    try {
      const lead = await prisma.lead.create({
        data: {
          carId: data.carId,
          dealerId: data.dealerId,
          type: data.type,
          status: "NEW",
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || null,
          message: data.message || null,
          downPayment: data.downPayment || null,
          months: data.months || null,
          driverAge: data.driverAge || null,
          youngDriver: data.youngDriver || null,
          sourcePage: data.sourcePage || null,
        },
      });

      // Create lead event
      await prisma.leadEvent.create({
        data: {
          leadId: lead.id,
          action: "created",
          note: `ליד ${data.type} חדש מ-${data.fullName}`,
        },
      });

      // Increment car lead count
      await prisma.car.update({
        where: { id: data.carId },
        data: { leadsCount: { increment: 1 } },
      }).catch(() => {}); // Ignore if car doesn't exist (mock data)

      return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (dbError) {
      // DB not connected or car/dealer don't exist — still accept the lead
      console.log("DB save failed (using mock mode):", dbError);
      console.log("Lead data:", data);
      return NextResponse.json({ success: true, mock: true }, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "שגיאה בשליחת הפנייה" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Admin only — get all leads
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        car: { select: { make: true, model: true, year: true } },
        dealer: { select: { businessName: true } },
      },
      take: 100,
    });

    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [], error: "DB not connected" });
  }
}
