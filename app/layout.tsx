import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - רכבים למכירה | מימון וביטוח`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "מצאו את הרכב המושלם עבורכם. השוואת מחירים, מחשבון מימון, הערכת ביטוח ועלות חודשית אמיתית. סוחרי רכב מאומתים בכל הארץ.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: SITE_NAME,
  },
  alternates: {
    languages: {
      "he-IL": "/",
    },
  },
  other: {
    "geo.region": "IL",
    "geo.placename": "ישראל",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            dir="rtl"
            toastOptions={{
              className: "font-sans",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
