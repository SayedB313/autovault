import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { US_STATES } from "@/lib/geo";
import { generateStateMeta } from "@/lib/seo";

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({
  params,
}: StatePageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug);
  if (!stateInfo) return { title: "State Not Found | AutoVault" };

  const facilityCount = await prisma.facility.count({
    where: { state: { equals: stateInfo.abbreviation, mode: "insensitive" } },
  });

  const cityCount = await prisma.city.count({
    where: { stateSlug: stateInfo.slug },
  });

  return generateStateMeta(stateInfo.abbreviation, cityCount, facilityCount);
}

// Dynamic rendering — DB not available at build time
export const dynamic = "force-dynamic";

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateSlug } = await params;
  const stateInfo = US_STATES.find((s) => s.slug === stateSlug);

  if (!stateInfo) notFound();

  const cities = await prisma.city.findMany({
    where: { stateSlug: stateInfo.slug },
    orderBy: { facilityCount: "desc" },
  });

  const totalFacilities = cities.reduce((sum, c) => sum + c.facilityCount, 0);

  return (
    <>
      {/* Breadcrumbs */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-foreground">
                {stateInfo.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Car Storage in {stateInfo.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Browse {totalFacilities}{" "}
              {totalFacilities === 1
                ? "car storage facility"
                : "car storage facilities"}{" "}
              across {cities.length}{" "}
              {cities.length === 1 ? "city" : "cities"} in {stateInfo.name}.
              Compare indoor, outdoor, and climate-controlled storage options.
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {cities.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <MapPin className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                No facilities listed yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                We don&apos;t have any car storage facilities listed in{" "}
                {stateInfo.name} yet. Check back soon or try searching nearby
                states.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Search All Locations
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${stateInfo.slug}/${city.slug}`}
                  className="group flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-primary/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <div className="min-w-0">
                      <span className="block font-medium text-foreground truncate">
                        {city.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {city.facilityCount}{" "}
                        {city.facilityCount === 1 ? "facility" : "facilities"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
    </>
  );
}
