import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import type { LeadStatus } from "@prisma/client";

const VALID_STATUSES: LeadStatus[] = ["NEW", "IN_PROGRESS", "CLOSED"];

async function loadLeadWithOwner(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: { dealer: { select: { userId: true } } },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      car: { select: { id: true, slug: true, make: true, model: true, year: true } },
      dealer: { select: { id: true, userId: true, businessName: true } },
      events: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!lead) {
    return NextResponse.json({ error: "הליד לא נמצא" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && lead.dealer.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  return NextResponse.json({ lead });
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

  const existing = await loadLeadWithOwner(id);
  if (!existing) {
    return NextResponse.json({ error: "הליד לא נמצא" }, { status: 404 });
  }

  const isAdmin = user.role === "ADMIN";
  if (!isAdmin && existing.dealer.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  const updates: { status?: LeadStatus } = {};

  if (typeof body.status === "string" && VALID_STATUSES.includes(body.status as LeadStatus)) {
    updates.status = body.status as LeadStatus;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "לא נשלחו שדות לעדכון" }, { status: 400 });
  }

  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: updates,
    });

    // Audit trail
    if (updates.status && updates.status !== existing.status) {
      await prisma.leadEvent.create({
        data: {
          leadId: id,
          action: "status_changed",
          note: `${existing.status} → ${updates.status} (ע״י ${isAdmin ? "אדמין" : "סוחר"})`,
        },
      });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (e) {
    console.error("[leads PATCH]", e);
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
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
  }

  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[leads DELETE]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה במחיקה" },
      { status: 500 }
    );
  }
}
