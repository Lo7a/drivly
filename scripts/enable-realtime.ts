import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function enableRealtime() {
  const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
  const prisma = new PrismaClient({ adapter });

  const tables = ["leads", "cars", "dealers"];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER PUBLICATION supabase_realtime ADD TABLE public.${table};`
      );
      console.log(`✅ Realtime enabled on ${table}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already member")) {
        console.log(`⏭️  ${table} already has realtime`);
      } else {
        console.log(`⚠️  ${table}: ${msg}`);
      }
    }
  }

  await prisma.$disconnect();
}

enableRealtime().catch(console.error);
