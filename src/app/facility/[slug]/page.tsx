import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { generateFacilityMeta, facilityJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { resolveState } from "@/lib/geo";
import { TierBadge } from "@/components/tier-badge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContactFacilityForm } from "./contact-form";

interface FacilityPageProps {
  params: Promise<{ slug: string }>;
}

async function getFacility(slug: string) {
  const facility = await prisma.facility.findUnique({
    where: { slug },
    include: {
      photos: { orderBy: { order: "asc" } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return facility;
}

export async function generateMetadata({
  params,
}: FacilityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacility(slug);
  if (!facility) return { title: "Facility Not Found | AutoVault" };
  return generateFacilityMeta(facility);
}

// Dynamic rendering — DB not available at build time
export const revalidate = 1800;

const STORAGE_TYPE_LABELS: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  COVERED: "Covered",
  CLIMATE_CONTROLLED: "Climate Controlled",
  ENCLOSED: "Enclosed",
};

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CAR: "Car",
  MOTORCYCLE: "Motorcycle",
  RV: "RV",
  BOAT: "Boat",
  CLASSIC: "Classic",
  EXOTIC: "Exotic",
  TRUCK: "Truck",
  TRAILER: "Trailer",
};

const AMENITY_LABELS: Record<string, string> = {
  ACCESS_24HR: "24/7 Access",
  SECURITY_CAMERAS: "Security Cameras",
  GATED: "Gated",
  ALARM_SYSTEM: "Alarm System",
  FIRE_SUPPRESSION: "Fire Suppression",
  EV_CHARGING: "EV Charging",
  CONCIERGE: "Concierge",
  DETAILING: "Detailing",
  MAINTENANCE: "Maintenance",
  TRANSPORT: "Transport",
  INSURANCE: "Insurance",
  CLIMATE_MONITORING: "Climate Monitoring",
  WIFI: "Wi-Fi",
  LOUNGE: "Lounge",
  CAR_WASH: "Car Wash",
  BATTERY_TENDER: "Battery Tender",
};

const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  const serialized = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { slug } = await params;
  const facility = await getFacility(slug);

  if (!facility) notFound();

  const relatedFacilities = await prisma.facility.findMany({
    where: {
      city: facility.city,
      state: facility.state,
      id: { not: facility.id },
    },
    select: {
      name: true,
      slug: true,
      avgRating: true,
      reviewCount: true,
      photos: {
        select: { url: true, alt: true },
        take: 1,
        orderBy: { order: "asc" },
      },
    },
    take: 4,
    orderBy: { avgRating: "desc" },
  });

  const stateInfo = resolveState(facility.state);
  const stateSlug = stateInfo?.slug || facility.state.toLowerCase();
  const stateName = stateInfo?.name || facility.state;
  const citySlug = facility.city.toLowerCase().replace(/\s+/g, "-");

  const jsonLd = facilityJsonLd(facility);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: stateName, url: `https://autovault.network/${stateSlug}` },
    { name: facility.city, url: `https://autovault.network/${stateSlug}/${citySlug}` },
    { name: facility.name },
  ]);
  const hours = facility.hours as Record<string, string> | null;

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
                href={`/${stateSlug}`}
                className="hover:text-foreground transition-colors"
              >
                {stateName}
              </Link>
              <ChevronRight className="size-3.5" />
              <Link
                href={`/${stateSlug}/${citySlug}`}
                className="hover:text-foreground transition-colors"
              >
                {facility.city}
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="font-medium text-foreground truncate">
                {facility.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Photo Gallery */}
          {facility.photos.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-l-xl sm:col-span-2 sm:row-span-2">
                  <Image
                    src={facility.photos[0].url}
                    alt={facility.photos[0].alt || facility.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                {facility.photos.slice(1, 5).map((photo, i) => (
                  <div
                    key={photo.id}
                    className={`relative hidden aspect-[16/10] overflow-hidden sm:block ${
                      i === 1
                        ? "rounded-tr-xl"
                        : i === 3
                          ? "rounded-br-xl"
                          : ""
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || `${facility.name} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-start gap-3">
                  <h1 className="font-serif text-3xl font-light tracking-tight text-foreground">
                    {facility.name}
                  </h1>
                  <TierBadge tier={facility.tier} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {facility.reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < Math.round(facility.avgRating)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 font-medium text-foreground">
                        {facility.avgRating.toFixed(1)}
                      </span>
                      <span>
                        ({facility.reviewCount}{" "}
                        {facility.reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    <span>
                      {facility.address}, {facility.city}, {facility.state}{" "}
                      {facility.zip}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Last updated: {facility.updatedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>

              {/* Description */}
              {facility.description && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    About This Facility
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-line">
                    {facility.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Storage Types */}
              {facility.storageTypes.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    Storage Types
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {facility.storageTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-sm py-1 px-3">
                        {STORAGE_TYPE_LABELS[type] || type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle Types */}
              {facility.vehicleTypes.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    Vehicle Types Accepted
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {facility.vehicleTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-sm py-1 px-3">
                        {VEHICLE_TYPE_LABELS[type] || type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {facility.amenities.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    Amenities
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {facility.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Shield className="size-4 text-primary shrink-0" />
                        {AMENITY_LABELS[amenity] || amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Pricing */}
              {(facility.priceRangeMin !== null ||
                facility.priceRangeMax !== null) && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    Pricing
                  </h2>
                  <div className="mt-3 rounded-lg border bg-muted/30 p-4">
                    <div className="text-2xl font-bold text-foreground">
                      {facility.priceRangeMin !== null &&
                      facility.priceRangeMax !== null ? (
                        <>
                          ${facility.priceRangeMin.toFixed(0)} - $
                          {facility.priceRangeMax.toFixed(0)}
                        </>
                      ) : facility.priceRangeMin !== null ? (
                        <>From ${facility.priceRangeMin.toFixed(0)}</>
                      ) : (
                        <>Up to ${facility.priceRangeMax!.toFixed(0)}</>
                      )}
                      <span className="text-base font-normal text-muted-foreground">
                        {" "}
                        / {facility.pricePer.toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Contact the facility for exact pricing based on your
                      vehicle and storage needs.
                    </p>
                  </div>
                </div>
              )}

              {/* Hours */}
              {hours && Object.keys(hours).length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground flex items-center gap-2">
                    <Clock className="size-5" />
                    Hours of Operation
                  </h2>
                  <div className="mt-3 rounded-lg border">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(DAY_LABELS).map(([key, label]) => (
                          <tr key={key} className="border-b last:border-b-0">
                            <td className="px-4 py-2.5 font-medium text-foreground">
                              {label}
                            </td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground">
                              {hours[key] || "Closed"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Map */}
              <div>
                <h2 className="font-serif text-xl font-light text-foreground">
                  Location
                </h2>
                <div className="mt-3 overflow-hidden rounded-lg border aspect-[8/3] bg-muted flex items-center justify-center">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
                    <Image
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${facility.lat},${facility.lng}&zoom=14&size=800x300&maptype=roadmap&markers=color:red%7C${facility.lat},${facility.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                      alt={`Map showing ${facility.name} location`}
                      width={800}
                      height={300}
                      className="w-full"
                    />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-8">
                      <MapPin className="mx-auto size-8 mb-2 opacity-50" />
                      <p>{facility.lat.toFixed(4)}, {facility.lng.toFixed(4)}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        View on Google Maps <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {facility.address}, {facility.city}, {facility.state}{" "}
                  {facility.zip}
                </p>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <h2 className="font-serif text-xl font-light text-foreground">
                  Reviews
                  {facility.reviewCount > 0 && (
                    <span className="ml-2 text-base font-normal text-muted-foreground">
                      ({facility.reviewCount})
                    </span>
                  )}
                </h2>

                {facility.reviews.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed py-8 text-center">
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-6">
                    {facility.reviews.map((review) => (
                      <div key={review.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {review.user.image ? (
                              <Image
                                src={review.user.image}
                                alt={review.user.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                {(review.user.name || "U")[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">
                                {review.user.name || "Anonymous"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-4 ${
                                  i < review.rating
                                    ? "fill-primary text-primary"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="mt-3 font-medium text-foreground">
                            {review.title}
                          </h4>
                        )}
                        {review.body && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {review.body}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Contact Info Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-light text-foreground">
                    Contact Information
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        {facility.address}, {facility.city}, {facility.state}{" "}
                        {facility.zip}
                      </span>
                    </div>
                    {facility.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="size-4 text-muted-foreground shrink-0" />
                        <a
                          href={`tel:${facility.phone}`}
                          className="text-primary hover:underline"
                        >
                          {facility.phone}
                        </a>
                      </div>
                    )}
                    {facility.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="size-4 text-muted-foreground shrink-0" />
                        <a
                          href={facility.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline truncate"
                        >
                          Visit Website
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-light text-foreground">
                    Contact This Facility
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send a message to inquire about storage availability.
                  </p>
                  <div className="mt-4">
                    <ContactFacilityForm facilityId={facility.id} />
                  </div>
                </div>

                {/* Claim Listing */}
                {!facility.claimedById && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
                    <Shield className="mx-auto size-8 text-primary" />
                    <h3 className="mt-3 font-serif text-lg font-light text-foreground">
                      Is this your facility?
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Claim this listing to manage your profile, respond to
                      reviews, and access premium features.
                    </p>
                    <Link
                      href={`/claim?facility=${facility.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Claim This Listing
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedFacilities.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <section className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">
                More Car Storage in {facility.city}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedFacilities.map((rf) => (
                  <Link
                    key={rf.slug}
                    href={`/facility/${rf.slug}`}
                    className="block rounded-lg border p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold">{rf.name}</h3>
                    {rf.reviewCount > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <span className="text-yellow-500">&#9733;</span>
                        <span>{rf.avgRating.toFixed(1)}</span>
                        <span>({rf.reviewCount})</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
    </>
  );
}
