import { z } from "zod";

// ─── Lead Form ──────────────────────────────────────────

export const leadFormSchema = z.object({
  carId: z.string().uuid(),
  dealerId: z.string().uuid(),
  type: z.enum(["CALL", "FINANCE", "INSURANCE"]),
  fullName: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  phone: z
    .string()
    .min(9, "מספר טלפון לא תקין")
    .max(15, "מספר טלפון לא תקין")
    .regex(/^[\d\-+() ]+$/, "מספר טלפון לא תקין"),
  email: z.string().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  message: z.string().max(1000, "ההודעה ארוכה מדי").optional(),
  // Finance fields
  downPayment: z.number().min(0).optional(),
  months: z.number().min(12).max(84).optional(),
  // Insurance fields
  driverAge: z.number().min(16).max(99).optional(),
  youngDriver: z.boolean().optional(),
  // Source
  sourcePage: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

// ─── Car Form ───────────────────────────────────────────

export const carFormSchema = z.object({
  make: z.string().min(1, "יש לבחור יצרן"),
  model: z.string().min(1, "יש לבחור דגם"),
  subModel: z.string().optional(),
  year: z
    .number()
    .min(2005, "שנה לא תקינה")
    .max(new Date().getFullYear() + 1, "שנה לא תקינה"),
  price: z.number().min(1000, "מחיר חייב להיות לפחות ₪1,000"),
  originalPrice: z.number().min(0).optional(),
  km: z.number().min(0, "קילומטראז' לא תקין"),
  hand: z.number().min(1).max(10),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG"]),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  engineSize: z.number().min(0).optional(),
  horsepower: z.number().min(0).optional(),
  color: z.string().optional(),
  doors: z.number().min(2).max(5).optional(),
  seats: z.number().min(2).max(9).optional(),
  testDate: z.string().optional(),
  ownership: z.string().optional(),
  city: z.string().optional(),
  region: z
    .enum([
      "NORTH",
      "HAIFA",
      "CENTER",
      "TEL_AVIV",
      "JERUSALEM",
      "SOUTH",
      "JUDEA_SAMARIA",
    ])
    .optional(),
  description: z.string().max(5000, "התיאור ארוך מדי").optional(),
  categoryTag: z.string().optional(),
  fuelConsumption: z.number().min(0).optional(),
  reliability: z.number().min(1).max(10).optional(),
  hasFinancing: z.boolean().default(false),
  hasTradeIn: z.boolean().default(false),
  hasWarranty: z.boolean().default(false),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

// ─── Dealer Registration ────────────────────────────────

export const dealerRegisterSchema = z.object({
  businessName: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים"),
  contactName: z.string().min(2, "שם איש קשר חייב להכיל לפחות 2 תווים"),
  phone: z
    .string()
    .min(9, "מספר טלפון לא תקין")
    .regex(/^[\d\-+() ]+$/, "מספר טלפון לא תקין"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  city: z.string().optional(),
  region: z
    .enum([
      "NORTH",
      "HAIFA",
      "CENTER",
      "TEL_AVIV",
      "JERUSALEM",
      "SOUTH",
      "JUDEA_SAMARIA",
    ])
    .optional(),
});

export type DealerRegisterValues = z.infer<typeof dealerRegisterSchema>;

// ─── Login ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "יש להזין סיסמה"),
});

export type LoginValues = z.infer<typeof loginSchema>;

// ─── Search Params ──────────────────────────────────────

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  minKm: z.coerce.number().optional(),
  maxKm: z.coerce.number().optional(),
  region: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  hand: z.coerce.number().optional(),
  category: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().default(1),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
