import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validators";

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

    // TODO: Save to DB with Prisma when connected
    // const lead = await prisma.lead.create({
    //   data: {
    //     ...parsed.data,
    //     status: "NEW",
    //   },
    // });
    // await prisma.leadEvent.create({
    //   data: { leadId: lead.id, action: "created" },
    // });
    // await prisma.car.update({
    //   where: { id: parsed.data.carId },
    //   data: { leadsCount: { increment: 1 } },
    // });

    console.log("New lead:", parsed.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "שגיאה בשליחת הפנייה" },
      { status: 500 }
    );
  }
}
