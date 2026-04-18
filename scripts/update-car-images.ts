import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const IMAGE_MAP: Record<string, string> = {
  "toyota-corolla-2023-abc": "/cars/toyota-corolla.webp",
  "hyundai-tucson-2022-def": "/cars/hyundai-tucson.webp",
  "mazda-cx5-2023-ghi": "/cars/mazda-cx5.webp",
  "skoda-octavia-2024-jkl": "/cars/skoda-octavia.webp",
  "kia-picanto-2023-mno": "/cars/kia-picanto.webp",
  "bmw-x3-2022-pqr": "/cars/bmw-x3.webp",
  "suzuki-vitara-2023-stu": "/cars/suzuki-vitara.webp",
  "tesla-model3-2023-vwx": "/cars/tesla-model3.webp",
  "toyota-yaris-2022-yza": "/cars/toyota-yaris.webp",
  "mitsubishi-outlander-2023-bcd": "/cars/mitsubishi-outlander.webp",
};

async function updateImages() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🖼️  Updating car images...\n");

  for (const [slug, imageUrl] of Object.entries(IMAGE_MAP)) {
    const car = await prisma.car.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!car) {
      console.log(`⏭️  ${slug} not found`);
      continue;
    }

    // Delete old images
    await prisma.carImage.deleteMany({ where: { carId: car.id } });

    // Add new image
    await prisma.carImage.create({
      data: {
        carId: car.id,
        url: imageUrl,
        order: 0,
        isPrimary: true,
      },
    });

    console.log(`✅ ${car.make} ${car.model} → ${imageUrl}`);
  }

  await prisma.$disconnect();
}

updateImages().catch(console.error);
