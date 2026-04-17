const SUPABASE_ERROR_MAP: Record<string, string> = {
  // Auth errors
  "Invalid login credentials": "אימייל או סיסמה שגויים",
  "Email not confirmed": "האימייל לא אומת. בדוק את תיבת הדואר שלך",
  "User already registered": "משתמש עם אימייל זה כבר קיים",
  "Password should be at least 6 characters": "הסיסמה חייבת להכיל לפחות 6 תווים",
  "Signup requires a valid password": "יש להזין סיסמה תקינה",
  "Unable to validate email address: invalid format": "כתובת האימייל אינה תקינה",
  "Email rate limit exceeded": "נשלחו יותר מדי בקשות. נסה שוב מאוחר יותר",
  "For security purposes, you can only request this after 60 seconds.":
    "מטעמי אבטחה, ניתן לנסות שוב רק אחרי 60 שניות",
  "New password should be different from the old password.":
    "הסיסמה החדשה חייבת להיות שונה מהסיסמה הקודמת",
  "Auth session missing!": "לא נמצא חיבור פעיל. יש להתחבר מחדש",
  "User not found": "משתמש לא נמצא",
  "Token has expired or is invalid": "הקישור פג תוקף. בקש קישור חדש",
  "Only an admin can delete a user": "אין הרשאה לבצע פעולה זו",

  // OAuth
  "Error getting user email from external provider":
    "לא ניתן לקבל את האימייל מ-Google. נסה שוב",

  // Network / General
  "Failed to fetch": "שגיאת תקשורת. בדוק את החיבור לאינטרנט",
  "NetworkError when attempting to fetch resource":
    "שגיאת רשת. בדוק את החיבור לאינטרנט",
  "fetch failed": "שגיאת תקשורת. נסה שוב",
};

export function translateError(error: string): string {
  // Exact match
  if (SUPABASE_ERROR_MAP[error]) {
    return SUPABASE_ERROR_MAP[error];
  }

  // Partial match
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAP)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Fallback
  return "אירעה שגיאה. נסה שנית.";
}
