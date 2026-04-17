/**
 * Format a number as Israeli Shekel currency
 * ₪ always AFTER the number: 115,000₪
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("he-IL", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted}₪`;
}

/**
 * Format a number with commas (Hebrew locale)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("he-IL").format(num);
}

/**
 * Format km display
 */
export function formatKm(km: number): string {
  if (km >= 1000) {
    return `${formatNumber(km)} ק"מ`;
  }
  return `${km} ק"מ`;
}

/**
 * Format a date in Hebrew locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Format relative time in Hebrew
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "היום";
  if (diffDays === 1) return "אתמול";
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
  if (diffDays < 365) return `לפני ${Math.floor(diffDays / 30)} חודשים`;
  return formatDate(d);
}

/**
 * Generate a URL slug from car details
 */
export function generateCarSlug(
  make: string,
  model: string,
  year: number,
  shortId: string
): string {
  const slug = `${make}-${model}-${year}-${shortId}`
    .replace(/\s+/g, "-")
    .replace(/[^\u0590-\u05FFa-zA-Z0-9-]/g, "")
    .toLowerCase();
  return slug;
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
