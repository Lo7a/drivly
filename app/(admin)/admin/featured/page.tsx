import { prisma } from "@/lib/prisma";
import { FeaturedManager } from "@/components/admin/FeaturedManager";

export const dynamic = "force-dynamic";

async function getInitialData() {
  const [dealers, featured] = await Promise.all([
    prisma.dealer.findMany({
      where: { status: "APPROVED" },
      orderBy: { businessName: "asc" },
      select: {
        id: true,
        businessName: true,
        cars: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            images: {
              orderBy: { order: "asc" },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    }),
    prisma.car.findMany({
      where: { isFeatured: true },
      orderBy: [{ featuredOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        dealer: { select: { id: true, businessName: true } },
      },
    }),
  ]);

  return { dealers, featured };
}

export default async function AdminFeaturedPage() {
  const { dealers, featured } = await getInitialData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">רכבים מומלצים</h1>
        <p className="text-sm text-muted-foreground mt-1">
          בחרו רכבים להצגה בדף הבית וקבעו את הסדר שלהם בגרירה
        </p>
      </div>

      <FeaturedManager
        dealers={dealers.map((d) => ({
          id: d.id,
          businessName: d.businessName,
          carsCount: d.cars.length,
          cars: d.cars.map((c) => ({
            id: c.id,
            make: c.make,
            model: c.model,
            year: c.year,
            price: c.price,
            imageUrl: c.images[0]?.url ?? null,
          })),
        }))}
        initialFeatured={featured.map((c) => ({
          id: c.id,
          make: c.make,
          model: c.model,
          year: c.year,
          price: c.price,
          imageUrl: c.images[0]?.url ?? null,
          dealerName: c.dealer.businessName,
        }))}
      />
    </div>
  );
}
