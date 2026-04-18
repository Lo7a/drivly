import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/getUser";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      dealerId: user.dealer?.id || null,
      dealerStatus: user.dealer?.status || null,
    },
  });
}
