import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🔧 Updating existing PENDING dealers to APPROVED...");
  const bumped = await prisma.dealer.updateMany({
    where: { status: "PENDING" },
    data: { status: "APPROVED" },
  });
  console.log(`✅ Promoted ${bumped.count} pending dealers to approved`);

  console.log("🔧 Updating column default for future inserts...");
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "dealers"
    ALTER COLUMN "status" SET DEFAULT 'APPROVED';
  `);
  console.log("✅ Default set to APPROVED");

  const [approved, blocked, stillPending] = await Promise.all([
    prisma.dealer.count({ where: { status: "APPROVED" } }),
    prisma.dealer.count({ where: { status: "BLOCKED" } }),
    prisma.dealer.count({ where: { status: "PENDING" } }),
  ]);
  console.log(`\n📊 Dealer totals — APPROVED: ${approved}, BLOCKED: ${blocked}, PENDING: ${stillPending}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
