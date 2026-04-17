import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 30 },
    md: { width: 160, height: 40 },
    lg: { width: 200, height: 50 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href="/" className="block hover:opacity-80 transition-opacity">
      <Image
        src="/logo.svg"
        alt="Drivly - רכבים למכירה"
        width={width}
        height={height}
        priority
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        alt="Drivly - רכבים למכירה"
        width={width}
        height={height}
        priority
        className="hidden dark:block"
      />
    </Link>
  );
}
