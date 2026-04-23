import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding example leads...\n");

  const cars = await prisma.car.findMany({
    where: { status: "APPROVED" },
    include: { dealer: true },
    take: 10,
  });

  if (cars.length === 0) {
    console.error("❌ No approved cars found. Run seed-all first.");
    process.exit(1);
  }

  const samples = [
    {
      type: "CALL" as const,
      status: "NEW" as const,
      fullName: "דניאל כהן",
      phone: "052-5551234",
      email: "daniel.cohen@gmail.com",
      message: "מתעניין ברכב, אשמח לתיאום נסיעת מבחן ביום ה' אחה״צ.",
      minutesAgo: 12,
    },
    {
      type: "FINANCE" as const,
      status: "NEW" as const,
      fullName: "רינת לוי",
      phone: "054-2229988",
      email: "rinat.levi88@gmail.com",
      message: "יש לי מקדמה של 40 אלף. אפשר לקבל הצעה?",
      downPayment: 40000,
      months: 60,
      minutesAgo: 45,
    },
    {
      type: "INSURANCE" as const,
      status: "IN_PROGRESS" as const,
      fullName: "אבי מזרחי",
      phone: "050-7778899",
      message: "בן 28, נהג שני בבית. מה מחיר הביטוח המשוער?",
      driverAge: 28,
      youngDriver: true,
      minutesAgo: 120,
    },
    {
      type: "CALL" as const,
      status: "IN_PROGRESS" as const,
      fullName: "מיכל פרידמן",
      phone: "058-1234567",
      email: "michal.f@walla.co.il",
      minutesAgo: 240,
    },
    {
      type: "FINANCE" as const,
      status: "CLOSED" as const,
      fullName: "יוסי אדרי",
      phone: "053-9876543",
      message: "סגרתי עם הסוחר. תודה!",
      downPayment: 25000,
      months: 48,
      minutesAgo: 60 * 24,
    },
    {
      type: "CALL" as const,
      status: "NEW" as const,
      fullName: "טלי בן-דוד",
      phone: "050-4447711",
      email: "tali.bd@icloud.com",
      message: "האם הרכב עבר טסט שנתי? כמה ידיים?",
      minutesAgo: 8,
    },
    {
      type: "INSURANCE" as const,
      status: "NEW" as const,
      fullName: "עומר שטרן",
      phone: "054-1122334",
      driverAge: 35,
      youngDriver: false,
      minutesAgo: 30,
    },
    {
      type: "FINANCE" as const,
      status: "NEW" as const,
      fullName: "שני אלבז",
      phone: "052-5556677",
      email: "shani.albaz@gmail.com",
      message: "אין לי היום מקדמה. אפשר 100% מימון?",
      downPayment: 0,
      months: 72,
      minutesAgo: 3,
    },
  ];

  let created = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const car = cars[i % cars.length];
    const createdAt = new Date(Date.now() - s.minutesAgo * 60 * 1000);

    const lead = await prisma.lead.create({
      data: {
        carId: car.id,
        dealerId: car.dealerId,
        type: s.type,
        status: s.status,
        fullName: s.fullName,
        phone: s.phone,
        email: s.email,
        message: s.message,
        downPayment: s.downPayment ?? null,
        months: s.months ?? null,
        driverAge: s.driverAge ?? null,
        youngDriver: s.youngDriver ?? null,
        sourcePage: "car_page",
        createdAt,
        updatedAt: createdAt,
      },
    });

    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        action: "created",
        note: `ליד ${s.type} חדש מ-${s.fullName}`,
        createdAt,
      },
    });

    // Bump the car's leadsCount
    await prisma.car.update({
      where: { id: car.id },
      data: { leadsCount: { increment: 1 } },
    });

    created++;
    console.log(`  ✓ ${s.fullName} → ${car.make} ${car.model} (${s.type}, ${s.status})`);
  }

  console.log(`\n✅ Created ${created} example leads`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
