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
} from "lucide-react";
import { prisma } from "@/lib/db";
import { SearchBar } from "@/components/search-bar";
import { FacilityCard } from "@/components/facility-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AutoVault - Find Car Storage Near You | 2,000+ Facilities Nationwide",
  description:
    "Find and compare car storage facilities near you. Browse 2,000+ indoor, outdoor, climate-controlled, and luxury vehicle storage options across the US.",
  openGraph: {
    title: "AutoVault - Find Car Storage Near You",
    description:
      "Browse 2,000+ car storage facilities. Compare indoor, outdoor, climate-controlled, and luxury options.",
    siteName: "AutoVault",
    type: "website",
  },
};

const STORAGE_TYPES = [
  {
    label: "Indoor",
    value: "INDOOR",
    icon: Warehouse,
    description: "Protected from the elements in fully enclosed buildings",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    label: "Outdoor",
    value: "OUTDOOR",
    icon: Sun,
    description: "Affordable open-air parking with security",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    label: "Climate Controlled",
    value: "CLIMATE_CONTROLLED",
    icon: Thermometer,
    description: "Temperature and humidity regulated environments",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    label: "Luxury",
    value: "ENCLOSED",
    icon: Crown,
    description: "Premium storage for exotic and collector vehicles",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
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
      where: { tier: "PREMIUM" },
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { avgRating: "desc" },
      take: 6,
    }),
  ]);

  return (
    <>
      {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find Car Storage{" "}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Near You
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                Browse 2,000+ car storage facilities across the United States.
                Compare pricing, amenities, and reviews to find the perfect spot
                for your vehicle.
              </p>
              <div className="mt-10 flex justify-center">
                <SearchBar />
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  2,000+ Facilities
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4" />
                  Verified Reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <Search className="size-4" />
                  Free to Search
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Storage Type */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Browse by Storage Type
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the right type of storage for your vehicle
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STORAGE_TYPES.map((type) => (
              <Link
                key={type.value}
                href={`/search?storageType=${type.value}`}
                className={`group relative flex flex-col items-center rounded-xl border p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${type.color}`}
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-xl bg-white/80 shadow-sm ${type.iconColor}`}
                >
                  <type.icon className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{type.label}</h3>
                <p className="mt-2 text-sm opacity-80">{type.description}</p>
                <ArrowRight className="mt-4 size-5 opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Cities */}
        {popularCities.length > 0 && (
          <section className="bg-muted/50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Popular Cities
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Explore car storage options in top cities across the US
                </p>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {popularCities.map((city) => (
                  <Link
                    key={city.id}
                    href={`/${city.stateSlug}/${city.slug}`}
                    className="group flex flex-col items-center rounded-lg border bg-card p-4 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <MapPin className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/search">
                  <Button variant="outline" size="lg">
                    View All Locations
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Facilities */}
        {featuredFacilities.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Featured Facilities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Top-rated premium car storage facilities
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/search?tier=PREMIUM">
                <Button variant="outline" size="lg">
                  View All Premium Facilities
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-muted/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Finding the right car storage is easy with AutoVault
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <item.icon className="size-8" />
                  </div>
                  <div className="absolute -top-2 left-1/2 ml-8 flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Facility Owners CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Own a Car Storage Facility?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                List your facility on AutoVault for free and reach thousands of
                car owners looking for storage. Upgrade to get verified status,
                premium placement, and lead management tools.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/claim">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  >
                    List Your Facility for Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-primary-foreground hover:bg-white/10 px-8"
                  >
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          </div>
        </section>
    </>
  );
}
