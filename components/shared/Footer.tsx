import { Logo } from "@/components/shared/Logo";
import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              מצאו את הרכב המושלם עבורכם.
              <br />
              השוואת מחירים, מימון וביטוח במקום אחד.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">ניווט מהיר</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  חיפוש רכבים
                </Link>
              </li>
            </ul>
          </div>

          {/* For Dealers */}
          <div>
            <h3 className="text-sm font-semibold mb-4">לסוחרים</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  כניסה למערכת
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  הרשמה כסוחר
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4">יצירת קשר</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                טלפון: 050-0000000
              </li>
              <li className="text-sm text-muted-foreground">
                info@drivly.co.il
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {SITE_NAME}. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
