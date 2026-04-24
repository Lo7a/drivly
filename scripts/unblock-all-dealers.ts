import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  const before = await prisma.dealer.findMany({
    select: { businessName: true, status: true },
  });
  console.log("Before:");
  before.forEach((d) => console.log(`  - ${d.businessName}: ${d.status}`));

  const result = await prisma.dealer.updateMany({
    where: { status: { not: "APPROVED" } },
    data: { status: "APPROVED" },
  });

  console.log(`\n✅ Approved ${result.count} dealers`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
