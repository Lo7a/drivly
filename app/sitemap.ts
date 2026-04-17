import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // TODO: Add dynamic car pages once DB is connected
  // const cars = await prisma.car.findMany({
  //   where: { status: "APPROVED" },
  //   select: { slug: true, updatedAt: true },
  // });
  // const carPages = cars.map((car) => ({
  //   url: `${baseUrl}/car/${car.slug}`,
  //   lastModified: car.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));

  return [...staticPages];
}
