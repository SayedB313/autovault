import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { US_STATES } from "@/lib/geo";
import { generateCityMeta, cityJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { FacilityCard } from "@/components/facility-card";
import { SearchBar } from "@/components/search-bar";

export const revalidate = 3600;

export async function generateStaticParams() {
  const cities = await prisma.city.findMany({
    select: { slug: true, stateSlug: true },
  });
  return cities.map((c) => ({ state: c.stateSlug, city: c.slug }));
}

interface CityPageProps {
  params: Promise<{ state: string; city: string }>;
}

async function getCityData(stateSlug: string, citySlug: string) {
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug);
  if (!stateInfo) return null;

  const city = await prisma.city.findFirst({
    where: {
      slug: citySlug,
      stateSlug: stateInfo.slug,
    },
  });

  if (!city) return null;

  const facilities = await prisma.facility.findMany({
    where: {
      city: { equals: city.name, mode: "insensitive" },
      state: { equals: stateInfo.abbreviation, mode: "insensitive" },
    },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
  });

  const nearbyCities = await prisma.city.findMany({
    where: {
      stateSlug: stateInfo.slug,
      slug: { not: citySlug },
    },
    select: {
      name: true,
      slug: true,
      stateSlug: true,
      facilityCount: true,
    },
    take: 8,
    orderBy: { facilityCount: "desc" },
  });

  return { city, stateInfo, facilities, nearbyCities };
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const data = await getCityData(stateSlug, citySlug);
  if (!data) return { title: "City Not Found | AutoVault" };

  return generateCityMeta(
    data.city.name,
    data.stateInfo.abbreviation,
    data.facilities.length,
    data.city.slug,
    data.stateInfo.slug
  );
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function CityPage({ params }: CityPageProps) {
  const { state: stateSlug, city: citySlug } = await params;
  const data = await getCityData(stateSlug, citySlug);

  if (!data) notFound();

  const { city, stateInfo, facilities, nearbyCities } = data;

  const minPrice = facilities.reduce((min, f) => {
    if (f.priceRangeMin !== null && (min === null || f.priceRangeMin < min))
      return f.priceRangeMin;
    return min;
  }, null as number | null);

  const storageTypeSet = new Set<string>();
  facilities.forEach((f) =>
    f.storageTypes.forEach((t) => storageTypeSet.add(t))
  );
  const storageTypeLabels: Record<string, string> = {
    INDOOR: "indoor",
    OUTDOOR: "outdoor",
    COVERED: "covered",
    CLIMATE_CONTROLLED: "climate-controlled",
    ENCLOSED: "enclosed",
  };
  const storageDescriptions = Array.from(storageTypeSet)
    .map((t) => storageTypeLabels[t] || t.toLowerCase())
    .join(", ");

  const jsonLd = cityJsonLd(
    `${city.name}, ${stateInfo.abbreviation}`,
    facilities.map((f) => ({
      name: f.name,
      slug: f.slug,
      avgRating: f.avgRating,
      reviewCount: f.reviewCount,
    }))
  );

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: stateInfo.name, url: `https://autovault.network/${stateInfo.slug}` },
    { name: city.name },
  ]);

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={breadcrumbs} />

        {/* Breadcrumbs */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <Link
                href={`/${stateInfo.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {stateInfo.name}
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-foreground">{city.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MapPin className="size-5" />
              <span className="text-sm">
                {city.name}, {stateInfo.name}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Car Storage in {city.name}, {stateInfo.abbreviation}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Find {facilities.length} car storage{" "}
              {facilities.length === 1 ? "facility" : "facilities"} in{" "}
              {city.name}, {stateInfo.name}.{" "}
              {storageDescriptions
                ? `Compare ${storageDescriptions} storage options`
                : "Compare storage options"}
              {minPrice !== null
                ? ` starting from $${minPrice.toFixed(0)}/month.`
                : "."}
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {facilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <MapPin className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                No facilities found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                We don&apos;t have any car storage facilities listed in{" "}
                {city.name} yet. Try searching nearby cities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </div>

        {/* SEO Content Block */}
        <div className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4 text-sm text-muted-foreground leading-relaxed">
              <h2 className="font-serif text-xl font-light text-foreground">
                Car Storage in {city.name}, {stateInfo.name}
              </h2>
              <p>
                AutoVault lists {facilities.length} car storage{" "}
                {facilities.length === 1 ? "facility" : "facilities"} in{" "}
                {city.name}, {stateInfo.name}. Whether you need short-term
                parking or long-term vehicle storage, our directory helps you
                find and compare the best options in your area.
              </p>
              {storageDescriptions && (
                <p>
                  Available storage types in {city.name} include{" "}
                  {storageDescriptions}. Each facility offers different amenities
                  and pricing, so we recommend comparing multiple options to find
                  the best fit for your vehicle.
                </p>
              )}
              <p>
                All listings include contact information, pricing details,
                photos, and reviews from other car owners. Use our search and
                filter tools to narrow down facilities by storage type, vehicle
                type, amenities, and price range.
              </p>
            </div>
          </div>
        </div>

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-light mb-6 text-foreground">
                More Luxury Car Storage in {stateInfo.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nearbyCities.map((nc) => (
                  <Link
                    key={nc.slug}
                    href={`/${nc.stateSlug}/${nc.slug}`}
                    className="block p-4 bg-card rounded-lg ring-1 ring-border hover:ring-primary/30 transition-all"
                  >
                    <p className="font-medium text-foreground">{nc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {nc.facilityCount} {nc.facilityCount !== 1 ? "facilities" : "facility"}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
    </>
  );
}
