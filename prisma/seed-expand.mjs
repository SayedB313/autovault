/**
 * AutoVault — Expansion Seeder (Wave 2) — Plain JS with pg
 *
 * Adds facilities from 75 more US cities (#51-125 by population).
 * 1 photo per facility. Skips existing googlePlaceIds.
 *
 * Usage: node prisma/seed-expand.mjs
 */

import pg from "pg";
const { Client } = pg;

const DB_URL = process.env.DATABASE_URL;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!DB_URL || !API_KEY) {
  console.error("Missing DATABASE_URL or GOOGLE_PLACES_API_KEY");
  process.exit(1);
}

// ================================================================
// Cities #51-125
// ================================================================

const CITIES = [
  { name: "Bakersfield", state: "CA", stateSlug: "california", lat: 35.3733, lng: -119.0187, pop: 403455 },
  { name: "Aurora", state: "CO", stateSlug: "colorado", lat: 39.7294, lng: -104.8319, pop: 386261 },
  { name: "Anaheim", state: "CA", stateSlug: "california", lat: 33.8366, lng: -117.9143, pop: 350365 },
  { name: "Riverside", state: "CA", stateSlug: "california", lat: 33.9534, lng: -117.3962, pop: 314998 },
  { name: "Corpus Christi", state: "TX", stateSlug: "texas", lat: 27.8006, lng: -97.3964, pop: 317863 },
  { name: "Lexington", state: "KY", stateSlug: "kentucky", lat: 38.0406, lng: -84.5037, pop: 322570 },
  { name: "Henderson", state: "NV", stateSlug: "nevada", lat: 36.0395, lng: -114.9817, pop: 320189 },
  { name: "Stockton", state: "CA", stateSlug: "california", lat: 37.9577, lng: -121.2908, pop: 320804 },
  { name: "St. Paul", state: "MN", stateSlug: "minnesota", lat: 44.9537, lng: -93.09, pop: 311527 },
  { name: "Cincinnati", state: "OH", stateSlug: "ohio", lat: 39.1031, lng: -84.512, pop: 309317 },
  { name: "Pittsburgh", state: "PA", stateSlug: "pennsylvania", lat: 40.4406, lng: -79.9959, pop: 302971 },
  { name: "Greensboro", state: "NC", stateSlug: "north-carolina", lat: 36.0726, lng: -79.792, pop: 299035 },
  { name: "Anchorage", state: "AK", stateSlug: "alaska", lat: 61.2181, lng: -149.9003, pop: 291247 },
  { name: "Plano", state: "TX", stateSlug: "texas", lat: 33.0198, lng: -96.6989, pop: 285494 },
  { name: "Lincoln", state: "NE", stateSlug: "nebraska", lat: 40.8136, lng: -96.7026, pop: 291082 },
  { name: "Orlando", state: "FL", stateSlug: "florida", lat: 28.5383, lng: -81.3792, pop: 307573 },
  { name: "Irvine", state: "CA", stateSlug: "california", lat: 33.6846, lng: -117.8265, pop: 307670 },
  { name: "Newark", state: "NJ", stateSlug: "new-jersey", lat: 40.7357, lng: -74.1724, pop: 311549 },
  { name: "Durham", state: "NC", stateSlug: "north-carolina", lat: 35.994, lng: -78.8986, pop: 283506 },
  { name: "Chula Vista", state: "CA", stateSlug: "california", lat: 32.6401, lng: -117.0842, pop: 275487 },
  { name: "Toledo", state: "OH", stateSlug: "ohio", lat: 41.6528, lng: -83.5379, pop: 270871 },
  { name: "Fort Wayne", state: "IN", stateSlug: "indiana", lat: 41.0793, lng: -85.1394, pop: 263886 },
  { name: "St. Petersburg", state: "FL", stateSlug: "florida", lat: 27.7676, lng: -82.6403, pop: 258308 },
  { name: "Laredo", state: "TX", stateSlug: "texas", lat: 27.5036, lng: -99.5076, pop: 255205 },
  { name: "Jersey City", state: "NJ", stateSlug: "new-jersey", lat: 40.7178, lng: -74.0431, pop: 292449 },
  { name: "Chandler", state: "AZ", stateSlug: "arizona", lat: 33.3062, lng: -111.8413, pop: 275987 },
  { name: "Madison", state: "WI", stateSlug: "wisconsin", lat: 43.0731, lng: -89.4012, pop: 269840 },
  { name: "Lubbock", state: "TX", stateSlug: "texas", lat: 33.5779, lng: -101.8552, pop: 263930 },
  { name: "Scottsdale", state: "AZ", stateSlug: "arizona", lat: 33.4942, lng: -111.9261, pop: 241361 },
  { name: "Reno", state: "NV", stateSlug: "nevada", lat: 39.5296, lng: -119.8138, pop: 264165 },
  { name: "Buffalo", state: "NY", stateSlug: "new-york", lat: 42.8864, lng: -78.8784, pop: 278349 },
  { name: "Gilbert", state: "AZ", stateSlug: "arizona", lat: 33.3528, lng: -111.789, pop: 267918 },
  { name: "Glendale", state: "AZ", stateSlug: "arizona", lat: 33.5387, lng: -112.186, pop: 248325 },
  { name: "North Las Vegas", state: "NV", stateSlug: "nevada", lat: 36.1989, lng: -115.1175, pop: 262527 },
  { name: "Winston-Salem", state: "NC", stateSlug: "north-carolina", lat: 36.0999, lng: -80.2442, pop: 249545 },
  { name: "Chesapeake", state: "VA", stateSlug: "virginia", lat: 36.7682, lng: -76.2875, pop: 249422 },
  { name: "Norfolk", state: "VA", stateSlug: "virginia", lat: 36.8508, lng: -76.2859, pop: 238005 },
  { name: "Fremont", state: "CA", stateSlug: "california", lat: 37.5485, lng: -121.9886, pop: 230504 },
  { name: "Irving", state: "TX", stateSlug: "texas", lat: 32.814, lng: -96.9489, pop: 256684 },
  { name: "Richmond", state: "VA", stateSlug: "virginia", lat: 37.5407, lng: -77.436, pop: 226610 },
  { name: "Boise", state: "ID", stateSlug: "idaho", lat: 43.615, lng: -116.2023, pop: 235684 },
  { name: "Spokane", state: "WA", stateSlug: "washington", lat: 47.6588, lng: -117.426, pop: 228989 },
  { name: "Des Moines", state: "IA", stateSlug: "iowa", lat: 41.5868, lng: -93.625, pop: 214133 },
  { name: "Montgomery", state: "AL", stateSlug: "alabama", lat: 32.3668, lng: -86.3, pop: 200603 },
  { name: "Modesto", state: "CA", stateSlug: "california", lat: 37.6391, lng: -120.9969, pop: 218464 },
  { name: "Fayetteville", state: "NC", stateSlug: "north-carolina", lat: 35.0527, lng: -78.8784, pop: 208501 },
  { name: "Tacoma", state: "WA", stateSlug: "washington", lat: 47.2529, lng: -122.4443, pop: 219346 },
  { name: "Shreveport", state: "LA", stateSlug: "louisiana", lat: 32.5252, lng: -93.7502, pop: 187593 },
  { name: "Fontana", state: "CA", stateSlug: "california", lat: 34.0922, lng: -117.435, pop: 214547 },
  { name: "Moreno Valley", state: "CA", stateSlug: "california", lat: 33.9425, lng: -117.2297, pop: 212477 },
  { name: "Rochester", state: "NY", stateSlug: "new-york", lat: 43.1566, lng: -77.6088, pop: 211328 },
  { name: "Worcester", state: "MA", stateSlug: "massachusetts", lat: 42.2626, lng: -71.8023, pop: 206518 },
  { name: "Port St. Lucie", state: "FL", stateSlug: "florida", lat: 27.2939, lng: -80.3503, pop: 204851 },
  { name: "Little Rock", state: "AR", stateSlug: "arkansas", lat: 34.7465, lng: -92.2896, pop: 202591 },
  { name: "Augusta", state: "GA", stateSlug: "georgia", lat: 33.4735, lng: -81.9748, pop: 202081 },
  { name: "Oxnard", state: "CA", stateSlug: "california", lat: 34.1975, lng: -119.1771, pop: 202063 },
  { name: "Knoxville", state: "TN", stateSlug: "tennessee", lat: 35.9606, lng: -83.9207, pop: 190740 },
  { name: "Birmingham", state: "AL", stateSlug: "alabama", lat: 33.5207, lng: -86.8025, pop: 200733 },
  { name: "Salt Lake City", state: "UT", stateSlug: "utah", lat: 40.7608, lng: -111.891, pop: 199723 },
  { name: "Amarillo", state: "TX", stateSlug: "texas", lat: 35.222, lng: -101.8313, pop: 199826 },
  { name: "Grand Rapids", state: "MI", stateSlug: "michigan", lat: 42.9634, lng: -85.6681, pop: 198917 },
  { name: "Huntsville", state: "AL", stateSlug: "alabama", lat: 34.7304, lng: -86.5861, pop: 215006 },
  { name: "Tallahassee", state: "FL", stateSlug: "florida", lat: 30.4383, lng: -84.2807, pop: 196169 },
  { name: "Overland Park", state: "KS", stateSlug: "kansas", lat: 38.9822, lng: -94.6708, pop: 197238 },
  { name: "Brownsville", state: "TX", stateSlug: "texas", lat: 25.9017, lng: -97.4975, pop: 186738 },
  { name: "Chattanooga", state: "TN", stateSlug: "tennessee", lat: 35.0456, lng: -85.3097, pop: 181099 },
  { name: "Providence", state: "RI", stateSlug: "rhode-island", lat: 41.824, lng: -71.4128, pop: 190934 },
  { name: "Newport News", state: "VA", stateSlug: "virginia", lat: 37.0871, lng: -76.473, pop: 186247 },
  { name: "Mobile", state: "AL", stateSlug: "alabama", lat: 30.6954, lng: -88.0399, pop: 187041 },
  { name: "Fayetteville", state: "AR", stateSlug: "arkansas", lat: 36.0822, lng: -94.1719, pop: 93949 },
  { name: "Savannah", state: "GA", stateSlug: "georgia", lat: 32.0809, lng: -81.0912, pop: 147780 },
  { name: "Baton Rouge", state: "LA", stateSlug: "louisiana", lat: 30.4515, lng: -91.1871, pop: 227470 },
  { name: "Akron", state: "OH", stateSlug: "ohio", lat: 41.0814, lng: -81.519, pop: 190469 },
  { name: "Tempe", state: "AZ", stateSlug: "arizona", lat: 33.4255, lng: -111.94, pop: 180587 },
  { name: "Cary", state: "NC", stateSlug: "north-carolina", lat: 35.7915, lng: -78.7811, pop: 174721 },
];

const SEARCH_QUERIES = [
  "car storage facility",
  "vehicle storage",
  "luxury car storage",
  "exotic car storage",
  "classic car storage",
];

const LUXURY_KW = ["luxury","exotic","classic","collector","concours","premium","vault","museum","prestige","elite","boutique","supercar","hypercar"];

// ================================================================
// Cost tracking
// ================================================================
let textSearches = 0, photoFetches = 0;
const BUDGET = 35;
function cost() { return (textSearches / 1000) * 32 + (photoFetches / 1000) * 7; }
function overBudget() { return cost() >= BUDGET; }
function costSummary() { return `Searches: ${textSearches} | Photos: ${photoFetches} | Cost: $${cost().toFixed(2)}/$${BUDGET}`; }

// ================================================================
// Rate limiting
// ================================================================
let lastReq = 0;
async function rl() {
  const now = Date.now(), d = now - lastReq;
  if (d < 200) await new Promise(r => setTimeout(r, 200 - d));
  lastReq = Date.now();
}

// ================================================================
// Google Places API
// ================================================================
async function searchPlaces(query, lat, lng) {
  if (overBudget()) return [];
  await rl();
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours,places.types,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 50000 } },
      maxResultCount: 20,
      languageCode: "en",
    }),
  });
  textSearches++;
  if (!res.ok) { console.error(`  API ${res.status}`); return []; }
  const data = await res.json();
  return (data.places || [])
    .filter(p => p.businessStatus !== "CLOSED_PERMANENTLY")
    .map(p => {
      let hours = null;
      if (p.regularOpeningHours?.weekdayDescriptions) {
        hours = JSON.stringify(Object.fromEntries(
          p.regularOpeningHours.weekdayDescriptions.map(d => {
            const [day, ...rest] = d.split(": ");
            return [day, rest.join(": ") || "Closed"];
          })
        ));
      }
      return {
        gid: p.id,
        name: p.displayName?.text || "Unknown",
        addr: p.formattedAddress || "",
        lat: p.location?.latitude || 0,
        lng: p.location?.longitude || 0,
        phone: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        rating: p.rating || 0,
        reviews: p.userRatingCount || 0,
        photoRefs: (p.photos || []).map(ph => ph.name).filter(Boolean),
        hours,
      };
    });
}

async function getPhotoUrl(ref) {
  if (overBudget()) return null;
  await rl();
  try {
    const res = await fetch(`https://places.googleapis.com/v1/${ref}/media?maxWidthPx=800&key=${API_KEY}`, { redirect: "follow" });
    photoFetches++;
    return res.ok ? res.url : null;
  } catch { return null; }
}

// ================================================================
// Helpers
// ================================================================
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseAddr(addr, fallbackCity, fallbackState) {
  const m = addr.match(/\b([A-Z]{2})\s+(\d{5})\b/);
  if (m) {
    const before = addr.slice(0, addr.indexOf(m[0]));
    const parts = before.split(",").map(s => s.trim());
    return { city: parts[parts.length - 1] || fallbackCity, state: m[1], zip: m[2] };
  }
  return { city: fallbackCity, state: fallbackState, zip: null };
}

function detectStorage(name) {
  const l = name.toLowerCase();
  const t = new Set(["INDOOR"]);
  if (/\b(outdoor|open.?air|lot)\b/.test(l)) { t.delete("INDOOR"); t.add("OUTDOOR"); }
  if (/\b(climate|temperature|humidity)\b/.test(l)) t.add("CLIMATE_CONTROLLED");
  if (/\b(covered|carport)\b/.test(l)) t.add("COVERED");
  if (/\b(enclosed|private)\b/.test(l)) t.add("ENCLOSED");
  return [...t];
}

function detectVehicle(name) {
  const l = name.toLowerCase();
  const t = new Set(["CAR"]);
  if (/\b(exotic|supercar|hypercar|ferrari|lambo|porsche)\b/.test(l)) t.add("EXOTIC");
  if (/\b(classic|vintage|antique|collector)\b/.test(l)) t.add("CLASSIC");
  if (/\b(rv|motorhome|camper)\b/.test(l)) t.add("RV");
  if (/\b(boat|marine|yacht)\b/.test(l)) t.add("BOAT");
  if (/\b(motorcycle|bike)\b/.test(l)) t.add("MOTORCYCLE");
  if (/\b(truck|trailer)\b/.test(l)) { t.add("TRUCK"); t.add("TRAILER"); }
  return [...t];
}

function detectAmenities(name) {
  const l = name.toLowerCase(), a = [];
  if (/24.?(hr|hour|7)/.test(l)) a.push("ACCESS_24HR");
  if (/camera|cctv|surveillance/.test(l)) a.push("SECURITY_CAMERAS");
  if (/gate[d]?|fenc/.test(l)) a.push("GATED");
  if (/climate|temperature/.test(l)) a.push("CLIMATE_MONITORING");
  if (/fire|sprinkler/.test(l)) a.push("FIRE_SUPPRESSION");
  if (/ev.?charg/.test(l)) a.push("EV_CHARGING");
  if (/concierge|valet/.test(l)) a.push("CONCIERGE");
  if (/detail|wash|clean/.test(l)) a.push("DETAILING");
  return a;
}

// ================================================================
// Main
// ================================================================
async function main() {
  const db = new Client({ connectionString: DB_URL });
  await db.connect();
  console.log("============================================================");
  console.log(`AutoVault Expansion — ${CITIES.length} cities, 1 photo/facility, $${BUDGET} budget`);
  console.log("============================================================\n");

  // Load existing place IDs
  const existing = await db.query(`SELECT "googlePlaceId" FROM "Facility" WHERE "googlePlaceId" IS NOT NULL`);
  const existingIds = new Set(existing.rows.map(r => r.googlePlaceId));
  console.log(`Loaded ${existingIds.size} existing facilities to skip.\n`);

  const seen = new Set();
  let created = 0, skipped = 0, dupes = 0;

  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    console.log(`\n[${i+1}/${CITIES.length}] ${c.name}, ${c.state}`);

    if (overBudget()) { console.log("[BUDGET] Stopping."); break; }

    const results = [];
    for (const q of SEARCH_QUERIES) {
      if (overBudget()) break;
      const places = await searchPlaces(`${q} in ${c.name}, ${c.state}`, c.lat, c.lng);
      for (const p of places) {
        if (existingIds.has(p.gid) || seen.has(p.gid)) { dupes++; continue; }
        seen.add(p.gid);
        results.push(p);
      }
    }

    console.log(`  ${results.length} new facilities`);

    for (const p of results) {
      if (overBudget()) break;
      const addr = parseAddr(p.addr, c.name, c.state);
      let slug = slugify(`${p.name} ${addr.city} ${addr.state}`);
      const slugCheck = await db.query(`SELECT id FROM "Facility" WHERE slug = $1`, [slug]);
      if (slugCheck.rows.length > 0) slug = `${slug}-${p.gid.slice(-6)}`;

      const storageTypes = detectStorage(p.name);
      const vehicleTypes = detectVehicle(p.name);
      const amenities = detectAmenities(p.name);
      const isLux = LUXURY_KW.some(kw => p.name.toLowerCase().includes(kw));

      // 1 photo max
      let photoUrl = null;
      if (p.photoRefs.length > 0 && !overBudget()) {
        photoUrl = await getPhotoUrl(p.photoRefs[0]);
      }

      try {
        const res = await db.query(`
          INSERT INTO "Facility" (
            id, slug, name, address, city, state, zip, country,
            lat, lng, phone, website, "googlePlaceId",
            "avgRating", "reviewCount", hours,
            "storageTypes", "vehicleTypes", amenities, tier,
            "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'US',
            $7, $8, $9, $10, $11,
            $12, $13, $14::jsonb,
            $15::"StorageType"[], $16::"VehicleType"[], $17::"Amenity"[], $18::"FacilityTier",
            NOW(), NOW()
          ) RETURNING id
        `, [
          slug, p.name, p.addr, addr.city, addr.state, addr.zip,
          p.lat, p.lng, p.phone, p.website, p.gid,
          p.rating, p.reviews, p.hours,
          `{${storageTypes.join(",")}}`, `{${vehicleTypes.join(",")}}`, `{${amenities.join(",")}}`,
          isLux ? "VERIFIED" : "FREE",
        ]);

        const facilityId = res.rows[0].id;

        if (photoUrl) {
          await db.query(`
            INSERT INTO "FacilityPhoto" (id, url, alt, "order", source, "facilityId", "createdAt")
            VALUES (gen_random_uuid()::text, $1, $2, 0, 'GOOGLE'::"PhotoSource", $3, NOW())
          `, [photoUrl, `${p.name} - Photo 1`, facilityId]);
        }

        created++;
        if (created % 50 === 0) console.log(`  [PROGRESS] ${created} created | ${costSummary()}`);
      } catch (err) {
        if (err.code === "23505") { skipped++; continue; } // unique violation
        console.error(`  [ERROR] ${p.name}: ${err.message}`);
        skipped++;
      }
    }
  }

  // Upsert City records
  console.log("\nUpserting city records...");
  for (const c of CITIES) {
    const citySlug = slugify(`${c.name} ${c.state}`);
    const countRes = await db.query(`SELECT COUNT(*)::int as cnt FROM "Facility" WHERE city = $1 AND state = $2`, [c.name, c.state]);
    const cnt = countRes.rows[0].cnt;
    if (cnt === 0) continue;

    await db.query(`
      INSERT INTO "City" (id, slug, name, state, "stateSlug", lat, lng, population, "facilityCount", "metaTitle", "metaDescription", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT (slug, "stateSlug") DO UPDATE SET "facilityCount" = $8, population = $7, "updatedAt" = NOW()
    `, [citySlug, c.name, c.state, c.stateSlug, c.lat, c.lng, c.pop, cnt,
        `Car Storage in ${c.name}, ${c.state} | AutoVault`,
        `Find ${cnt}+ car storage facilities in ${c.name}, ${c.state}. Compare prices, amenities, and reviews.`]);
    console.log(`  ${c.name}, ${c.state}: ${cnt} facilities`);
  }

  // Update counts for original cities too
  console.log("\nUpdating all city counts...");
  const allCities = await db.query(`SELECT id, name, state, "facilityCount" FROM "City"`);
  for (const city of allCities.rows) {
    const countRes = await db.query(`SELECT COUNT(*)::int as cnt FROM "Facility" WHERE city = $1 AND state = $2`, [city.name, city.state]);
    if (countRes.rows[0].cnt !== city.facilityCount) {
      await db.query(`UPDATE "City" SET "facilityCount" = $1, "updatedAt" = NOW() WHERE id = $2`, [countRes.rows[0].cnt, city.id]);
      console.log(`  ${city.name}, ${city.state}: ${city.facilityCount} → ${countRes.rows[0].cnt}`);
    }
  }

  console.log("\n============================================================");
  console.log("EXPANSION COMPLETE");
  console.log(`  Created: ${created} | Skipped: ${skipped} | Dupes: ${dupes}`);
  console.log(`  ${costSummary()}`);
  console.log("============================================================");

  await db.end();
}

main().catch(err => { console.error("FATAL:", err); process.exit(1); });
