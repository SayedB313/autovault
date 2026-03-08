/**
 * AutoVault — Expansion Seeder (Wave 2)
 *
 * Adds facilities from 75 more US cities (ranked #51-125 by population).
 * Uses 1 photo per facility to conserve budget.
 * Skips any facility whose googlePlaceId already exists in DB.
 *
 * Budget: ~$30 target
 *   - Text Search (New):  ~$32 / 1,000 requests
 *   - Place Photo (New):  ~$7  / 1,000 requests
 *   - Plan: ~375 text searches + ~750 photo fetches ≈ $19
 *
 * Usage:
 *   npx tsx prisma/seed-expand.ts
 */

import "dotenv/config";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import slugify from "slugify";

// Inline API helpers to avoid @/ path alias issues in Docker
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

class CostTracker {
  private textSearchCount = 0;
  private photoFetchCount = 0;
  private readonly budgetLimit: number;
  private static TEXT_SEARCH_COST_PER_1K = 32;
  private static PHOTO_COST_PER_1K = 7;

  constructor(budgetLimit: number = 100) {
    this.budgetLimit = budgetLimit;
  }
  recordTextSearch(): void { this.textSearchCount++; }
  recordPhotoFetch(count: number = 1): void { this.photoFetchCount += count; }

  get estimatedCost(): number {
    return (
      (this.textSearchCount / 1000) * CostTracker.TEXT_SEARCH_COST_PER_1K +
      (this.photoFetchCount / 1000) * CostTracker.PHOTO_COST_PER_1K
    );
  }
  get isOverBudget(): boolean { return this.estimatedCost >= this.budgetLimit; }
  get remaining(): number { return Math.max(0, this.budgetLimit - this.estimatedCost); }

  summary(): string {
    return [
      `Text searches: ${this.textSearchCount}`,
      `Photo fetches: ${this.photoFetchCount}`,
      `Estimated cost: $${this.estimatedCost.toFixed(2)} / $${this.budgetLimit}`,
      `Remaining budget: $${this.remaining.toFixed(2)}`,
    ].join(" | ");
  }
}

interface PlaceResult {
  googlePlaceId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingCount?: number;
  photoReferences: string[];
  types?: string[];
  hours?: Record<string, string>;
}

let lastRequest = 0;
async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequest;
  if (elapsed < 200) await new Promise((r) => setTimeout(r, 200 - elapsed));
  lastRequest = Date.now();
}

async function searchPlaces(
  query: string,
  locationBias: { lat: number; lng: number; radiusMeters?: number },
  costTracker: CostTracker,
  maxResults: number = 20
): Promise<PlaceResult[]> {
  if (costTracker.isOverBudget) return [];
  await rateLimit();

  const body = {
    textQuery: query,
    locationBias: {
      circle: {
        center: { latitude: locationBias.lat, longitude: locationBias.lng },
        radius: locationBias.radiusMeters ?? 50000,
      },
    },
    maxResultCount: Math.min(maxResults, 20),
    languageCode: "en",
  };

  const fieldMask = [
    "places.id", "places.displayName", "places.formattedAddress",
    "places.location", "places.nationalPhoneNumber", "places.websiteUri",
    "places.rating", "places.userRatingCount", "places.photos",
    "places.regularOpeningHours", "places.types", "places.businessStatus",
  ].join(",");

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  costTracker.recordTextSearch();

  if (!res.ok) {
    console.error(`    [API ERROR] ${res.status}: ${await res.text()}`);
    return [];
  }

  const data = await res.json();
  const places: any[] = data.places || [];

  return places
    .filter((p: any) => p.businessStatus !== "CLOSED_PERMANENTLY")
    .map((p: any) => {
      let hours: Record<string, string> | undefined;
      if (p.regularOpeningHours?.weekdayDescriptions) {
        hours = {};
        for (const desc of p.regularOpeningHours.weekdayDescriptions) {
          const [day, ...rest] = desc.split(": ");
          if (day) hours[day] = rest.join(": ") || "Closed";
        }
      }
      return {
        googlePlaceId: p.id,
        name: p.displayName?.text || "Unknown",
        formattedAddress: p.formattedAddress || "",
        lat: p.location?.latitude || 0,
        lng: p.location?.longitude || 0,
        phone: p.nationalPhoneNumber,
        website: p.websiteUri,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        photoReferences: (p.photos || []).map((ph: any) => ph.name).filter(Boolean),
        types: p.types,
        hours,
      };
    });
}

async function getPhotoUrls(
  refs: string[],
  costTracker: CostTracker,
  maxPhotos: number = 1,
  maxWidth: number = 800
): Promise<string[]> {
  const urls: string[] = [];
  for (const ref of refs.slice(0, maxPhotos)) {
    if (costTracker.isOverBudget) break;
    await rateLimit();
    const url = `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      costTracker.recordPhotoFetch();
      if (res.ok) urls.push(res.url);
    } catch { /* skip */ }
  }
  return urls;
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ================================================================
// US cities #51-125 by population
// ================================================================

interface CityDef {
  name: string;
  state: string;
  stateSlug: string;
  lat: number;
  lng: number;
  population: number;
}

const CITIES: CityDef[] = [
  // #51-60
  { name: "Bakersfield", state: "CA", stateSlug: "california", lat: 35.3733, lng: -119.0187, population: 403455 },
  { name: "Aurora", state: "CO", stateSlug: "colorado", lat: 39.7294, lng: -104.8319, population: 386261 },
  { name: "Anaheim", state: "CA", stateSlug: "california", lat: 33.8366, lng: -117.9143, population: 350365 },
  { name: "Santa Ana", state: "CA", stateSlug: "california", lat: 33.7455, lng: -117.8677, population: 310227 },
  { name: "Riverside", state: "CA", stateSlug: "california", lat: 33.9534, lng: -117.3962, population: 314998 },
  { name: "Corpus Christi", state: "TX", stateSlug: "texas", lat: 27.8006, lng: -97.3964, population: 317863 },
  { name: "Lexington", state: "KY", stateSlug: "kentucky", lat: 38.0406, lng: -84.5037, population: 322570 },
  { name: "Henderson", state: "NV", stateSlug: "nevada", lat: 36.0395, lng: -114.9817, population: 320189 },
  { name: "Stockton", state: "CA", stateSlug: "california", lat: 37.9577, lng: -121.2908, population: 320804 },
  { name: "St. Paul", state: "MN", stateSlug: "minnesota", lat: 44.9537, lng: -93.09, population: 311527 },
  // #61-70
  { name: "Cincinnati", state: "OH", stateSlug: "ohio", lat: 39.1031, lng: -84.512, population: 309317 },
  { name: "Pittsburgh", state: "PA", stateSlug: "pennsylvania", lat: 40.4406, lng: -79.9959, population: 302971 },
  { name: "Greensboro", state: "NC", stateSlug: "north-carolina", lat: 36.0726, lng: -79.7920, population: 299035 },
  { name: "Anchorage", state: "AK", stateSlug: "alaska", lat: 61.2181, lng: -149.9003, population: 291247 },
  { name: "Plano", state: "TX", stateSlug: "texas", lat: 33.0198, lng: -96.6989, population: 285494 },
  { name: "Lincoln", state: "NE", stateSlug: "nebraska", lat: 40.8136, lng: -96.7026, population: 291082 },
  { name: "Orlando", state: "FL", stateSlug: "florida", lat: 28.5383, lng: -81.3792, population: 307573 },
  { name: "Irvine", state: "CA", stateSlug: "california", lat: 33.6846, lng: -117.8265, population: 307670 },
  { name: "Newark", state: "NJ", stateSlug: "new-jersey", lat: 40.7357, lng: -74.1724, population: 311549 },
  { name: "Durham", state: "NC", stateSlug: "north-carolina", lat: 35.994, lng: -78.8986, population: 283506 },
  // #71-80
  { name: "Chula Vista", state: "CA", stateSlug: "california", lat: 32.6401, lng: -117.0842, population: 275487 },
  { name: "Toledo", state: "OH", stateSlug: "ohio", lat: 41.6528, lng: -83.5379, population: 270871 },
  { name: "Fort Wayne", state: "IN", stateSlug: "indiana", lat: 41.0793, lng: -85.1394, population: 263886 },
  { name: "St. Petersburg", state: "FL", stateSlug: "florida", lat: 27.7676, lng: -82.6403, population: 258308 },
  { name: "Laredo", state: "TX", stateSlug: "texas", lat: 27.5036, lng: -99.5076, population: 255205 },
  { name: "Jersey City", state: "NJ", stateSlug: "new-jersey", lat: 40.7178, lng: -74.0431, population: 292449 },
  { name: "Chandler", state: "AZ", stateSlug: "arizona", lat: 33.3062, lng: -111.8413, population: 275987 },
  { name: "Madison", state: "WI", stateSlug: "wisconsin", lat: 43.0731, lng: -89.4012, population: 269840 },
  { name: "Lubbock", state: "TX", stateSlug: "texas", lat: 33.5779, lng: -101.8552, population: 263930 },
  { name: "Scottsdale", state: "AZ", stateSlug: "arizona", lat: 33.4942, lng: -111.9261, population: 241361 },
  // #81-90
  { name: "Reno", state: "NV", stateSlug: "nevada", lat: 39.5296, lng: -119.8138, population: 264165 },
  { name: "Buffalo", state: "NY", stateSlug: "new-york", lat: 42.8864, lng: -78.8784, population: 278349 },
  { name: "Gilbert", state: "AZ", stateSlug: "arizona", lat: 33.3528, lng: -111.789, population: 267918 },
  { name: "Glendale", state: "AZ", stateSlug: "arizona", lat: 33.5387, lng: -112.186, population: 248325 },
  { name: "North Las Vegas", state: "NV", stateSlug: "nevada", lat: 36.1989, lng: -115.1175, population: 262527 },
  { name: "Winston-Salem", state: "NC", stateSlug: "north-carolina", lat: 36.0999, lng: -80.2442, population: 249545 },
  { name: "Chesapeake", state: "VA", stateSlug: "virginia", lat: 36.7682, lng: -76.2875, population: 249422 },
  { name: "Norfolk", state: "VA", stateSlug: "virginia", lat: 36.8508, lng: -76.2859, population: 238005 },
  { name: "Fremont", state: "CA", stateSlug: "california", lat: 37.5485, lng: -121.9886, population: 230504 },
  { name: "Garland", state: "TX", stateSlug: "texas", lat: 32.9126, lng: -96.6389, population: 246018 },
  // #91-100
  { name: "Irving", state: "TX", stateSlug: "texas", lat: 32.814, lng: -96.9489, population: 256684 },
  { name: "Richmond", state: "VA", stateSlug: "virginia", lat: 37.5407, lng: -77.436, population: 226610 },
  { name: "Boise", state: "ID", stateSlug: "idaho", lat: 43.615, lng: -116.2023, population: 235684 },
  { name: "Spokane", state: "WA", stateSlug: "washington", lat: 47.6588, lng: -117.426, population: 228989 },
  { name: "Des Moines", state: "IA", stateSlug: "iowa", lat: 41.5868, lng: -93.625, population: 214133 },
  { name: "Montgomery", state: "AL", stateSlug: "alabama", lat: 32.3668, lng: -86.3, population: 200603 },
  { name: "Modesto", state: "CA", stateSlug: "california", lat: 37.6391, lng: -120.9969, population: 218464 },
  { name: "Fayetteville", state: "NC", stateSlug: "north-carolina", lat: 35.0527, lng: -78.8784, population: 208501 },
  { name: "Tacoma", state: "WA", stateSlug: "washington", lat: 47.2529, lng: -122.4443, population: 219346 },
  { name: "Shreveport", state: "LA", stateSlug: "louisiana", lat: 32.5252, lng: -93.7502, population: 187593 },
  // #101-110
  { name: "Fontana", state: "CA", stateSlug: "california", lat: 34.0922, lng: -117.435, population: 214547 },
  { name: "Moreno Valley", state: "CA", stateSlug: "california", lat: 33.9425, lng: -117.2297, population: 212477 },
  { name: "Rochester", state: "NY", stateSlug: "new-york", lat: 43.1566, lng: -77.6088, population: 211328 },
  { name: "Yonkers", state: "NY", stateSlug: "new-york", lat: 40.9312, lng: -73.8987, population: 211569 },
  { name: "Fayetteville", state: "AR", stateSlug: "arkansas", lat: 36.0822, lng: -94.1719, population: 93949 },
  { name: "Worcester", state: "MA", stateSlug: "massachusetts", lat: 42.2626, lng: -71.8023, population: 206518 },
  { name: "Port St. Lucie", state: "FL", stateSlug: "florida", lat: 27.2939, lng: -80.3503, population: 204851 },
  { name: "Little Rock", state: "AR", stateSlug: "arkansas", lat: 34.7465, lng: -92.2896, population: 202591 },
  { name: "Augusta", state: "GA", stateSlug: "georgia", lat: 33.4735, lng: -81.9748, population: 202081 },
  { name: "Oxnard", state: "CA", stateSlug: "california", lat: 34.1975, lng: -119.1771, population: 202063 },
  // #111-125
  { name: "Knoxville", state: "TN", stateSlug: "tennessee", lat: 35.9606, lng: -83.9207, population: 190740 },
  { name: "Birmingham", state: "AL", stateSlug: "alabama", lat: 33.5207, lng: -86.8025, population: 200733 },
  { name: "Salt Lake City", state: "UT", stateSlug: "utah", lat: 40.7608, lng: -111.891, population: 199723 },
  { name: "Amarillo", state: "TX", stateSlug: "texas", lat: 35.222, lng: -101.8313, population: 199826 },
  { name: "Grand Rapids", state: "MI", stateSlug: "michigan", lat: 42.9634, lng: -85.6681, population: 198917 },
  { name: "Huntsville", state: "AL", stateSlug: "alabama", lat: 34.7304, lng: -86.5861, population: 215006 },
  { name: "Tallahassee", state: "FL", stateSlug: "florida", lat: 30.4383, lng: -84.2807, population: 196169 },
  { name: "Grand Prairie", state: "TX", stateSlug: "texas", lat: 32.746, lng: -96.9978, population: 196100 },
  { name: "Overland Park", state: "KS", stateSlug: "kansas", lat: 38.9822, lng: -94.6708, population: 197238 },
  { name: "Knoxville", state: "TN", stateSlug: "tennessee", lat: 35.9606, lng: -83.9207, population: 190740 },
  { name: "Brownsville", state: "TX", stateSlug: "texas", lat: 25.9017, lng: -97.4975, population: 186738 },
  { name: "Chattanooga", state: "TN", stateSlug: "tennessee", lat: 35.0456, lng: -85.3097, population: 181099 },
  { name: "Providence", state: "RI", stateSlug: "rhode-island", lat: 41.824, lng: -71.4128, population: 190934 },
  { name: "Newport News", state: "VA", stateSlug: "virginia", lat: 37.0871, lng: -76.473, population: 186247 },
  { name: "Mobile", state: "AL", stateSlug: "alabama", lat: 30.6954, lng: -88.0399, population: 187041 },
];

// Deduplicate (Knoxville appears twice above)
const seen = new Set<string>();
const UNIQUE_CITIES = CITIES.filter((c) => {
  const key = `${c.name}-${c.state}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// ================================================================
// Search queries — same as original
// ================================================================

const SEARCH_QUERIES = [
  "car storage facility",
  "vehicle storage",
  "luxury car storage",
  "exotic car storage",
  "classic car storage",
];

// ================================================================
// Categorization helpers (copied from seed.ts)
// ================================================================

const LUXURY_KEYWORDS = [
  "luxury", "exotic", "classic", "collector", "concours", "premium",
  "vault", "museum", "prestige", "elite", "bespoke", "boutique",
  "supercar", "hypercar",
];

function detectVehicleTypes(name: string): string[] {
  const lower = name.toLowerCase();
  const types: Set<string> = new Set(["CAR"]);
  if (/\b(exotic|supercar|hypercar|lambo|ferrari|porsche)\b/i.test(lower)) types.add("EXOTIC");
  if (/\b(classic|vintage|antique|collector|concours|museum)\b/i.test(lower)) types.add("CLASSIC");
  if (/\b(rv|motorhome|camper)\b/i.test(lower)) types.add("RV");
  if (/\b(boat|marine|yacht|jet ?ski)\b/i.test(lower)) types.add("BOAT");
  if (/\b(motorcycle|bike|moto)\b/i.test(lower)) types.add("MOTORCYCLE");
  if (/\b(truck|trailer)\b/i.test(lower)) { types.add("TRUCK"); types.add("TRAILER"); }
  return [...types];
}

function detectStorageTypes(name: string): string[] {
  const lower = name.toLowerCase();
  const types: Set<string> = new Set(["INDOOR"]);
  if (/\b(outdoor|open.?air|uncovered|lot)\b/i.test(lower)) { types.delete("INDOOR"); types.add("OUTDOOR"); }
  if (/\b(climate|temperature|humidity|hvac)\b/i.test(lower)) types.add("CLIMATE_CONTROLLED");
  if (/\b(covered|carport|canopy)\b/i.test(lower)) types.add("COVERED");
  if (/\b(enclosed|private|individual)\b/i.test(lower)) types.add("ENCLOSED");
  return [...types];
}

function detectAmenities(name: string): string[] {
  const lower = name.toLowerCase();
  const amenities: string[] = [];
  if (/\b(24.?hr|24.?hour|24\/7|always.?open)\b/i.test(lower)) amenities.push("ACCESS_24HR");
  if (/\b(camera|cctv|surveillance|monitor)\b/i.test(lower)) amenities.push("SECURITY_CAMERAS");
  if (/\b(gate[d]?|fenc)\b/i.test(lower)) amenities.push("GATED");
  if (/\b(climate|temperature|humidity)\b/i.test(lower)) amenities.push("CLIMATE_MONITORING");
  if (/\b(fire|sprinkler|suppression)\b/i.test(lower)) amenities.push("FIRE_SUPPRESSION");
  if (/\b(ev.?charg|electric.?vehicle|tesla)\b/i.test(lower)) amenities.push("EV_CHARGING");
  if (/\b(concierge|valet|white.?glove)\b/i.test(lower)) amenities.push("CONCIERGE");
  if (/\b(detail|wash|clean|polish)\b/i.test(lower)) amenities.push("DETAILING");
  return amenities;
}

function parseAddress(formattedAddress: string, fallbackCity: string, fallbackState: string) {
  const stateMatch = formattedAddress.match(/\b([A-Z]{2})\s+(\d{5})\b/);
  if (stateMatch) {
    const beforeState = formattedAddress.slice(0, formattedAddress.indexOf(stateMatch[0]));
    const cityParts = beforeState.split(",").map((s) => s.trim());
    const city = cityParts[cityParts.length - 1] || fallbackCity;
    return { city, state: stateMatch[1], zip: stateMatch[2] };
  }
  return { city: fallbackCity, state: fallbackState };
}

function makeSlug(name: string, city: string, state: string): string {
  return slugify(`${name} ${city} ${state}`, { lower: true, strict: true, trim: true }) || `facility-${Date.now()}`;
}

function makeCitySlug(name: string, state: string): string {
  return slugify(`${name} ${state}`, { lower: true, strict: true, trim: true });
}

// ================================================================
// Main expansion seeder
// ================================================================

async function seedExpansion() {
  console.log("=".repeat(60));
  console.log("AutoVault — Expansion Seeder (Wave 2)");
  console.log(`${UNIQUE_CITIES.length} cities | 1 photo/facility | $35 budget`);
  console.log("=".repeat(60));
  console.log();

  // Load existing googlePlaceIds to skip duplicates
  const existingPlaces = await prisma.facility.findMany({
    select: { googlePlaceId: true },
    where: { googlePlaceId: { not: null } },
  });
  const existingPlaceIds = new Set(existingPlaces.map((f) => f.googlePlaceId!));
  console.log(`Loaded ${existingPlaceIds.size} existing googlePlaceIds to skip.\n`);

  const costTracker = new CostTracker(35); // $35 budget
  const seenPlaceIds = new Set<string>();
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalDuplicates = 0;

  for (let i = 0; i < UNIQUE_CITIES.length; i++) {
    const city = UNIQUE_CITIES[i];

    console.log(
      `\n[${i + 1}/${UNIQUE_CITIES.length}] ${city.name}, ${city.state} (pop: ${city.population.toLocaleString()})`
    );
    console.log("-".repeat(50));

    if (costTracker.isOverBudget) {
      console.log("[BUDGET] Stopping — budget limit reached.");
      console.log(costTracker.summary());
      break;
    }

    const cityResults: PlaceResult[] = [];

    for (const query of SEARCH_QUERIES) {
      if (costTracker.isOverBudget) break;

      console.log(`  Searching: "${query}" near ${city.name}...`);

      const results = await searchPlaces(
        `${query} in ${city.name}, ${city.state}`,
        { lat: city.lat, lng: city.lng, radiusMeters: 50000 },
        costTracker,
        20
      );

      console.log(`    Found ${results.length} results`);

      for (const result of results) {
        // Skip if already in DB or already seen this run
        if (existingPlaceIds.has(result.googlePlaceId)) {
          totalDuplicates++;
          continue;
        }
        if (!seenPlaceIds.has(result.googlePlaceId)) {
          seenPlaceIds.add(result.googlePlaceId);
          cityResults.push(result);
        } else {
          totalDuplicates++;
        }
      }
    }

    console.log(`  Unique new facilities for ${city.name}: ${cityResults.length}`);

    let cityCreated = 0;

    for (const place of cityResults) {
      if (costTracker.isOverBudget) break;

      const parsed = parseAddress(place.formattedAddress, city.name, city.state);

      let slug = makeSlug(place.name, parsed.city, parsed.state);
      const existingSlug = await prisma.facility.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${slug}-${place.googlePlaceId.slice(-6)}`;
      }

      const vehicleTypes = detectVehicleTypes(place.name);
      const storageTypes = detectStorageTypes(place.name);
      const amenities = detectAmenities(place.name);
      const isLuxury = LUXURY_KEYWORDS.some((kw) => place.name.toLowerCase().includes(kw));

      // Fetch 1 photo max per facility
      let photoUrls: string[] = [];
      if (place.photoReferences.length > 0 && !costTracker.isOverBudget) {
        photoUrls = await getPhotoUrls(
          place.photoReferences,
          costTracker,
          1, // MAX 1 PHOTO
          800
        );
      }

      try {
        await prisma.facility.create({
          data: {
            slug,
            name: place.name,
            address: place.formattedAddress,
            city: parsed.city,
            state: parsed.state,
            zip: parsed.zip,
            country: "US",
            lat: place.lat,
            lng: place.lng,
            phone: place.phone,
            website: place.website,
            googlePlaceId: place.googlePlaceId,
            avgRating: place.rating ?? 0,
            reviewCount: place.userRatingCount ?? 0,
            hours: place.hours ?? undefined,
            storageTypes: storageTypes as any[],
            vehicleTypes: vehicleTypes as any[],
            amenities: amenities as any[],
            tier: isLuxury ? "VERIFIED" : "FREE",
            photos: photoUrls.length > 0
              ? {
                  create: photoUrls.map((url, idx) => ({
                    url,
                    alt: `${place.name} - Photo ${idx + 1}`,
                    order: idx,
                    source: "GOOGLE" as const,
                  })),
                }
              : undefined,
          },
        });

        cityCreated++;
        totalCreated++;

        if (totalCreated % 50 === 0) {
          console.log(`    [PROGRESS] ${totalCreated} new facilities | ${costTracker.summary()}`);
        }
      } catch (err: any) {
        if (err?.code === "P2002") {
          totalSkipped++;
          continue;
        }
        console.error(`    [ERROR] Failed to create ${place.name}: ${err.message}`);
        totalSkipped++;
      }
    }

    console.log(`  Created ${cityCreated} facilities in ${city.name}, ${city.state}`);
  }

  // ============================================================
  // Upsert City records for new cities
  // ============================================================

  console.log("\n" + "=".repeat(60));
  console.log("Upserting City records...");
  console.log("=".repeat(60));

  for (const cityDef of UNIQUE_CITIES) {
    const citySlug = makeCitySlug(cityDef.name, cityDef.state);

    const facilityCount = await prisma.facility.count({
      where: { city: cityDef.name, state: cityDef.state },
    });

    if (facilityCount === 0) continue; // skip cities with no facilities

    await prisma.city.upsert({
      where: {
        slug_stateSlug: {
          slug: citySlug,
          stateSlug: cityDef.stateSlug,
        },
      },
      update: {
        facilityCount,
        population: cityDef.population,
      },
      create: {
        slug: citySlug,
        name: cityDef.name,
        state: cityDef.state,
        stateSlug: cityDef.stateSlug,
        lat: cityDef.lat,
        lng: cityDef.lng,
        population: cityDef.population,
        facilityCount,
        metaTitle: `Car Storage in ${cityDef.name}, ${cityDef.state} | AutoVault`,
        metaDescription: `Find ${facilityCount}+ car storage facilities in ${cityDef.name}, ${cityDef.state}. Compare prices, amenities, and reviews for vehicle storage near you.`,
      },
    });

    console.log(`  ${cityDef.name}, ${cityDef.state}: ${facilityCount} facilities`);
  }

  // Also update original 50 city counts (in case expansion added nearby results)
  console.log("\nUpdating original city counts...");
  const allCities = await prisma.city.findMany();
  for (const c of allCities) {
    const count = await prisma.facility.count({
      where: { city: c.name, state: c.state },
    });
    if (count !== c.facilityCount) {
      await prisma.city.update({
        where: { id: c.id },
        data: { facilityCount: count },
      });
      console.log(`  Updated ${c.name}, ${c.state}: ${c.facilityCount} → ${count}`);
    }
  }

  // ============================================================
  // Summary
  // ============================================================

  console.log("\n" + "=".repeat(60));
  console.log("EXPANSION COMPLETE");
  console.log("=".repeat(60));
  console.log(`  New facilities created: ${totalCreated}`);
  console.log(`  Skipped (errors): ${totalSkipped}`);
  console.log(`  Duplicates filtered: ${totalDuplicates}`);
  console.log(`  Cities processed: ${UNIQUE_CITIES.length}`);
  console.log(`  ${costTracker.summary()}`);
  console.log("=".repeat(60));
}

seedExpansion()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nFATAL ERROR:", err);
    process.exit(1);
  });
