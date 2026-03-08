import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FacilityCard } from "@/components/facility-card";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StorageType,
  VehicleType,
  Amenity,
  FacilityTier,
  Prisma,
} from "@/generated/prisma";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const STORAGE_TYPE_LABELS: Record<StorageType, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  COVERED: "Covered",
  CLIMATE_CONTROLLED: "Climate Controlled",
  ENCLOSED: "Enclosed",
};

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  CAR: "Car",
  MOTORCYCLE: "Motorcycle",
  RV: "RV",
  BOAT: "Boat",
  CLASSIC: "Classic",
  EXOTIC: "Exotic",
  TRUCK: "Truck",
  TRAILER: "Trailer",
};

const AMENITY_LABELS: Record<Amenity, string> = {
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

const TIER_LABELS: Record<FacilityTier, string> = {
  FREE: "Free",
  VERIFIED: "Verified",
  PREMIUM: "Premium",
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "reviews_desc", label: "Most Reviews" },
  { value: "newest", label: "Newest" },
];

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    state?: string;
    city?: string;
    storageType?: string;
    vehicleType?: string;
    amenity?: string;
    minPrice?: string;
    maxPrice?: string;
    tier?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = [];

  if (params.q) parts.push(params.q);
  if (params.city && params.state)
    parts.push(`in ${params.city}, ${params.state}`);
  else if (params.state) parts.push(`in ${params.state}`);

  const query = parts.length > 0 ? parts.join(" ") : "All Locations";

  return {
    title: `Car Storage Search: ${query} | AutoVault`,
    description: `Search and compare car storage facilities ${parts.length > 0 ? parts.join(" ") : "near you"}. Filter by type, price, and amenities.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const storageTypes = params.storageType
    ? (params.storageType.split(",").filter((v) => v in StorageType) as StorageType[])
    : [];
  const vehicleTypes = params.vehicleType
    ? (params.vehicleType.split(",").filter((v) => v in VehicleType) as VehicleType[])
    : [];
  const amenities = params.amenity
    ? (params.amenity.split(",").filter((v) => v in Amenity) as Amenity[])
    : [];
  const tiers = params.tier
    ? (params.tier.split(",").filter((v) => v in FacilityTier) as FacilityTier[])
    : [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  const where: Prisma.FacilityWhereInput = {};

  if (params.q) {
    where.name = { contains: params.q, mode: "insensitive" };
  }
  if (params.state) {
    where.state = { equals: params.state, mode: "insensitive" };
  }
  if (params.city) {
    where.city = { equals: params.city, mode: "insensitive" };
  }
  if (storageTypes.length > 0) {
    where.storageTypes = { hasSome: storageTypes };
  }
  if (vehicleTypes.length > 0) {
    where.vehicleTypes = { hasSome: vehicleTypes };
  }
  if (amenities.length > 0) {
    where.amenities = { hasSome: amenities };
  }
  if (tiers.length > 0) {
    where.tier = { in: tiers };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceRangeMin = {};
    if (minPrice !== undefined) where.priceRangeMin.gte = minPrice;
    if (maxPrice !== undefined) {
      where.priceRangeMax = { lte: maxPrice };
    }
  }

  let orderBy: Prisma.FacilityOrderByWithRelationInput = {};
  switch (params.sort) {
    case "rating_desc":
      orderBy = { avgRating: "desc" };
      break;
    case "price_asc":
      orderBy = { priceRangeMin: { sort: "asc", nulls: "last" } };
      break;
    case "price_desc":
      orderBy = { priceRangeMax: { sort: "desc", nulls: "last" } };
      break;
    case "reviews_desc":
      orderBy = { reviewCount: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { avgRating: "desc" };
      break;
  }

  const [facilities, totalCount] = await Promise.all([
    prisma.facility.findMany({
      where,
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.facility.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const activeFilters: { label: string; paramKey: string; value: string }[] =
    [];
  storageTypes.forEach((st) =>
    activeFilters.push({
      label: STORAGE_TYPE_LABELS[st],
      paramKey: "storageType",
      value: st,
    })
  );
  vehicleTypes.forEach((vt) =>
    activeFilters.push({
      label: VEHICLE_TYPE_LABELS[vt],
      paramKey: "vehicleType",
      value: vt,
    })
  );
  amenities.forEach((a) =>
    activeFilters.push({
      label: AMENITY_LABELS[a],
      paramKey: "amenity",
      value: a,
    })
  );
  tiers.forEach((t) =>
    activeFilters.push({
      label: TIER_LABELS[t],
      paramKey: "tier",
      value: t,
    })
  );

  function buildUrl(overrides: Record<string, string | undefined>): string {
    const p = new URLSearchParams();
    const merged = { ...params, ...overrides };
    Object.entries(merged).forEach(([key, val]) => {
      if (val !== undefined && val !== "") p.set(key, val);
    });
    return `/search?${p.toString()}`;
  }

  function removeFilter(paramKey: string, value: string): string {
    const current = params[paramKey as keyof typeof params] || "";
    const values = current.split(",").filter((v) => v !== value);
    return buildUrl({
      [paramKey]: values.length > 0 ? values.join(",") : undefined,
      page: undefined,
    });
  }

  function toggleFilter(paramKey: string, value: string): string {
    const current = params[paramKey as keyof typeof params] || "";
    const values = current ? current.split(",") : [];
    const exists = values.includes(value);
    const newValues = exists
      ? values.filter((v) => v !== value)
      : [...values, value];
    return buildUrl({
      [paramKey]: newValues.length > 0 ? newValues.join(",") : undefined,
      page: undefined,
    });
  }

  return (
    <>
      {/* Search Header */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <SearchBar />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Filters */}
            <aside className="w-full shrink-0 lg:w-64">
              <div className="sticky top-4 space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </div>

                {/* Storage Type */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Storage Type
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(STORAGE_TYPE_LABELS).map(([key, label]) => (
                      <Link
                        key={key}
                        href={toggleFilter("storageType", key)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded border ${
                            storageTypes.includes(key as StorageType)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          }`}
                        >
                          {storageTypes.includes(key as StorageType) && (
                            <svg
                              className="size-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Vehicle Type */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Vehicle Type
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(VEHICLE_TYPE_LABELS).map(([key, label]) => (
                      <Link
                        key={key}
                        href={toggleFilter("vehicleType", key)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded border ${
                            vehicleTypes.includes(key as VehicleType)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          }`}
                        >
                          {vehicleTypes.includes(key as VehicleType) && (
                            <svg
                              className="size-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Amenities
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(AMENITY_LABELS)
                      .slice(0, 8)
                      .map(([key, label]) => (
                        <Link
                          key={key}
                          href={toggleFilter("amenity", key)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span
                            className={`flex size-4 items-center justify-center rounded border ${
                              amenities.includes(key as Amenity)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input"
                            }`}
                          >
                            {amenities.includes(key as Amenity) && (
                              <svg
                                className="size-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          {label}
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Tier */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Listing Tier
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(TIER_LABELS).map(([key, label]) => (
                      <Link
                        key={key}
                        href={toggleFilter("tier", key)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded border ${
                            tiers.includes(key as FacilityTier)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          }`}
                        >
                          {tiers.includes(key as FacilityTier) && (
                            <svg
                              className="size-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Price Range (per month)
                  </h3>
                  <div className="flex items-center gap-2">
                    <Link
                      href={buildUrl({ minPrice: undefined, maxPrice: "100", page: undefined })}
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        maxPrice === 100
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-muted"
                      }`}
                    >
                      Under $100
                    </Link>
                    <Link
                      href={buildUrl({ minPrice: "100", maxPrice: "300", page: undefined })}
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        minPrice === 100 && maxPrice === 300
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-muted"
                      }`}
                    >
                      $100-$300
                    </Link>
                    <Link
                      href={buildUrl({ minPrice: "300", maxPrice: undefined, page: undefined })}
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        minPrice === 300 && !maxPrice
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:bg-muted"
                      }`}
                    >
                      $300+
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {totalCount}{" "}
                    {totalCount === 1 ? "Facility" : "Facilities"} Found
                  </h1>
                  {params.q && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Results for &quot;{params.q}&quot;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SORT_OPTIONS.map((option) => (
                      <Link
                        key={option.value}
                        href={buildUrl({ sort: option.value, page: undefined })}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          (params.sort || "relevance") === option.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {activeFilters.map((filter) => (
                    <Link
                      key={`${filter.paramKey}-${filter.value}`}
                      href={removeFilter(filter.paramKey, filter.value)}
                    >
                      <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80">
                        {filter.label}
                        <X className="size-3" />
                      </Badge>
                    </Link>
                  ))}
                  <Link href="/search">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                    >
                      Clear all
                    </Badge>
                  </Link>
                </div>
              )}

              {/* Results */}
              {facilities.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                  <SlidersHorizontal className="size-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">
                    No facilities found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    Try adjusting your search criteria or removing some filters
                    to see more results.
                  </p>
                  <Link href="/search" className="mt-6">
                    <Button variant="outline">Clear All Filters</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {facilities.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2">
                  {page > 1 ? (
                    <Link href={buildUrl({ page: String(page - 1) })}>
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="size-4" />
                        Previous
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  )}

                  <div className="flex items-center gap-1">
                    {generatePageNumbers(page, totalPages).map((pageNum, i) =>
                      pageNum === null ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <Link
                          key={pageNum}
                          href={buildUrl({ page: String(pageNum) })}
                          className={`flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            pageNum === page
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      )
                    )}
                  </div>

                  {page < totalPages ? (
                    <Link href={buildUrl({ page: String(page + 1) })}>
                      <Button variant="outline" size="sm">
                        Next
                        <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
    </>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [1];

  if (current > 3) pages.push(null);

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push(null);

  pages.push(total);

  return pages;
}
