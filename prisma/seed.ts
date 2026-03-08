/**
 * AutoVault — Google Places API Seeder
 *
 * Seeds the database with car storage facilities from Google Places (New) API.
 *
 * Budget: $100 max
 *   - Text Search (New):  ~$32 / 1,000 requests
 *   - Place Photo (New):  ~$7  / 1,000 requests
 *   - Plan: ~2,000 text searches + ~1,000 photo fetches ≈ $71
 *
 * Target: 2,000–3,000 facilities across 50 US cities.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import slugify from "slugify";
import {
  searchPlaces,
  getPhotoUrls,
  CostTracker,
  type PlaceResult,
} from "../src/lib/google-places";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ================================================================
// 50 largest US cities with lat/lng
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
  { name: "New York", state: "NY", stateSlug: "new-york", lat: 40.7128, lng: -74.006, population: 8336817 },
  { name: "Los Angeles", state: "CA", stateSlug: "california", lat: 34.0522, lng: -118.2437, population: 3979576 },
  { name: "Chicago", state: "IL", stateSlug: "illinois", lat: 41.8781, lng: -87.6298, population: 2693976 },
  { name: "Houston", state: "TX", stateSlug: "texas", lat: 29.7604, lng: -95.3698, population: 2320268 },
  { name: "Phoenix", state: "AZ", stateSlug: "arizona", lat: 33.4484, lng: -112.074, population: 1680992 },
  { name: "Philadelphia", state: "PA", stateSlug: "pennsylvania", lat: 39.9526, lng: -75.1652, population: 1603797 },
  { name: "San Antonio", state: "TX", stateSlug: "texas", lat: 29.4241, lng: -98.4936, population: 1547253 },
  { name: "San Diego", state: "CA", stateSlug: "california", lat: 32.7157, lng: -117.1611, population: 1423851 },
  { name: "Dallas", state: "TX", stateSlug: "texas", lat: 32.7767, lng: -96.797, population: 1343573 },
  { name: "San Jose", state: "CA", stateSlug: "california", lat: 37.3382, lng: -121.8863, population: 1021795 },
  { name: "Austin", state: "TX", stateSlug: "texas", lat: 30.2672, lng: -97.7431, population: 978908 },
  { name: "Jacksonville", state: "FL", stateSlug: "florida", lat: 30.3322, lng: -81.6557, population: 949611 },
  { name: "Fort Worth", state: "TX", stateSlug: "texas", lat: 32.7555, lng: -97.3308, population: 918915 },
  { name: "Columbus", state: "OH", stateSlug: "ohio", lat: 39.9612, lng: -82.9988, population: 905748 },
  { name: "Charlotte", state: "NC", stateSlug: "north-carolina", lat: 35.2271, lng: -80.8431, population: 874579 },
  { name: "Indianapolis", state: "IN", stateSlug: "indiana", lat: 39.7684, lng: -86.1581, population: 876384 },
  { name: "San Francisco", state: "CA", stateSlug: "california", lat: 37.7749, lng: -122.4194, population: 873965 },
  { name: "Seattle", state: "WA", stateSlug: "washington", lat: 47.6062, lng: -122.3321, population: 737015 },
  { name: "Denver", state: "CO", stateSlug: "colorado", lat: 39.7392, lng: -104.9903, population: 715522 },
  { name: "Washington", state: "DC", stateSlug: "district-of-columbia", lat: 38.9072, lng: -77.0369, population: 689545 },
  { name: "Nashville", state: "TN", stateSlug: "tennessee", lat: 36.1627, lng: -86.7816, population: 689447 },
  { name: "Oklahoma City", state: "OK", stateSlug: "oklahoma", lat: 35.4676, lng: -97.5164, population: 681054 },
  { name: "El Paso", state: "TX", stateSlug: "texas", lat: 31.7619, lng: -106.485, population: 678815 },
  { name: "Boston", state: "MA", stateSlug: "massachusetts", lat: 42.3601, lng: -71.0589, population: 675647 },
  { name: "Portland", state: "OR", stateSlug: "oregon", lat: 45.5152, lng: -122.6784, population: 652503 },
  { name: "Las Vegas", state: "NV", stateSlug: "nevada", lat: 36.1699, lng: -115.1398, population: 641903 },
  { name: "Memphis", state: "TN", stateSlug: "tennessee", lat: 35.1495, lng: -90.049, population: 633104 },
  { name: "Louisville", state: "KY", stateSlug: "kentucky", lat: 38.2527, lng: -85.7585, population: 633045 },
  { name: "Baltimore", state: "MD", stateSlug: "maryland", lat: 39.2904, lng: -76.6122, population: 585708 },
  { name: "Milwaukee", state: "WI", stateSlug: "wisconsin", lat: 43.0389, lng: -87.9065, population: 577222 },
  { name: "Albuquerque", state: "NM", stateSlug: "new-mexico", lat: 35.0844, lng: -106.6504, population: 564559 },
  { name: "Tucson", state: "AZ", stateSlug: "arizona", lat: 32.2226, lng: -110.9747, population: 542629 },
  { name: "Fresno", state: "CA", stateSlug: "california", lat: 36.7378, lng: -119.7871, population: 542107 },
  { name: "Sacramento", state: "CA", stateSlug: "california", lat: 38.5816, lng: -121.4944, population: 524943 },
  { name: "Mesa", state: "AZ", stateSlug: "arizona", lat: 33.4152, lng: -111.8315, population: 504258 },
  { name: "Kansas City", state: "MO", stateSlug: "missouri", lat: 39.0997, lng: -94.5786, population: 508090 },
  { name: "Atlanta", state: "GA", stateSlug: "georgia", lat: 33.749, lng: -84.388, population: 498715 },
  { name: "Omaha", state: "NE", stateSlug: "nebraska", lat: 41.2565, lng: -95.9345, population: 486051 },
  { name: "Colorado Springs", state: "CO", stateSlug: "colorado", lat: 38.8339, lng: -104.8214, population: 478221 },
  { name: "Raleigh", state: "NC", stateSlug: "north-carolina", lat: 35.7796, lng: -78.6382, population: 467665 },
  { name: "Long Beach", state: "CA", stateSlug: "california", lat: 33.7701, lng: -118.1937, population: 466742 },
  { name: "Virginia Beach", state: "VA", stateSlug: "virginia", lat: 36.8529, lng: -75.978, population: 459470 },
  { name: "Miami", state: "FL", stateSlug: "florida", lat: 25.7617, lng: -80.1918, population: 442241 },
  { name: "Oakland", state: "CA", stateSlug: "california", lat: 37.8044, lng: -122.2712, population: 433031 },
  { name: "Minneapolis", state: "MN", stateSlug: "minnesota", lat: 44.9778, lng: -93.265, population: 429954 },
  { name: "Tampa", state: "FL", stateSlug: "florida", lat: 27.9506, lng: -82.4572, population: 399700 },
  { name: "Tulsa", state: "OK", stateSlug: "oklahoma", lat: 36.154, lng: -95.9928, population: 413066 },
  { name: "Arlington", state: "TX", stateSlug: "texas", lat: 32.7357, lng: -97.1081, population: 394266 },
  { name: "New Orleans", state: "LA", stateSlug: "louisiana", lat: 29.9511, lng: -90.0715, population: 383997 },
  { name: "Wichita", state: "KS", stateSlug: "kansas", lat: 37.6872, lng: -97.3301, population: 397532 },
];

// ================================================================
// Search queries to cover all car storage types
// ================================================================

const SEARCH_QUERIES = [
  "car storage facility",
  "vehicle storage",
  "luxury car storage",
  "exotic car storage",
  "classic car storage",
];

// ================================================================
// Categorization helpers
// ================================================================

const LUXURY_KEYWORDS = [
  "luxury",
  "exotic",
  "classic",
  "collector",
  "concours",
  "premium",
  "vault",
  "museum",
  "prestige",
  "elite",
  "bespoke",
  "boutique",
  "supercar",
  "hypercar",
];

function detectVehicleTypes(name: string, types?: string[]): string[] {
  const lower = name.toLowerCase();
  const vehicleTypes: Set<string> = new Set(["CAR"]);

  if (/\b(exotic|supercar|hypercar|lambo|ferrari|porsche)\b/i.test(lower)) {
    vehicleTypes.add("EXOTIC");
  }
  if (/\b(classic|vintage|antique|collector|concours|museum)\b/i.test(lower)) {
    vehicleTypes.add("CLASSIC");
  }
  if (/\b(rv|motorhome|camper)\b/i.test(lower)) {
    vehicleTypes.add("RV");
  }
  if (/\b(boat|marine|yacht)\b/i.test(lower)) {
    vehicleTypes.add("BOAT");
  }
  if (/\b(motorcycle|bike|moto)\b/i.test(lower)) {
    vehicleTypes.add("MOTORCYCLE");
  }
  if (/\b(truck|pickup)\b/i.test(lower)) {
    vehicleTypes.add("TRUCK");
  }
  if (/\b(trailer)\b/i.test(lower)) {
    vehicleTypes.add("TRAILER");
  }

  return Array.from(vehicleTypes);
}

function detectStorageTypes(name: string): string[] {
  const lower = name.toLowerCase();
  const storageTypes: Set<string> = new Set();

  const isLuxury = LUXURY_KEYWORDS.some((kw) => lower.includes(kw));

  if (isLuxury || /\b(climate|heated|cooled|temperature)\b/i.test(lower)) {
    storageTypes.add("CLIMATE_CONTROLLED");
    storageTypes.add("INDOOR");
  }

  if (/\b(indoor|enclosed|garage|warehouse|vault)\b/i.test(lower)) {
    storageTypes.add("INDOOR");
  }

  if (/\b(outdoor|lot|open)\b/i.test(lower)) {
    storageTypes.add("OUTDOOR");
  }

  if (/\b(covered|canopy|carport)\b/i.test(lower)) {
    storageTypes.add("COVERED");
  }

  if (/\b(enclosed)\b/i.test(lower)) {
    storageTypes.add("ENCLOSED");
  }

  // Default: if nothing detected, assume indoor
  if (storageTypes.size === 0) {
    storageTypes.add("INDOOR");
  }

  return Array.from(storageTypes);
}

function detectAmenities(name: string): string[] {
  const lower = name.toLowerCase();
  const amenities: Set<string> = new Set();

  const isLuxury = LUXURY_KEYWORDS.some((kw) => lower.includes(kw));

  // Luxury facilities typically have these
  if (isLuxury) {
    amenities.add("SECURITY_CAMERAS");
    amenities.add("GATED");
    amenities.add("CLIMATE_MONITORING");
    amenities.add("FIRE_SUPPRESSION");
  }

  if (/\b(24.?hr|24.?hour|24\/7)\b/i.test(lower)) {
    amenities.add("ACCESS_24HR");
  }
  if (/\b(ev|electric|charging|tesla)\b/i.test(lower)) {
    amenities.add("EV_CHARGING");
  }
  if (/\b(concierge|valet)\b/i.test(lower)) {
    amenities.add("CONCIERGE");
  }
  if (/\b(detail|detailing|wash)\b/i.test(lower)) {
    amenities.add("DETAILING");
  }
  if (/\b(transport|shipping|enclosed.?transport)\b/i.test(lower)) {
    amenities.add("TRANSPORT");
  }

  return Array.from(amenities);
}

// ================================================================
// Address parsing — extract city, state, zip from formatted address
// ================================================================

interface ParsedAddress {
  city: string;
  state: string;
  zip?: string;
}

function parseAddress(
  formattedAddress: string,
  fallbackCity: string,
  fallbackState: string
): ParsedAddress {
  // Google formatted address pattern: "123 Main St, City, ST 12345, USA"
  const parts = formattedAddress.split(",").map((s) => s.trim());

  if (parts.length >= 3) {
    const city = parts[parts.length - 3] || fallbackCity;
    const stateZip = parts[parts.length - 2] || "";
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/);

    if (stateZipMatch) {
      return {
        city,
        state: stateZipMatch[1],
        zip: stateZipMatch[2] || undefined,
      };
    }
  }

  // Fallback: try to find state code anywhere
  const stateMatch = formattedAddress.match(/\b([A-Z]{2})\s+(\d{5})\b/);
  if (stateMatch) {
    // Walk backward from state to find city
    const beforeState = formattedAddress.slice(
      0,
      formattedAddress.indexOf(stateMatch[0])
    );
    const cityParts = beforeState.split(",").map((s) => s.trim());
    const city = cityParts[cityParts.length - 1] || fallbackCity;

    return {
      city,
      state: stateMatch[1],
      zip: stateMatch[2],
    };
  }

  return { city: fallbackCity, state: fallbackState };
}

// ================================================================
// Slug generation
// ================================================================

function makeSlug(name: string, city: string, state: string): string {
  const base = slugify(`${name} ${city} ${state}`, {
    lower: true,
    strict: true,
    trim: true,
  });
  return base || `facility-${Date.now()}`;
}

function makeCitySlug(name: string, state: string): string {
  return slugify(`${name} ${state}`, {
    lower: true,
    strict: true,
    trim: true,
  });
}

// ================================================================
// Main seeder
// ================================================================

async function seed() {
  console.log("=".repeat(60));
  console.log("AutoVault — Google Places Seeder");
  console.log("=".repeat(60));
  console.log();

  const costTracker = new CostTracker(95); // leave $5 buffer under $100
  const seenPlaceIds = new Set<string>();
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalDuplicates = 0;

  // Track facilities per city for City record updates
  const cityFacilityCounts = new Map<string, number>();

  for (let i = 0; i < CITIES.length; i++) {
    const city = CITIES[i];
    const cityKey = `${city.name}-${city.state}`;

    console.log(
      `\n[${ i + 1}/${CITIES.length}] ${city.name}, ${city.state} (pop: ${city.population.toLocaleString()})`
    );
    console.log("-".repeat(50));

    if (costTracker.isOverBudget) {
      console.log("[BUDGET] Stopping — budget limit reached.");
      console.log(costTracker.summary());
      break;
    }

    const cityResults: PlaceResult[] = [];

    // Search each query
    for (const query of SEARCH_QUERIES) {
      if (costTracker.isOverBudget) break;

      console.log(`  Searching: "${query}" near ${city.name}...`);

      const results = await searchPlaces(
        `${query} in ${city.name}, ${city.state}`,
        { lat: city.lat, lng: city.lng, radiusMeters: 80000 },
        costTracker,
        20
      );

      console.log(`    Found ${results.length} results`);

      for (const result of results) {
        if (!seenPlaceIds.has(result.googlePlaceId)) {
          seenPlaceIds.add(result.googlePlaceId);
          cityResults.push(result);
        } else {
          totalDuplicates++;
        }
      }
    }

    console.log(
      `  Unique facilities for ${city.name}: ${cityResults.length} (${totalDuplicates} total dupes skipped)`
    );

    // Insert facilities
    let cityCreated = 0;

    for (const place of cityResults) {
      if (costTracker.isOverBudget) break;

      // Skip places without a proper name or address
      if (!place.name || place.name === "Unknown" || !place.formattedAddress) {
        totalSkipped++;
        continue;
      }

      // Skip closed businesses
      if (
        place.businessStatus &&
        place.businessStatus !== "OPERATIONAL"
      ) {
        totalSkipped++;
        continue;
      }

      // Check if already in DB (by googlePlaceId)
      const existing = await prisma.facility.findUnique({
        where: { googlePlaceId: place.googlePlaceId },
      });
      if (existing) {
        totalSkipped++;
        continue;
      }

      // Parse address components
      const parsed = parseAddress(
        place.formattedAddress,
        city.name,
        city.state
      );

      // Generate slug (ensure uniqueness)
      let slug = makeSlug(place.name, parsed.city, parsed.state);
      const existingSlug = await prisma.facility.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        slug = `${slug}-${place.googlePlaceId.slice(-6)}`;
      }

      // Detect categorization from name
      const vehicleTypes = detectVehicleTypes(place.name, place.types);
      const storageTypes = detectStorageTypes(place.name);
      const amenities = detectAmenities(place.name);

      // Determine tier — luxury keywords get VERIFIED
      const isLuxury = LUXURY_KEYWORDS.some((kw) =>
        place.name.toLowerCase().includes(kw)
      );

      // Fetch photos (limit to 2 per facility to conserve budget)
      let photoUrls: string[] = [];
      if (place.photoReferences.length > 0 && !costTracker.isOverBudget) {
        photoUrls = await getPhotoUrls(
          place.photoReferences,
          costTracker,
          2, // max 2 photos per facility
          800
        );
      }

      try {
        const facility = await prisma.facility.create({
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
          console.log(
            `    [PROGRESS] ${totalCreated} facilities created | ${costTracker.summary()}`
          );
        }
      } catch (err: any) {
        // Handle unique constraint violations gracefully
        if (err?.code === "P2002") {
          totalSkipped++;
          continue;
        }
        console.error(`    [ERROR] Failed to create ${place.name}: ${err.message}`);
        totalSkipped++;
      }
    }

    // Track city counts
    cityFacilityCounts.set(cityKey, cityCreated);

    console.log(
      `  Created ${cityCreated} facilities in ${city.name}, ${city.state}`
    );
  }

  // ============================================================
  // Upsert City records
  // ============================================================

  console.log("\n" + "=".repeat(60));
  console.log("Upserting City records...");
  console.log("=".repeat(60));

  for (const cityDef of CITIES) {
    const citySlug = makeCitySlug(cityDef.name, cityDef.state);
    const cityKey = `${cityDef.name}-${cityDef.state}`;

    // Count actual facilities in this city from DB
    const facilityCount = await prisma.facility.count({
      where: {
        city: cityDef.name,
        state: cityDef.state,
      },
    });

    // Also match nearby cities that Google might have returned
    const stateCount = await prisma.facility.count({
      where: {
        state: cityDef.state,
      },
    });

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

    console.log(
      `  ${cityDef.name}, ${cityDef.state}: ${facilityCount} facilities`
    );
  }

  // ============================================================
  // Final summary
  // ============================================================

  console.log("\n" + "=".repeat(60));
  console.log("SEED COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Facilities created: ${totalCreated}`);
  console.log(`  Facilities skipped: ${totalSkipped}`);
  console.log(`  Duplicates filtered: ${totalDuplicates}`);
  console.log(`  Cities seeded: ${CITIES.length}`);
  console.log(`  ${costTracker.summary()}`);
  console.log("=".repeat(60));
}

// ================================================================
// Entry point
// ================================================================

seed()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nFATAL ERROR:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
