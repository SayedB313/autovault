# AutoVault — Car Storage Directory Platform

## Project Overview
AutoVault is a car storage directory platform at **https://autovault.network**.
Directory-first go-to-market with premium listing monetization.

**Strategy:** Build the Zillow of car storage. Monetize like Yelp. Upsell like Shopify.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL 16 on OP3 Hetzner server
- **ORM:** Prisma 7 (uses PrismaPg adapter, NOT standard PrismaClient constructor)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Fonts:** Cormorant Garamond (serif headings) + DM Sans (body) via `next/font/google`
- **Auth:** NextAuth.js v5 (Auth.js) — Google OAuth + Resend email magic link
- **Payments:** Stripe (subscriptions for Verified $49/mo, Premium $149/mo)
- **Deployment:** Coolify (Docker) on OP3 Hetzner via Cloudflare CDN
- **Domain:** autovault.network (Cloudflare DNS, proxied)

## Design System (Luxury Dark Theme)
Dark-first aesthetic inspired by Bentley/Rolls Royce/Sotheby's. No light mode toggle.

### Color Palette (OKLCh in globals.css)
| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | `#0A0A0A` | `--background` |
| Card/Surface | `#141414` | `--card` |
| Elevated Surface | `#1A1A1A` | `--secondary` |
| Text (warm cream) | `#F5F0EB` | `--foreground` |
| Muted Text | `#9A9590` | `--muted-foreground` |
| Accent (champagne gold) | `#C4A35A` | `--primary` |
| Borders | `rgba(255,255,255,0.08)` | `--border` |

### Typography
- **Headings:** `font-serif` (Cormorant Garamond), typically `font-light` weight
- **Body:** `font-sans` (DM Sans)
- **Logo:** Serif uppercase with `tracking-[0.2em]`
- **Section labels:** Uppercase, `tracking-widest`, `text-primary`

### Key Design Patterns
- **Header:** Transparent on page load, `bg-background/95 backdrop-blur-md` on scroll
- **Hero sections:** Full viewport height with layered radial gradients (gold-tinted spotlight)
- **Cards:** `bg-card ring-1 ring-border` with `hover:ring-primary/30` gold hover
- **Search bar:** Glass-morphism (`bg-card/80 backdrop-blur-md`), gold focus ring
- **Tier badges:** PREMIUM = gold (`border-primary/30 bg-primary/10`), VERIFIED = platinum/silver
- **Decorative dividers:** Thin gold rule `h-px w-12 bg-primary` centered above headings
- **Scroll animations:** `AnimateOnScroll` component (Intersection Observer, zero deps)
- **Blog:** Branded as "The AutoVault Journal"
- **Prose:** Custom `.prose-luxury` class for dark-bg blog content

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
    ui/                         # shadcn components (button has gold variant, badge has gold/platinum)
    header.tsx                  # Scroll-aware transparent header with serif logo
    footer.tsx                  # Dark luxury footer with serif branding
    search-bar.tsx              # Glass-morphism search with gold focus
    facility-card.tsx           # Dark cards with gold hover ring, gradient photo overlay
    contact-form.tsx            # Contact form with gold success state
    tier-badge.tsx              # Gold (premium) / platinum (verified) tier badges
    animate-on-scroll.tsx       # Intersection Observer scroll-triggered fade-in-up
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
- Dark-first luxury aesthetic — no light/dark toggle, all pages use dark palette
- Serif headings (`font-serif font-light`) on every page for brand consistency
- Gold accent (`text-primary`, `bg-primary`) for CTAs, badges, and decorative elements
- Zero new animation dependencies — use `AnimateOnScroll` component with CSS transitions
