import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/getUser";
import { CarForm, type CarFormData } from "@/components/shared/CarForm";
import { CAR_MAKES } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

function findMakeSlug(label: string): string {
  return CAR_MAKES.find((m) => m.label === label)?.value || "";
}

export default async function AdminEditCarPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    notFound();
  }

  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      dealer: { select: { businessName: true, id: true } },
    },
  });

  if (!car) {
    notFound();
  }

  const initial: Partial<CarFormData> = {
    makeSlug: findMakeSlug(car.make),
    model: car.model,
    year: String(car.year),
    price: String(car.price),
    originalPrice: car.originalPrice ? String(car.originalPrice) : "",
    km: String(car.km),
    hand: String(car.hand),
    fuelType: car.fuelType,
    transmission: car.transmission,
    engineSize: car.engineSize ? String(car.engineSize) : "",
    color: car.color || "",
    region: car.region || "",
    city: car.city || "",
    annualFee: car.annualFee ? String(car.annualFee) : "",
    description: car.description || "",
    hasFinancing: car.hasFinancing,
    hasTradeIn: car.hasTradeIn,
    hasWarranty: car.hasWarranty,
    images: car.images.map((i) => i.url),
  };

  return (
    <CarForm
      mode="edit"
      carId={id}
      initial={initial}
      isAdmin
      initialStatus={car.status}
      dealerId={car.dealer.id}
      heading={`עריכה (אדמין): ${car.make} ${car.model} ${car.year}`}
      redirectTo="/admin/cars"
    />
  );
}
