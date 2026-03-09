import Link from "next/link";
import type { Metadata } from "next";
import {
  Warehouse,
  Sun,
  Thermometer,
  Crown,
  Search,
  GitCompareArrows,
  Phone,
  ArrowRight,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { SearchBar } from "@/components/search-bar";
import { FacilityCard } from "@/components/facility-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { organizationJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "AutoVault | The World's Premier Luxury Vehicle Storage Directory",
  },
  description:
    "Find and compare luxury, exotic, and collector car storage facilities worldwide. Climate-controlled, concierge-level storage for Ferrari, Lamborghini, Porsche, and high-end vehicles.",
  alternates: { canonical: "https://autovault.network" },
  openGraph: {
    title: "AutoVault | The World's Premier Luxury Vehicle Storage Directory",
    description:
      "The global directory for luxury, exotic, and collector car storage. Climate-controlled, concierge-level facilities worldwide.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoVault | Luxury Vehicle Storage Directory",
    description:
      "The global directory for luxury, exotic, and collector car storage. Climate-controlled, concierge-level facilities worldwide.",
  },
};

const STORAGE_TYPES = [
  {
    label: "Climate Controlled",
    value: "CLIMATE_CONTROLLED",
    icon: Thermometer,
    description: "Temperature and humidity regulated for paint, leather, and electronics",
  },
  {
    label: "Enclosed",
    value: "ENCLOSED",
    icon: Warehouse,
    description: "Private, fully enclosed bays for individual vehicle protection",
  },
  {
    label: "Concierge",
    value: "CONCIERGE",
    icon: Crown,
    description: "White-glove service with detailing, maintenance, and transport",
  },
  {
    label: "Indoor",
    value: "INDOOR",
    icon: Sun,
    description: "Secure indoor parking in professionally managed facilities",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Search,
    title: "Search",
    description:
      "Enter your city or zip code to find car storage facilities near you. Filter by storage type, vehicle type, and amenities.",
  },
  {
    step: 2,
    icon: GitCompareArrows,
    title: "Compare",
    description:
      "Compare pricing, amenities, photos, and reviews side by side. See exactly what each facility offers before you decide.",
  },
  {
    step: 3,
    icon: Phone,
    title: "Contact",
    description:
      "Reach out directly to your top choices. Send inquiries, schedule visits, or reserve your spot online.",
  },
];

export default async function HomePage() {
  const [popularCities, featuredFacilities] = await Promise.all([
    prisma.city.findMany({
      where: { facilityCount: { gt: 0 } },
      orderBy: { facilityCount: "desc" },
      take: 12,
    }),
    prisma.facility.findMany({
      where: {
        OR: [
          { tier: "PREMIUM" },
          { tier: "VERIFIED", amenities: { hasSome: ["CONCIERGE", "DETAILING"] } },
        ],
        vehicleTypes: { hasSome: ["EXOTIC", "CLASSIC"] },
      },
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
      take: 6,
    }),
  ]);

  const orgJsonLd = organizationJsonLd();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AutoVault",
    url: "https://autovault.network",
    description: "The global directory for luxury, exotic, and collector car storage. Find climate-controlled, concierge-level facilities for high-end vehicles worldwide.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://autovault.network/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger -- static server-generated SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* eslint-disable-next-line react/no-danger -- static server-generated SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ── Hero Section ── */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.01_85)_0%,oklch(0.08_0_0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.20_0.03_85)_0%,transparent_50%)] opacity-40" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary">
              The World&apos;s Premier Luxury Vehicle Storage Directory
            </p>
            <h1 className="font-serif text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Premium Storage for{" "}
              <span className="text-primary">Extraordinary Vehicles</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/60">
              The global directory for luxury, exotic, and collector car storage.
              Find climate-controlled, concierge-level facilities for your
              Ferrari, Lamborghini, Porsche, and other high-end vehicles.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <SearchBar />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground/40 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <span className="flex items-center gap-2">
              <Crown className="size-3.5 text-primary" />
              Luxury &amp; Exotic Specialists
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-2">
              <Star className="size-3.5" />
              Verified Reviews
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" />
              Worldwide Directory
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="size-5 text-primary/40 animate-scroll-hint" />
        </div>
      </section>

      {/* ── Browse by Storage Type ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Browse by Storage Type
          </h2>
          <p className="mt-4 text-muted-foreground">
            Purpose-built storage solutions for high-value vehicles
          </p>
        </AnimateOnScroll>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STORAGE_TYPES.map((type, i) => (
            <AnimateOnScroll key={type.value} delay={i * 100}>
              <Link
                href={`/search?storageType=${type.value}`}
                className="group relative flex flex-col items-center rounded-xl bg-card p-8 text-center ring-1 ring-border transition-all duration-300 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <type.icon className="size-7" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {type.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {type.description}
                </p>
                <ArrowRight className="mt-4 size-4 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ── Popular Cities ── */}
      {popularCities.length > 0 && (
        <section className="bg-card py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll className="text-center">
              <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Top Markets
              </h2>
              <p className="mt-4 text-muted-foreground">
                Luxury vehicle storage in premier markets
              </p>
            </AnimateOnScroll>
            <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {popularCities.map((city, i) => (
                <AnimateOnScroll key={city.id} delay={i * 50}>
                  <Link
                    href={`/${city.stateSlug}/${city.slug}`}
                    className="group flex flex-col items-center rounded-lg bg-muted p-4 text-center ring-1 ring-border transition-all duration-300 hover:ring-primary/20"
                  >
                    <MapPin className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="mt-2 font-medium text-sm text-foreground">
                      {city.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {city.state}
                    </span>
                    <span className="mt-1 text-xs font-medium text-primary">
                      {city.facilityCount}{" "}
                      {city.facilityCount === 1 ? "facility" : "facilities"}
                    </span>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/search">
                <Button variant="outline" size="lg" className="px-8">
                  View All Locations
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Facilities ── */}
      {featuredFacilities.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <AnimateOnScroll className="text-center">
            <div className="mx-auto mb-6 h-px w-12 bg-primary" />
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Featured Luxury Facilities
            </h2>
            <p className="mt-4 text-muted-foreground">
              Top-rated storage for exotic, classic, and collector vehicles
            </p>
          </AnimateOnScroll>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFacilities.map((facility, i) => (
              <AnimateOnScroll key={facility.id} delay={i * 100}>
                <FacilityCard facility={facility} />
              </AnimateOnScroll>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/search?tier=PREMIUM">
              <Button variant="outline" size="lg" className="px-8">
                View All Premium Facilities
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="text-center">
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Finding the right luxury storage is easy with AutoVault
            </p>
          </AnimateOnScroll>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <AnimateOnScroll key={item.step} delay={i * 150} className="relative text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted text-foreground ring-1 ring-border">
                  <item.icon className="size-7" />
                </div>
                <div className="absolute -top-2 left-1/2 ml-8 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Facility Owners CTA ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-2xl bg-card px-8 py-20 text-center ring-1 ring-border sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.20_0.02_85)_0%,transparent_70%)] opacity-50" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Own a Luxury Storage Facility?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                List your facility on AutoVault and reach collectors, enthusiasts,
                and high-net-worth vehicle owners worldwide. Get verified status,
                premium placement, and lead management tools.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/claim">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                  >
                    List Your Facility for Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
