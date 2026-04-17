// ─── Admin Contact ──────────────────────────────────────
export const ADMIN_PHONE = "050-0000000"; // TODO: Update with real phone
export const SITE_NAME = "Drivly";

// ─── Fuel Price ─────────────────────────────────────────
export const DEFAULT_FUEL_PRICE_PER_LITER = 7.5; // שקלים לליטר
export const DEFAULT_MONTHLY_KM = 1500;

// ─── Regions ────────────────────────────────────────────
export const REGIONS = {
  NORTH: "צפון",
  HAIFA: "חיפה והקריות",
  CENTER: "מרכז",
  TEL_AVIV: "תל אביב",
  JERUSALEM: "ירושלים",
  SOUTH: "דרום",
  JUDEA_SAMARIA: "יהודה ושומרון",
} as const;

// ─── Category Tags ──────────────────────────────────────
export const CATEGORY_TAGS = [
  { value: "students", label: "סטודנטים", description: "רכבים קטנים וחסכוניים" },
  { value: "families", label: "משפחות +1", description: "רכבים משפחתיים" },
  { value: "large-families", label: "משפחות גדולות", description: "7 מקומות ומעלה" },
  { value: "economical", label: "חסכוני", description: "צריכת דלק נמוכה" },
  { value: "luxury", label: "יוקרה", description: "רכבי פרימיום" },
  { value: "offroad", label: "שטח", description: "ג'יפים ורכבי שטח" },
] as const;

// ─── Fuel Types ─────────────────────────────────────────
export const FUEL_TYPES = {
  PETROL: "בנזין",
  DIESEL: "דיזל",
  HYBRID: "היברידי",
  ELECTRIC: "חשמלי",
  LPG: "גז",
} as const;

// ─── Transmission ───────────────────────────────────────
export const TRANSMISSION_TYPES = {
  AUTOMATIC: "אוטומט",
  MANUAL: "ידני",
} as const;

// ─── Car Status ─────────────────────────────────────────
export const CAR_STATUS_LABELS = {
  DRAFT: "טיוטה",
  PENDING_APPROVAL: "ממתין לאישור",
  APPROVED: "מאושר",
  REJECTED: "נדחה",
  SOLD: "נמכר",
  ARCHIVED: "בארכיון",
} as const;

// ─── Lead Type ──────────────────────────────────────────
export const LEAD_TYPE_LABELS = {
  CALL: "התקשרות",
  FINANCE: "מימון",
  INSURANCE: "ביטוח",
} as const;

// ─── Lead Status ────────────────────────────────────────
export const LEAD_STATUS_LABELS = {
  NEW: "חדש",
  IN_PROGRESS: "בטיפול",
  CLOSED: "סגור",
} as const;

// ─── Dealer Status ──────────────────────────────────────
export const DEALER_STATUS_LABELS = {
  PENDING: "ממתין לאישור",
  APPROVED: "מאושר",
  BLOCKED: "חסום",
} as const;

// ─── Car Makes & Models (Israeli Market) ────────────────
export const CAR_MAKES = [
  {
    value: "toyota",
    label: "טויוטה",
    models: ["קורולה", "יאריס", "קאמרי", "RAV4", "C-HR", "היילנדר", "לנד קרוזר"],
  },
  {
    value: "hyundai",
    label: "יונדאי",
    models: ["i10", "i20", "i30", "טוסון", "קונה", "סנטה פה", "איוניק"],
  },
  {
    value: "kia",
    label: "קיה",
    models: ["פיקנטו", "ריו", "סיד", "ספורטג'", "ניירו", "סורנטו", "EV6"],
  },
  {
    value: "mazda",
    label: "מאזדה",
    models: ["2", "3", "6", "CX-3", "CX-5", "CX-30", "CX-60", "MX-5"],
  },
  {
    value: "skoda",
    label: "סקודה",
    models: ["פאביה", "אוקטביה", "סופרב", "קארוק", "קודיאק", "קאמיק"],
  },
  {
    value: "volkswagen",
    label: "פולקסווגן",
    models: ["פולו", "גולף", "טיגואן", "טי-רוק", "פאסאט", "ID.3", "ID.4"],
  },
  {
    value: "bmw",
    label: "ב.מ.וו",
    models: ["סדרה 1", "סדרה 2", "סדרה 3", "סדרה 5", "X1", "X3", "X5", "iX"],
  },
  {
    value: "mercedes",
    label: "מרצדס",
    models: ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE", "EQA", "EQC"],
  },
  {
    value: "audi",
    label: "אאודי",
    models: ["A1", "A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
  },
  {
    value: "honda",
    label: "הונדה",
    models: ["ג'אז", "סיוויק", "HR-V", "CR-V"],
  },
  {
    value: "nissan",
    label: "ניסאן",
    models: ["מיקרה", "ג'וק", "קשקאי", "X-Trail", "ליף"],
  },
  {
    value: "suzuki",
    label: "סוזוקי",
    models: ["סוויפט", "באלנו", "ויטרה", "ג'ימני", "S-Cross"],
  },
  {
    value: "mitsubishi",
    label: "מיצובישי",
    models: ["ספייס סטאר", "אאוטלנדר", "אקליפס קרוס", "L200"],
  },
  {
    value: "seat",
    label: "סיאט",
    models: ["איביזה", "לאון", "ארונה", "אטקה", "טראקו"],
  },
  {
    value: "renault",
    label: "רנו",
    models: ["קליאו", "מגאן", "קפצ'ור", "קדג'אר"],
  },
  {
    value: "peugeot",
    label: "פיג'ו",
    models: ["208", "308", "2008", "3008", "5008"],
  },
  {
    value: "citroen",
    label: "סיטרואן",
    models: ["C3", "C4", "C3 Aircross", "C5 Aircross", "Berlingo"],
  },
  {
    value: "tesla",
    label: "טסלה",
    models: ["Model 3", "Model Y", "Model S", "Model X"],
  },
  {
    value: "byd",
    label: "BYD",
    models: ["ATTO 3", "Dolphin", "Seal", "Tang", "Han"],
  },
  {
    value: "geely",
    label: "ג'ילי",
    models: ["Geometry C", "Emgrand", "Coolray", "Atlas"],
  },
  {
    value: "other",
    label: "אחר",
    models: [],
  },
] as const;

// ─── Hand Options ───────────────────────────────────────
export const HAND_OPTIONS = [
  { value: 1, label: "יד ראשונה" },
  { value: 2, label: "יד שנייה" },
  { value: 3, label: "יד שלישית" },
  { value: 4, label: "יד רביעית+" },
] as const;

// ─── Year Range ─────────────────────────────────────────
export const MIN_YEAR = 2005;
export const MAX_YEAR = new Date().getFullYear() + 1;
