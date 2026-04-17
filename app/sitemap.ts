import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { MOCK_CARS } from "@/lib/mock-data";

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

  // Dynamic car pages
  let carPages: MetadataRoute.Sitemap = [];

  try {
    const cars = await prisma.car.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    });

    if (cars.length > 0) {
      carPages = cars.map((car) => ({
        url: `${baseUrl}/car/${car.slug}`,
        lastModified: car.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Fallback to mock data
    carPages = MOCK_CARS.map((car) => ({
      url: `${baseUrl}/car/${car.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  return [...staticPages, ...carPages];
}
