import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-[#050816] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_70%_20%,_hsl(192_80%_40%_/_0.12),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_20%_80%,_hsl(220_60%_50%_/_0.08),_transparent_60%)]" />
      </div>

      {/* Simple top bar */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground text-sm">
            D
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Driv</span>
            <span className="text-primary">ly</span>
          </span>
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
