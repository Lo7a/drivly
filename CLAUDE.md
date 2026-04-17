# YARIN - Car Marketplace MVP

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Supabase (PostgreSQL + Auth + Storage) + Prisma ORM
- shadcn/ui + Tailwind CSS v4 + Lucide icons
- next-themes (Light + Dark mode)
- react-hook-form + Zod
- pnpm

## Project Rules

### Language & RTL
- Hebrew only. ALL text, buttons, labels, placeholders, error messages in Hebrew
- Root layout: `<html lang="he" dir="rtl">`
- Use Tailwind logical properties (ms-, me-, ps-, pe-) instead of ml-, mr-, pl-, pr-
- Icons in buttons: place icon AFTER text in JSX → renders on LEFT in RTL
- Dialog/Sheet close button: use `left-2` not `right-2`
- Directional arrows need `rtl:rotate-180`

### Responsive
- Mobile-first: design for 375px first, then tablet (768px), then desktop (1280px+)
- Every page and component must be fully responsive
- Use Tailwind responsive prefixes: default → sm: → md: → lg: → xl:

### Architecture
- Route groups: (public) = SSR/SEO, (auth) = login/register, (dealer) = protected, (admin) = protected
- Public pages = Server Components (SSR for SEO)
- Protected pages = can use client components
- All leads go to admin only - dealers see only statistics

### Database
- Use Prisma for all DB operations
- UUID primary keys
- Run `pnpm db:generate` after schema changes
- Run `pnpm db:migrate` for migrations

### SEO
- Every public page needs `generateMetadata`
- JSON-LD structured data on car pages
- `<h1>` once per page, logical heading hierarchy
- Semantic HTML: main, article, nav, header, footer, section
- All images need Hebrew alt text

### Auth
- Supabase Auth with email/password
- Middleware protects /dealer/* and /admin/* routes
- User roles: ADMIN, DEALER (no customer auth)

### Roles
- Admin (אדמין): Sees everything, manages leads, approves dealers/cars
- Dealer (סוחר): Uploads cars, sees stats only, NO lead details
- Customer (לקוח): No login, browses freely, submits leads

### Commands
```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to DB
pnpm db:studio    # Open Prisma Studio
```
