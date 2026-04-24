import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🔧 Adding is_featured + featured_order columns to cars...");

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "cars"
    ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT false;
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "cars"
    ADD COLUMN IF NOT EXISTS "featured_order" INTEGER;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "cars_is_featured_featured_order_idx"
    ON "cars" ("is_featured", "featured_order");
  `);

  console.log("✅ Columns + index ready");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
