import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [newLeads, pendingCars, pendingDealers] = await Promise.all([
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.car.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.dealer.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      total: newLeads + pendingCars + pendingDealers,
      newLeads,
      pendingCars,
      pendingDealers,
    });
  } catch {
    return NextResponse.json({ total: 0, newLeads: 0, pendingCars: 0, pendingDealers: 0 });
  }
}
