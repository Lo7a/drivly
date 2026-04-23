import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Region } from "@prisma/client";

async function getDealer() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: { dealer: true },
  });
  return user?.dealer ?? null;
}

export async function GET() {
  const dealer = await getDealer();
  if (!dealer) {
    return NextResponse.json({ error: "לא מחובר כסוחר" }, { status: 401 });
  }
  return NextResponse.json({
    dealer: {
      businessName: dealer.businessName,
      contactName: dealer.contactName,
      phone: dealer.phone,
      email: dealer.email,
      city: dealer.city,
      region: dealer.region,
      address: dealer.address,
      description: dealer.description,
    },
  });
}

const ALLOWED_REGIONS: Region[] = [
  "NORTH",
  "HAIFA",
  "CENTER",
  "TEL_AVIV",
  "JERUSALEM",
  "SOUTH",
  "JUDEA_SAMARIA",
];

export async function PATCH(request: Request) {
  const dealer = await getDealer();
  if (!dealer) {
    return NextResponse.json({ error: "לא מחובר כסוחר" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const updates: {
    businessName?: string;
    contactName?: string;
    phone?: string;
    email?: string | null;
    city?: string | null;
    region?: Region | null;
    address?: string | null;
    description?: string | null;
  } = {};

  if (typeof body.businessName === "string" && body.businessName.trim()) {
    updates.businessName = body.businessName.trim();
  }
  if (typeof body.contactName === "string" && body.contactName.trim()) {
    updates.contactName = body.contactName.trim();
  }
  if (typeof body.phone === "string" && body.phone.trim()) {
    updates.phone = body.phone.trim();
  }
  if ("email" in body) {
    updates.email = body.email?.trim() || null;
  }
  if ("city" in body) {
    updates.city = body.city?.trim() || null;
  }
  if ("region" in body) {
    updates.region = body.region && ALLOWED_REGIONS.includes(body.region) ? body.region : null;
  }
  if ("address" in body) {
    updates.address = body.address?.trim() || null;
  }
  if ("description" in body) {
    updates.description = body.description?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "לא נשלחו שדות לעדכון" }, { status: 400 });
  }

  try {
    const updated = await prisma.dealer.update({
      where: { id: dealer.id },
      data: updates,
    });
    return NextResponse.json({ success: true, dealer: updated });
  } catch (e) {
    console.error("[dealer settings] update failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בשמירה" },
      { status: 500 }
    );
  }
}
