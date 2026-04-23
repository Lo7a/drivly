import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type RecentNotification =
  | {
      kind: "lead";
      id: string;
      fullName: string;
      phone: string;
      leadType: "CALL" | "FINANCE" | "INSURANCE";
      carLabel: string;
      createdAt: string;
    }
  | {
      kind: "car";
      id: string;
      carLabel: string;
      dealerName: string;
      createdAt: string;
    }
  | {
      kind: "dealer";
      id: string;
      businessName: string;
      contactName: string;
      phone: string;
      createdAt: string;
    };

export async function GET() {
  const LIMIT = 5;
  try {
    const [newLeads, pendingCars, pendingDealers] = await Promise.all([
      prisma.lead.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
        include: { car: { select: { make: true, model: true, year: true } } },
      }),
      prisma.car.findMany({
        where: { status: "PENDING_APPROVAL" },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
        include: { dealer: { select: { businessName: true } } },
      }),
      prisma.dealer.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
      }),
    ]);

    const items: RecentNotification[] = [
      ...newLeads.map<RecentNotification>((l) => ({
        kind: "lead",
        id: l.id,
        fullName: l.fullName,
        phone: l.phone,
        leadType: l.type,
        carLabel: `${l.car.make} ${l.car.model} ${l.car.year}`,
        createdAt: l.createdAt.toISOString(),
      })),
      ...pendingCars.map<RecentNotification>((c) => ({
        kind: "car",
        id: c.id,
        carLabel: `${c.make} ${c.model} ${c.year}`,
        dealerName: c.dealer.businessName,
        createdAt: c.createdAt.toISOString(),
      })),
      ...pendingDealers.map<RecentNotification>((d) => ({
        kind: "dealer",
        id: d.id,
        businessName: d.businessName,
        contactName: d.contactName,
        phone: d.phone,
        createdAt: d.createdAt.toISOString(),
      })),
    ];

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total =
      (await prisma.lead.count({ where: { status: "NEW" } })) +
      (await prisma.car.count({ where: { status: "PENDING_APPROVAL" } })) +
      (await prisma.dealer.count({ where: { status: "PENDING" } }));

    return NextResponse.json({ items: items.slice(0, LIMIT), total });
  } catch (e) {
    console.error("[notifications/recent]", e);
    return NextResponse.json({ items: [], total: 0 });
  }
}
