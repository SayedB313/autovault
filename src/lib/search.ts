import type { Prisma } from "@/generated/prisma";
import type { SearchParams, SortOption } from "@/types";

// ============================================================
// Default Values
// ============================================================

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT: SortOption = "relevance";
export const MAX_RADIUS_MILES = 200;

// ============================================================
// Build Prisma Where Clause
// ============================================================

export function buildSearchQuery(
  params: SearchParams
): Prisma.FacilityWhereInput {
  const conditions: Prisma.FacilityWhereInput[] = [];

  // Free-text search: match against name, city, state, or description
  if (params.query) {
    const q = params.query.trim();
    if (q.length > 0) {
      conditions.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { state: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
        ],
      });
    }
  }

  // City filter
  if (params.city) {
    conditions.push({
      city: { equals: params.city, mode: "insensitive" },
    });
  }

  // State filter
  if (params.state) {
    conditions.push({
      state: { equals: params.state, mode: "insensitive" },
    });
  }

  // Storage types filter (facility must have ALL selected types)
  if (params.storageTypes && params.storageTypes.length > 0) {
    conditions.push({
      storageTypes: { hasEvery: params.storageTypes },
    });
  }

  // Vehicle types filter (facility must have at least ONE selected type)
  if (params.vehicleTypes && params.vehicleTypes.length > 0) {
    conditions.push({
      vehicleTypes: { hasSome: params.vehicleTypes },
    });
  }

  // Amenities filter (facility must have ALL selected amenities)
  if (params.amenities && params.amenities.length > 0) {
    conditions.push({
      amenities: { hasEvery: params.amenities },
    });
  }

  // Price range filter
  if (params.priceMin != null) {
    conditions.push({
      OR: [
        { priceRangeMax: { gte: params.priceMin } },
        { priceRangeMax: null, priceRangeMin: { gte: params.priceMin } },
      ],
    });
  }
  if (params.priceMax != null) {
    conditions.push({
      OR: [
        { priceRangeMin: { lte: params.priceMax } },
        { priceRangeMin: null },
      ],
    });
  }

  // Tier filter
  if (params.tier) {
    conditions.push({ tier: params.tier });
  }

  // Geographic radius filter (requires lat, lng, radius)
  // Prisma doesn't support native geo queries, so we use a bounding box
  // and rely on post-query haversine filtering for precision
  if (
    params.lat != null &&
    params.lng != null &&
    params.radius != null &&
    params.radius > 0
  ) {
    const radiusMiles = Math.min(params.radius, MAX_RADIUS_MILES);
    // Approximate bounding box: 1 degree latitude ~ 69 miles
    const latDelta = radiusMiles / 69;
    // 1 degree longitude ~ 69 * cos(lat) miles
    const lngDelta = radiusMiles / (69 * Math.cos((params.lat * Math.PI) / 180));

    conditions.push({
      lat: {
        gte: params.lat - latDelta,
        lte: params.lat + latDelta,
      },
      lng: {
        gte: params.lng - lngDelta,
        lte: params.lng + lngDelta,
      },
    });
  }

  if (conditions.length === 0) {
    return {};
  }

  return { AND: conditions };
}

// ============================================================
// Build Prisma OrderBy
// ============================================================

export function buildOrderBy(
  sort?: SortOption
): Prisma.FacilityOrderByWithRelationInput | Prisma.FacilityOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ avgRating: "desc" }, { reviewCount: "desc" }];
    case "reviews":
      return { reviewCount: "desc" };
    case "price_asc":
      return { priceRangeMin: { sort: "asc", nulls: "last" } };
    case "price_desc":
      return { priceRangeMax: { sort: "desc", nulls: "last" } };
    case "newest":
      return { createdAt: "desc" };
    case "distance":
      // Distance sorting requires post-query sorting with haversine
      // Fall back to rating as the DB sort, then re-sort in application code
      return [{ avgRating: "desc" }, { reviewCount: "desc" }];
    case "relevance":
    default:
      // Relevance: prioritize tier (PREMIUM > VERIFIED > FREE), then rating
      return [{ tier: "desc" }, { avgRating: "desc" }, { reviewCount: "desc" }];
  }
}

// ============================================================
// Pagination Helpers
// ============================================================

export function getPaginationParams(params: SearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// ============================================================
// Prisma Select for Card Data
// ============================================================

export const facilityCardSelect = {
  id: true,
  slug: true,
  name: true,
  city: true,
  state: true,
  tier: true,
  avgRating: true,
  reviewCount: true,
  priceRangeMin: true,
  priceRangeMax: true,
  pricePer: true,
  storageTypes: true,
  vehicleTypes: true,
  lat: true,
  lng: true,
  photos: {
    select: {
      id: true,
      url: true,
      alt: true,
      order: true,
    },
    orderBy: { order: "asc" as const },
    take: 3,
  },
} satisfies Prisma.FacilitySelect;
