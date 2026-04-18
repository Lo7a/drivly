import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // If caller explicitly requested a destination, honor it
      if (explicitNext) {
        return NextResponse.redirect(`${origin}${explicitNext}`);
      }

      // Otherwise route by role
      try {
        const user = await prisma.user.findUnique({
          where: { authId: data.user.id },
          select: { role: true },
        });
        const dest =
          user?.role === "ADMIN" ? "/admin/dashboard" : "/dealer/dashboard";
        return NextResponse.redirect(`${origin}${dest}`);
      } catch {
        return NextResponse.redirect(`${origin}/dealer/dashboard`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
