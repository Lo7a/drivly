import { NextResponse } from "next/server";
import { MOCK_CARS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let cars = [...MOCK_CARS];

  // Text search
  const q = searchParams.get("q");
  if (q) {
    const query = q.toLowerCase();
    cars = cars.filter(
      (car) =>
        car.make.includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.city?.includes(query) ||
        car.description?.includes(query)
    );
  }

  // Category
  const category = searchParams.get("category");
  if (category) {
    cars = cars.filter((car) => car.categoryTag === category);
  }

  // Price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice) cars = cars.filter((car) => car.price >= Number(minPrice));
  if (maxPrice) cars = cars.filter((car) => car.price <= Number(maxPrice));

  // Year range
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  if (minYear) cars = cars.filter((car) => car.year >= Number(minYear));
  if (maxYear) cars = cars.filter((car) => car.year <= Number(maxYear));

  // Km
  const maxKm = searchParams.get("maxKm");
  if (maxKm) cars = cars.filter((car) => car.km <= Number(maxKm));

  // Region
  const region = searchParams.get("region");
  if (region) cars = cars.filter((car) => car.region === region);

  // Fuel type
  const fuelType = searchParams.get("fuelType");
  if (fuelType) cars = cars.filter((car) => car.fuelType === fuelType);

  // Transmission
  const transmission = searchParams.get("transmission");
  if (transmission) cars = cars.filter((car) => car.transmission === transmission);

  // Hand
  const hand = searchParams.get("hand");
  if (hand) cars = cars.filter((car) => car.hand <= Number(hand));

  // Sort
  const sort = searchParams.get("sort");
  switch (sort) {
    case "price-asc":
      cars.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      cars.sort((a, b) => b.price - a.price);
      break;
    case "year-desc":
      cars.sort((a, b) => b.year - a.year);
      break;
    case "km-asc":
      cars.sort((a, b) => a.km - b.km);
      break;
    default:
      cars.sort((a, b) => b.viewsCount - a.viewsCount);
  }

  return NextResponse.json({
    cars,
    total: cars.length,
  });
}
