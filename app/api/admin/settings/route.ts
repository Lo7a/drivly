import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";

async function ensureAdmin() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

async function getOrCreate() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 1 },
    });
  }
  return settings;
}

export async function GET() {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }
  const settings = await getOrCreate();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const admin = await ensureAdmin();
  if (!admin) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  const updates: {
    siteName?: string;
    adminPhone?: string;
    adminEmail?: string | null;
    fuelPrice?: number;
  } = {};

  if (typeof body.siteName === "string" && body.siteName.trim()) {
    updates.siteName = body.siteName.trim();
  }
  if (typeof body.adminPhone === "string" && body.adminPhone.trim()) {
    updates.adminPhone = body.adminPhone.trim();
  }
  if ("adminEmail" in body) {
    updates.adminEmail = body.adminEmail?.trim() || null;
  }
  if (typeof body.fuelPrice === "number" && body.fuelPrice > 0) {
    updates.fuelPrice = body.fuelPrice;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "לא נשלחו שדות לעדכון" }, { status: 400 });
  }

  try {
    // Upsert on singleton id=1
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: updates,
      create: { id: 1, ...updates },
    });
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    console.error("[admin settings] update failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "שגיאה בשמירה" },
      { status: 500 }
    );
  }
}
