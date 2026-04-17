import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Get user from our DB
  try {
    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      include: { dealer: true },
    });
    return user;
  } catch {
    return null;
  }
}
