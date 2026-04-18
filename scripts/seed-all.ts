import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { MOCK_CARS } from "../lib/mock-data";

dotenv.config({ path: ".env.local" });

async function seedAll() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding all data...\n");

  // 1. Admin user
  const admin = await prisma.user.upsert({
    where: { authId: "7450d0fe-5095-42dd-bbfd-3444c601467a" },
    update: {},
    create: {
      authId: "7450d0fe-5095-42dd-bbfd-3444c601467a",
      email: "admin@drivly.co.il",
      fullName: "אדמין Drivly",
      phone: "050-0000000",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // 2. Dealer user + profile
  const dealerUser = await prisma.user.upsert({
    where: { authId: "93c07a5a-49cc-49cc-a89a-4df854a1337f" },
    update: {},
    create: {
      authId: "93c07a5a-49cc-49cc-a89a-4df854a1337f",
      email: "socher@drivly.co.il",
      fullName: "סוחר לדוגמה",
      phone: "050-1234567",
      role: "DEALER",
    },
  });
  console.log(`✅ Dealer user: ${dealerUser.email}`);

  const dealer = await prisma.dealer.upsert({
    where: { userId: dealerUser.id },
    update: {},
    create: {
      userId: dealerUser.id,
      businessName: "אוטו פלוס תל אביב",
      contactName: "סוחר לדוגמה",
      phone: "050-1234567",
      city: "תל אביב",
      region: "CENTER",
      status: "APPROVED",
    },
  });
  console.log(`✅ Dealer profile: ${dealer.businessName}`);

  // 3. Cars
  console.log("\n🚗 Seeding cars...");
  for (const car of MOCK_CARS) {
    const existing = await prisma.car.findUnique({ where: { slug: car.slug } });
    if (existing) {
      console.log(`   ⏭️  ${car.make} ${car.model} (exists)`);
      continue;
    }

    await prisma.car.create({
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
    console.log(`   ✅ ${car.make} ${car.model} ${car.year}`);
  }

  const [userCount, dealerCount, carCount] = await Promise.all([
    prisma.user.count(),
    prisma.dealer.count(),
    prisma.car.count(),
  ]);

  console.log(`\n🎉 Final state:`);
  console.log(`   Users: ${userCount}`);
  console.log(`   Dealers: ${dealerCount}`);
  console.log(`   Cars: ${carCount}`);

  await prisma.$disconnect();
}

seedAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
