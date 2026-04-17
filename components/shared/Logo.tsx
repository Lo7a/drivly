import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "auto";
}

export function Logo({ size = "md", variant = "auto" }: LogoProps) {
  const config = {
    sm: { mark: "h-7 w-7 text-xs", text: "text-lg" },
    md: { mark: "h-8 w-8 text-sm", text: "text-xl" },
    lg: { mark: "h-10 w-10 text-base", text: "text-2xl" },
  };

  const { mark, text } = config[size];
  const textColor = variant === "light" ? "text-white" : "text-foreground";

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 hover:opacity-90 transition-opacity"
    >
      <div
        className={`${mark} flex items-center justify-center rounded-lg bg-primary font-black text-primary-foreground tracking-tighter transition-transform group-hover:scale-105`}
      >
        D
      </div>
      <span className={`${text} font-bold tracking-tight`}>
        <span className={textColor}>Driv</span>
        <span className="text-primary">ly</span>
      </span>
    </Link>
  );
}
