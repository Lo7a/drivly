import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

/** Keep only ASCII letters/digits/hyphens in a slug segment. */
function asciiSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[֐-׿]/g, "") // strip Hebrew block
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  const cars = await prisma.car.findMany({
    select: { id: true, slug: true, make: true, model: true, year: true },
  });

  let fixed = 0;
  for (const car of cars) {
    // Detect non-ASCII in slug
    if (/^[\x20-\x7E]*$/.test(car.slug)) continue;

    const parts = car.slug.split("-");
    // Last part looks like a random 6-char suffix — keep it if present
    const rand = /^[a-z0-9]{4,8}$/.test(parts[parts.length - 1])
      ? parts[parts.length - 1]
      : Math.random().toString(36).substring(2, 8);

    // Rebuild: first segment (make) is already ASCII ("hyundai", "toyota"...)
    // so we only need to fix the model segment.
    const makePart = parts[0];
    const modelClean = asciiSlug(car.model);
    const newSlug = modelClean
      ? `${makePart}-${modelClean}-${car.year}-${rand}`
      : `${makePart}-${car.year}-${rand}`;

    console.log(`  ${car.slug}  →  ${newSlug}`);
    await prisma.car.update({
      where: { id: car.id },
      data: { slug: newSlug },
    });
    fixed++;
  }

  console.log(`\n✅ Fixed ${fixed} slugs (${cars.length - fixed} were already clean)`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
