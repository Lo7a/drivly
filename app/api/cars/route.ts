import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_CARS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Try Prisma first, fall back to mock data
  try {
    const where: Record<string, unknown> = { status: "APPROVED" };

    const q = searchParams.get("q");
    if (q) {
      where.OR = [
        { make: { contains: q, mode: "insensitive" } },
        { model: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const category = searchParams.get("category");
    if (category) where.categoryTag = category;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = Number(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = Number(maxPrice);
    }

    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) (where.year as Record<string, number>).gte = Number(minYear);
      if (maxYear) (where.year as Record<string, number>).lte = Number(maxYear);
    }

    const maxKm = searchParams.get("maxKm");
    if (maxKm) where.km = { lte: Number(maxKm) };

    const region = searchParams.get("region");
    if (region) where.region = region;

    const fuelType = searchParams.get("fuelType");
    if (fuelType) where.fuelType = fuelType;

    const transmission = searchParams.get("transmission");
    if (transmission) where.transmission = transmission;

    const hand = searchParams.get("hand");
    if (hand) where.hand = { lte: Number(hand) };

    // Sort
    const sort = searchParams.get("sort");
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price-asc": orderBy = { price: "asc" }; break;
      case "price-desc": orderBy = { price: "desc" }; break;
      case "year-desc": orderBy = { year: "desc" }; break;
      case "km-asc": orderBy = { km: "asc" }; break;
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        dealer: { select: { businessName: true, city: true } },
      },
      take: 50,
    });

    if (cars.length > 0) {
      return NextResponse.json({
        cars: cars.map((car) => ({
          ...car,
          imageUrl: car.images[0]?.url || null,
          dealerName: car.dealer.businessName,
          dealerCity: car.dealer.city,
        })),
        total: cars.length,
        source: "db",
      });
    }
  } catch (e) {
    console.log("Prisma query failed, falling back to mock:", e);
  }

  // Fallback to mock data
  let cars = [...MOCK_CARS];

  const q = searchParams.get("q");
  if (q) {
    const query = q.toLowerCase();
    cars = cars.filter(
      (car) =>
        car.make.includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.city?.includes(query)
    );
  }

  const category = searchParams.get("category");
  if (category) cars = cars.filter((car) => car.categoryTag === category);

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice) cars = cars.filter((car) => car.price >= Number(minPrice));
  if (maxPrice) cars = cars.filter((car) => car.price <= Number(maxPrice));

  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  if (minYear) cars = cars.filter((car) => car.year >= Number(minYear));
  if (maxYear) cars = cars.filter((car) => car.year <= Number(maxYear));

  const region = searchParams.get("region");
  if (region) cars = cars.filter((car) => car.region === region);

  const fuelType = searchParams.get("fuelType");
  if (fuelType) cars = cars.filter((car) => car.fuelType === fuelType);

  const sort = searchParams.get("sort");
  switch (sort) {
    case "price-asc": cars.sort((a, b) => a.price - b.price); break;
    case "price-desc": cars.sort((a, b) => b.price - a.price); break;
    case "year-desc": cars.sort((a, b) => b.year - a.year); break;
    case "km-asc": cars.sort((a, b) => a.km - b.km); break;
    default: cars.sort((a, b) => b.viewsCount - a.viewsCount);
  }

  return NextResponse.json({ cars, total: cars.length, source: "mock" });
}
