import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🔧 Creating site_settings table if not exists...");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id"          INTEGER PRIMARY KEY DEFAULT 1,
      "site_name"   TEXT NOT NULL DEFAULT 'Drivly',
      "admin_phone" TEXT NOT NULL DEFAULT '050-0000000',
      "admin_email" TEXT,
      "fuel_price"  DOUBLE PRECISION NOT NULL DEFAULT 7.5,
      "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure a singleton row exists
  await prisma.$executeRawUnsafe(`
    INSERT INTO "site_settings" ("id", "site_name", "admin_phone", "fuel_price", "updated_at")
    VALUES (1, 'Drivly', '050-0000000', 7.5, NOW())
    ON CONFLICT ("id") DO NOTHING;
  `);

  const rows = await prisma.$queryRawUnsafe<
    Array<{ id: number; site_name: string; admin_phone: string; fuel_price: number }>
  >(`SELECT id, site_name, admin_phone, fuel_price FROM site_settings;`);

  console.log("✅ site_settings ready:", rows[0]);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
