# AutoVault — Car Storage Directory Platform

## Project Overview
AutoVault is a car storage directory platform at **https://autovault.network**.
Directory-first go-to-market with premium listing monetization.

**Strategy:** Build the Zillow of car storage. Monetize like Yelp. Upsell like Shopify.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL 16 on OP3 Hetzner server
- **ORM:** Prisma 7 (uses PrismaPg adapter, NOT standard PrismaClient constructor)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth.js v5 (Auth.js) — Google OAuth + Resend email magic link
- **Payments:** Stripe (subscriptions for Verified $49/mo, Premium $149/mo)
- **Deployment:** Coolify (Docker) on OP3 Hetzner via Cloudflare CDN
- **Domain:** autovault.network (Cloudflare DNS, proxied)

## Infrastructure
- **Coolify App UUID:** g4cwoc4oo8owsc4wgsgccww8
- **Deploy:** Push to `main` then trigger via Coolify API: `POST /api/v1/deploy?uuid=g4cwoc4oo8owsc4wgsgccww8`
- **Container DB:** `postgresql://coolify_apps:coolify_apps_op3_2026@10.0.1.1:5432/autovault_db`
- **Local dev DB:** Requires SSH tunnel: `ssh -L 5433:localhost:5432 openclaw@100.76.178.67`
- **GitHub:** https://github.com/SayedB313/autovault (public)

## Key Patterns
- **Prisma 7:** Uses `PrismaPg` adapter in seed scripts — `new PrismaPg({ connectionString })`
- **NextAuth v5:** Requires `AUTH_TRUST_HOST=true` env var when behind Cloudflare/Traefik proxy
- **City slugs:** Include state abbreviation — `los-angeles-ca`, `miami-fl`, `new-york-ny`
- **State slugs:** Kebab-case — `california`, `new-york`, `north-carolina`
- **Coolify API:** Deploy endpoint is `/api/v1/deploy?uuid=APP_UUID` (NOT `/applications/UUID/deploy`)
- **Coolify domain field:** Use `domains` (not `fqdn`) in PATCH requests

## Data
- 2,048 facilities seeded via Google Places API
- 3,758 facility photos
- 50 cities with facility counts
- 11 blog posts (SEO content)
- 2,146 URLs in sitemap

## Project Structure
```
src/
  app/
    page.tsx                    # Homepage
    search/page.tsx             # Search with filters, sort, pagination
    facility/[slug]/page.tsx    # Facility detail with photos, reviews, contact
    [state]/page.tsx            # State landing page
    [state]/[city]/page.tsx     # City landing page
    blog/page.tsx               # Blog listing
    blog/[slug]/page.tsx        # Blog post
    luxury-car-storage/         # SEO landing pages
    exotic-car-storage/
    classic-car-storage/
    auth/signin/                # Sign in (Suspense-wrapped)
    dashboard/                  # Owner dashboard, billing, facility editing
    admin/                      # Admin panel (facilities, users, stats)
    claim/[facilityId]/         # Claim listing flow
    api/
      auth/[...nextauth]/       # Auth routes
      search/                   # Search API
      leads/                    # Lead submission
      facilities/[id]/          # Facility CRUD
      checkout/                 # Stripe checkout session
      billing/portal/           # Stripe billing portal
      webhooks/stripe/          # Stripe webhook handler
    sitemap.xml/route.ts        # Dynamic sitemap
    robots.txt/route.ts         # Robots.txt
  components/
    ui/                         # shadcn components
    header.tsx                  # Auth-aware header (useSession)
    footer.tsx                  # Footer with city/legal links
    search-bar.tsx              # Search input with autocomplete
    facility-card.tsx           # Facility card component
    contact-form.tsx            # Reusable contact form
    providers.tsx               # SessionProvider wrapper
  lib/
    db.ts                       # Prisma client singleton
    auth.ts                     # NextAuth config
    stripe.ts                   # Stripe client + plan definitions
    seo.ts                      # JSON-LD generators
prisma/
  schema.prisma                 # Full schema (User, Facility, Review, Lead, City, etc.)
  seed.ts                       # Google Places facility seeder
  seed-cities.ts                # City seeder
  seed-blog.ts                  # Blog post seeder
  blog-posts/                   # Blog content JSON files
```

## Environment Variables (Production)
**Set:** DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_PLACES_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_URL, STRIPE_SECRET_KEY, NODE_ENV, AUTH_TRUST_HOST

**Missing (need to add):**
- GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (Google OAuth)
- RESEND_API_KEY (email magic links)
- STRIPE_WEBHOOK_SECRET (webhook verification)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (frontend checkout)
- Cloudflare R2 vars (image uploads — future)

## Development Principles
- Ship fast, validate with real facilities before over-building
- SEO-first architecture — every page must be crawlable and indexable
- City-level pages from day 1 (programmatic SEO)
- Mobile-first responsive design
- No over-engineering — directory MVP before any software features
