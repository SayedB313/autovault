/**
 * Google Places API (New) client for AutoVault facility seeding.
 *
 * Uses the Text Search (New) endpoint:
 *   POST https://places.googleapis.com/v1/places:searchText
 *
 * Pricing (as of 2025):
 *   - Text Search (New): ~$32 per 1,000 requests
 *   - Place Photo (New): ~$7 per 1,000 requests
 */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY environment variable is required");
}

// ------------------------------------------------------------------ types

export interface PlaceResult {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingCount?: number;
  googlePlaceId: string;
  photoReferences: string[];
  hours?: Record<string, string>;
  types?: string[];
  businessStatus?: string;
}

interface TextSearchResponse {
  places?: RawPlace[];
  nextPageToken?: string;
}

interface RawPlace {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  photos?: { name: string; widthPx: number; heightPx: number }[];
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
    periods?: {
      open: { day: number; hour: number; minute: number };
      close?: { day: number; hour: number; minute: number };
    }[];
  };
  types?: string[];
  businessStatus?: string;
}

// ---------------------------------------------------------------- helpers

const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function parseHours(
  raw: RawPlace["regularOpeningHours"]
): Record<string, string> | undefined {
  if (!raw?.weekdayDescriptions?.length) return undefined;

  const hours: Record<string, string> = {};
  for (const desc of raw.weekdayDescriptions) {
    // Format: "Monday: 9:00 AM – 5:00 PM" or "Monday: Closed"
    const colonIdx = desc.indexOf(":");
    if (colonIdx === -1) continue;
    const dayName = desc.slice(0, colonIdx).trim().toLowerCase().slice(0, 3);
    const value = desc.slice(colonIdx + 1).trim();
    hours[dayName] = value;
  }
  return Object.keys(hours).length > 0 ? hours : undefined;
}

function mapPlace(raw: RawPlace): PlaceResult {
  return {
    name: raw.displayName?.text ?? "Unknown",
    formattedAddress: raw.formattedAddress ?? "",
    lat: raw.location?.latitude ?? 0,
    lng: raw.location?.longitude ?? 0,
    phone: raw.nationalPhoneNumber ?? raw.internationalPhoneNumber,
    website: raw.websiteUri,
    rating: raw.rating,
    userRatingCount: raw.userRatingCount,
    googlePlaceId: raw.id,
    photoReferences: (raw.photos ?? []).map((p) => p.name),
    hours: parseHours(raw.regularOpeningHours),
    types: raw.types,
    businessStatus: raw.businessStatus,
  };
}

// ------------------------------------------------------------- rate limit

let lastRequestTime = 0;
const MIN_DELAY_MS = 200; // 5 req/sec max to be safe

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

// ----------------------------------------------------------- cost tracker

export class CostTracker {
  private textSearchCount = 0;
  private photoFetchCount = 0;
  private readonly budgetLimit: number;

  // Pricing per 1,000 requests (USD)
  private static TEXT_SEARCH_COST_PER_1K = 32;
  private static PHOTO_COST_PER_1K = 7;

  constructor(budgetLimit: number = 100) {
    this.budgetLimit = budgetLimit;
  }

  recordTextSearch(): void {
    this.textSearchCount++;
  }

  recordPhotoFetch(count: number = 1): void {
    this.photoFetchCount += count;
  }

  get estimatedCost(): number {
    return (
      (this.textSearchCount / 1000) * CostTracker.TEXT_SEARCH_COST_PER_1K +
      (this.photoFetchCount / 1000) * CostTracker.PHOTO_COST_PER_1K
    );
  }

  get isOverBudget(): boolean {
    return this.estimatedCost >= this.budgetLimit;
  }

  get remaining(): number {
    return Math.max(0, this.budgetLimit - this.estimatedCost);
  }

  summary(): string {
    return [
      `Text searches: ${this.textSearchCount}`,
      `Photo fetches: ${this.photoFetchCount}`,
      `Estimated cost: $${this.estimatedCost.toFixed(2)} / $${this.budgetLimit}`,
      `Remaining budget: $${this.remaining.toFixed(2)}`,
    ].join(" | ");
  }
}

// --------------------------------------------------------- text search

/**
 * Search Google Places (New) Text Search API.
 *
 * @param query  e.g. "car storage facility"
 * @param locationBias  center lat/lng + radius in meters
 * @param maxResults  cap results (API max is 20 per page)
 */
export async function searchPlaces(
  query: string,
  locationBias: { lat: number; lng: number; radiusMeters?: number },
  costTracker: CostTracker,
  maxResults: number = 20
): Promise<PlaceResult[]> {
  if (costTracker.isOverBudget) {
    console.warn("  [BUDGET] Skipping search — budget limit reached");
    return [];
  }

  await rateLimit();

  const body = {
    textQuery: query,
    locationBias: {
      circle: {
        center: {
          latitude: locationBias.lat,
          longitude: locationBias.lng,
        },
        radius: locationBias.radiusMeters ?? 50000, // 50km default
      },
    },
    maxResultCount: Math.min(maxResults, 20),
    languageCode: "en",
  };

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.nationalPhoneNumber",
    "places.internationalPhoneNumber",
    "places.websiteUri",
    "places.rating",
    "places.userRatingCount",
    "places.photos",
    "places.regularOpeningHours",
    "places.types",
    "places.businessStatus",
  ].join(",");

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY!,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(body),
    }
  );

  costTracker.recordTextSearch();

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`  [API ERROR] ${res.status}: ${errorText}`);
    return [];
  }

  const data: TextSearchResponse = await res.json();
  return (data.places ?? []).map(mapPlace);
}

// --------------------------------------------------------- photo URL

/**
 * Build a photo URL from a Google Places photo reference.
 *
 * Photo reference format: "places/{placeId}/photos/{photoRef}"
 * URL format: https://places.googleapis.com/v1/{name}/media?maxWidthPx=800&key=...
 *
 * Returns the direct image URL (follows redirect).
 */
export async function getPhotoUrl(
  photoReference: string,
  costTracker: CostTracker,
  maxWidthPx: number = 800
): Promise<string | null> {
  if (costTracker.isOverBudget) {
    return null;
  }

  await rateLimit();

  const url = `https://places.googleapis.com/v1/${photoReference}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}&skipHttpRedirect=true`;

  const res = await fetch(url);
  costTracker.recordPhotoFetch();

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.photoUri ?? null;
}

/**
 * Fetch photo URLs for a list of photo references (max N).
 * Returns an array of resolved URLs.
 */
export async function getPhotoUrls(
  photoReferences: string[],
  costTracker: CostTracker,
  maxPhotos: number = 3,
  maxWidthPx: number = 800
): Promise<string[]> {
  const refs = photoReferences.slice(0, maxPhotos);
  const urls: string[] = [];

  for (const ref of refs) {
    if (costTracker.isOverBudget) break;
    const url = await getPhotoUrl(ref, costTracker, maxWidthPx);
    if (url) urls.push(url);
  }

  return urls;
}
