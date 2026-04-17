import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className="group flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      {/* Minimal geometric mark */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
        <span className="text-sm font-black text-primary-foreground tracking-tighter">
          D
        </span>
      </div>
      <span className={`${textSizes[size]} font-bold tracking-tight`}>
        <span className="text-primary">Driv</span>
        <span className="text-foreground">ly</span>
      </span>
    </Link>
  );
}
