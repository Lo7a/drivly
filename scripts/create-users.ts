import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createUsers() {
  console.log("Creating users...\n");

  // 1. Admin user
  const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
    email: "admin@drivly.co.il",
    password: "admin123",
    email_confirm: true,
  });

  if (adminError) {
    console.log("Admin error:", adminError.message);
  } else {
    console.log("✅ Admin created:", admin.user.email, "| ID:", admin.user.id);
  }

  // 2. Dealer user
  const { data: dealer, error: dealerError } = await supabase.auth.admin.createUser({
    email: "socher@drivly.co.il",
    password: "socher123",
    email_confirm: true,
  });

  if (dealerError) {
    console.log("Dealer error:", dealerError.message);
  } else {
    console.log("✅ Dealer created:", dealer.user.email, "| ID:", dealer.user.id);
  }

  console.log("\n--- Login credentials ---");
  console.log("Admin:  admin@drivly.co.il / admin123");
  console.log("Dealer: socher@drivly.co.il / socher123");

  // TODO: Also create User + Dealer records in Prisma DB
  // This requires the Prisma client with adapter which needs special setup for scripts
  // For now, the proxy.ts will need to create these on first login
}

createUsers().catch(console.error);
