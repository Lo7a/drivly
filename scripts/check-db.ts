import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function check() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();
  const dealers = await prisma.dealer.findMany();
  const cars = await prisma.car.findMany();

  console.log(`Users: ${users.length}`);
  users.forEach((u) => console.log(`  - ${u.email} (${u.role})`));

  console.log(`\nDealers: ${dealers.length}`);
  dealers.forEach((d) => console.log(`  - ${d.businessName} (${d.status})`));

  console.log(`\nCars: ${cars.length}`);

  await prisma.$disconnect();
}

check().catch(console.error);
