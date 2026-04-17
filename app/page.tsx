import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center gap-8">
      <Logo size="lg" />
      <p className="text-xl text-muted-foreground max-w-md">
        בקרוב - מערכת חיפוש רכבים חכמה עם מחשבון מימון, הערכת ביטוח ועלות חודשית אמיתית
      </p>
      <ThemeToggle />
    </main>
  );
}
