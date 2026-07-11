# Viarnex Mall — Frontend Scaffold

Next.js 14 (App Router) + TypeScript + Tailwind starter, structured around
the three portals from the MVP spec.

## Structure

```
src/
  app/
    (customer)/home, products, cart, dashboard   — buyer-facing routes
    (supplier)/portal/products, orders, wallet... — supplier portal routes
    (admin)/dashboard/suppliers, products, ...    — admin control panel
    page.tsx                                      — public landing page
    layout.tsx, globals.css                       — root shell, fonts, tokens
  components/
    ui/       — low-level primitives (buttons, inputs — add shadcn/ui here)
    layout/   — headers, nav, portal shells
    product/  — product cards, variant pickers, pricing displays
    shared/   — cross-portal pieces (RouteLine signature, badges)
  lib/
    pricing.ts  — currency/revenue engine (Yuan -> Naira, never expose Yuan)
    utils.ts    — cn() class helper
  types/
    index.ts  — shared domain types: Product, Supplier, Order, Wallet, etc.
```

The `(customer)`, `(supplier)`, `(admin)` folders are Next.js route groups —
each can get its own layout.tsx later (different nav/shell) without
affecting the URL path.

## Design tokens

Palette, type, and the "route-line" signature (factory → Skyjet warehouse →
doorstep) are defined in `tailwind.config.ts` and `globals.css`. Reuse
`<RouteLine />` and the ink/jade/amber palette across the supplier and admin
portals so it reads as one product, not three separate apps.

## Stack

- **Frontend/hosting**: Next.js on Cloudflare Pages
- **Database + Auth**: Supabase (Postgres, RLS-based role security)
- **Media storage/CDN**: Bunny.net (product images, video, 360s)

No VPS, no separate backend framework — Supabase's client libraries and
Row Level Security cover most of the API surface. Reach for Supabase Edge
Functions only for real server-side logic (pricing calculation, wallet
updates, quotation state changes).

## Getting started

1. Create a Supabase project, then run `supabase/migrations/0001_init.sql`
   in the SQL editor (or `supabase db push` if using the CLI). This sets
   up every table plus RLS policies for customer/supplier/admin access.
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL/anon
   key (Project Settings -> API) and Bunny.net storage details.
3. Install and run:

```bash
npm install
npm run dev
```

Supabase clients live in `src/lib/supabase/client.ts` (browser, "use
client" components) and `src/lib/supabase/server.ts` (Server Components,
Route Handlers).

## Auth

Email/password auth via Supabase, with `/signup` (role toggle: buyer or
supplier) and `/login`. After running `0001_init.sql`, also run
`supabase/migrations/0002_auth_trigger.sql` — it auto-creates a
`profiles` row (and a `suppliers` row if the role is supplier) the
moment someone signs up, reading the role out of the signup metadata.

`src/middleware.ts` keeps the Supabase session refreshed on every
request — required for server components to see an up-to-date auth
state. `/dashboard` (the "Mine" tab) is the first protected route;
it redirects to `/login` if there's no session.

Supabase's email confirmation is on by default for new projects — if
you want to test signup without clicking a confirmation email every
time, turn it off in Supabase dashboard → Authentication → Providers →
Email → "Confirm email".

## What's stubbed vs. real

- **Real**: landing page, design tokens, currency/pricing calculation
  (`lib/pricing.ts`), full domain type model (`types/index.ts`), route
  structure for all three portals, Supabase schema + RLS
  (`supabase/migrations/`), product listing page (`/products`) and
  product detail page (`/products/[id]`) wired to live Supabase data,
  auth (`/signup`, `/login`, `/dashboard`), responsive layout for
  mobile and desktop.
- **Stubbed (folders only, no pages yet)**: cart/checkout, supplier
  product upload + wallet, admin verification queue.
- **Not started**: chat system + contact-info filtering, quotations UI,
  search, notifications, Bunny.net upload wiring.

## Seeing real products locally

`/products` reads from the live `products` table and will show an empty
state until something's in it. `supabase/seed.sql` has a demo supplier +
product you can run manually (it requires creating one Supabase Auth user
first — instructions are in the file's comments) to see a populated grid
and a working product detail page.

## Suggested build order

1. Auth (customer/supplier/admin login, JWT + role-based routing)
2. ~~Product listing + detail page~~ — done, see `/products`
3. Cart/checkout (multi-supplier split into `FulfillmentOrder`s)
4. Supplier portal: product upload, order list, wallet balances
5. Admin: supplier verification queue, product approval queue
