import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { MOCK_CARS } from "../lib/mock-data";

dotenv.config({ path: ".env.local" });

async function seedCars() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding cars...\n");

  // Get the dealer (socher)
  const dealer = await prisma.dealer.findFirst({
    where: { status: "APPROVED" },
  });

  if (!dealer) {
    console.error("No approved dealer found! Run create-users.ts first.");
    return;
  }

  console.log(`Using dealer: ${dealer.businessName}\n`);

  for (const car of MOCK_CARS) {
    try {
      const existing = await prisma.car.findUnique({ where: { slug: car.slug } });
      if (existing) {
        console.log(`⏭️  Skipped ${car.make} ${car.model} (exists)`);
        continue;
      }

      const created = await prisma.car.create({
        data: {
          slug: car.slug,
          dealerId: dealer.id,
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          originalPrice: car.originalPrice,
          km: car.km,
          hand: car.hand,
          fuelType: car.fuelType,
          transmission: car.transmission,
          engineSize: car.engineSize || null,
          horsepower: car.horsepower || null,
          color: car.color,
          doors: car.doors,
          seats: car.seats,
          region: car.region,
          fuelConsumption: car.fuelConsumption || null,
          reliability: car.reliability || null,
          description: car.description,
          hasFinancing: car.hasFinancing,
          hasTradeIn: car.hasTradeIn,
          hasWarranty: car.hasWarranty,
          categoryTag: car.categoryTag,
          status: "APPROVED",
          viewsCount: car.viewsCount,
          leadsCount: car.leadsCount,
          images: {
            create: {
              url: car.images[0] || "/hero-bg.png",
              order: 0,
              isPrimary: true,
            },
          },
        },
      });

      console.log(`✅ ${created.make} ${created.model} ${created.year}`);
    } catch (e) {
      console.error(`❌ Failed for ${car.make} ${car.model}:`, e instanceof Error ? e.message : e);
    }
  }

  const total = await prisma.car.count();
  console.log(`\n🎉 Done! Total cars in DB: ${total}`);

  await prisma.$disconnect();
}

seedCars().catch(console.error);
