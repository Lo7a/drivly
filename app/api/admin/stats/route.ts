import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [carsCount, dealersCount, leadsCount, newLeadsCount, financeLeads, insuranceLeads] =
      await Promise.all([
        prisma.car.count({ where: { status: "APPROVED" } }),
        prisma.dealer.count({ where: { status: "APPROVED" } }),
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.lead.count({ where: { type: "FINANCE" } }),
        prisma.lead.count({ where: { type: "INSURANCE" } }),
      ]);

    return NextResponse.json({
      carsCount,
      dealersCount,
      leadsCount,
      newLeadsCount,
      financeLeads,
      insuranceLeads,
    });
  } catch {
    return NextResponse.json({
      carsCount: 0,
      dealersCount: 0,
      leadsCount: 0,
      newLeadsCount: 0,
      financeLeads: 0,
      insuranceLeads: 0,
      error: "DB not connected",
    });
  }
}
