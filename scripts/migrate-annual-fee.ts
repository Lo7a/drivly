import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🔧 Adding annual_fee column to cars...");

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "cars"
    ADD COLUMN IF NOT EXISTS "annual_fee" INTEGER;
  `);

  console.log("✅ annual_fee column ready");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
