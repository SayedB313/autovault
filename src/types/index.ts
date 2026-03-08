import type {
  Facility,
  FacilityPhoto,
  StorageType,
  VehicleType,
  Amenity,
  FacilityTier,
  PricePer,
  City,
} from "@/generated/prisma";

// ============================================================
// Facility Types
// ============================================================

/** Facility with its photos relation included */
export type FacilityWithPhotos = Facility & {
  photos: FacilityPhoto[];
};

/** Minimal facility data for card/list display */
export type FacilityCardData = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  tier: FacilityTier;
  avgRating: number;
  reviewCount: number;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  pricePer: PricePer;
  storageTypes: StorageType[];
  vehicleTypes: VehicleType[];
  photos: Pick<FacilityPhoto, "id" | "url" | "alt" | "order">[];
  lat: number;
  lng: number;
};

// ============================================================
// Search Types
// ============================================================

export type SortOption =
  | "relevance"
  | "rating"
  | "price_asc"
  | "price_desc"
  | "distance"
  | "reviews"
  | "newest";

export type SearchParams = {
  query?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  storageTypes?: StorageType[];
  vehicleTypes?: VehicleType[];
  amenities?: Amenity[];
  priceMin?: number;
  priceMax?: number;
  tier?: FacilityTier;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

// ============================================================
// City / State Types
// ============================================================

export type CityData = Pick<
  City,
  "id" | "slug" | "name" | "state" | "stateSlug" | "lat" | "lng" | "population"
> & {
  facilityCount: number;
};

export type StateData = {
  name: string;
  abbreviation: string;
  slug: string;
  cityCount: number;
  facilityCount: number;
};

// ============================================================
// Re-exports for convenience
// ============================================================

export type {
  Facility,
  FacilityPhoto,
  StorageType,
  VehicleType,
  Amenity,
  FacilityTier,
  PricePer,
  City,
};
