/**
 * AutoVault — Canada Luxury Seeder
 * Searches Canadian cities for luxury/exotic/classic car storage only.
 * Uses luxury scoring filter inline — only premium facilities get inserted.
 *
 * Usage: GOOGLE_PLACES_API_KEY=xxx DATABASE_URL=xxx node seed-canada.mjs [--dry-run]
 */
import pg from "pg";
const { Client } = pg;

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const DB_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes("--dry-run");

if (!API_KEY) { console.error("Missing GOOGLE_PLACES_API_KEY"); process.exit(1); }
if (!DB_URL && !DRY_RUN) { console.error("Missing DATABASE_URL"); process.exit(1); }

// ================================================================
// QUERIES — Luxury-focused only
// ================================================================
const QUERIES = [
  "exotic car storage facility",
  "classic car storage",
  "luxury car storage",
  "collector car storage",
  "garage condos for cars",
  "indoor car storage climate controlled",
  "enclosed vehicle storage",
  "car vault storage",
  "motorsport storage",
  "luxury vehicle storage",
];

// ================================================================
// CANADIAN CITIES — Major metros + affluent areas
// ================================================================
const CITIES = [
  // Ontario
  "Toronto, ON", "Ottawa, ON", "Mississauga, ON", "Oakville, ON",
  "Hamilton, ON", "London, ON", "Kitchener, ON", "Windsor, ON",
  "Markham, ON", "Vaughan, ON", "Richmond Hill, ON", "Burlington, ON",
  "Barrie, ON", "Kingston, ON", "Niagara-on-the-Lake, ON",
  // British Columbia
  "Vancouver, BC", "Victoria, BC", "Kelowna, BC", "West Vancouver, BC",
  "North Vancouver, BC", "Surrey, BC", "Burnaby, BC", "Whistler, BC",
  "Langley, BC", "Abbotsford, BC",
  // Alberta
  "Calgary, AB", "Edmonton, AB", "Red Deer, AB", "Lethbridge, AB",
  "Canmore, AB",
  // Quebec
  "Montreal, QC", "Quebec City, QC", "Laval, QC", "Gatineau, QC",
  "Sherbrooke, QC", "Trois-Rivieres, QC",
  // Manitoba
  "Winnipeg, MB",
  // Saskatchewan
  "Saskatoon, SK", "Regina, SK",
  // Nova Scotia
  "Halifax, NS",
  // New Brunswick
  "Moncton, NB", "Saint John, NB",
  // Newfoundland
  "St. John's, NL",
  // PEI
  "Charlottetown, PE",
];

// Province name mapping
const PROVINCE_NAMES = {
  ON: "Ontario", BC: "British Columbia", AB: "Alberta", QC: "Quebec",
  MB: "Manitoba", SK: "Saskatchewan", NS: "Nova Scotia", NB: "New Brunswick",
  NL: "Newfoundland and Labrador", PE: "Prince Edward Island",
  NT: "Northwest Territories", YT: "Yukon", NU: "Nunavut",
};

// ================================================================
// CHAIN BLOCKLIST (includes Canadian chains)
// ================================================================
const CHAIN_BLOCKLIST = [
  "public storage", "extra space storage", "cubesmart", "life storage",
  "u-haul", "uncle bob", "securcare", "storquest", "simply self storage",
  "budget self storage", "safeguard self storage", "storage king",
  "smartstop", "istorage", "sparefoot", "sparebox", "storsmart",
  "dollar self storage", "national storage", "a-1 self storage",
  "mini mall storage", "compass self storage", "storagemart",
  "access storage", "apple self storage", "bluebird self storage",
  "sentinel storage", "dymon storage", "depotium", "cubeit",
  "make space storage", "store-n-save",
];

// ================================================================
// NAME REJECT
// ================================================================
const NAME_REJECT = /\b(shipping|transport|carrier|hauling|hauler|moving co|logistics|freight|rental[s ]|rent a|rent-a|hertz|avis|turo|dealer(?:ship)?|(?:auto |car )sales|pre-owned|preowned|detail(?:ing|er|s)|car wash|auto wash|wrap(?:s|ping)|tint(?:ing|s|ed)|ceramic coat|paint protect|cosmetic|repair(?:s|ing)?|mechanic|body shop|collision|auto body|muffler|brake[s ]|tire[s ]|transmission|oil change|tow(?:ing|s|er)|wreck(?:er|ing)?|junk(?:yard)?|scrap|salvage|impound|museum|admission|coffee|restoration|restoring|restored|insurance|realt[yor]|apartment|condo(?:minium)? (?:for |sale|rent)|(?:for |home )sale|landscap|plumbing|electric(?:al|ian)|roofing|flooring|window|door(?:s| )|hvac|pest|cleaning service|shuttle|cruise parking|valet parking|driving experience)\b/i;

// ================================================================
// LUXURY SCORING (from luxury-filter.mjs)
// ================================================================
const INSTANT_REMOVE_NAME = /\b(rv storage|rv center|rv park|boat storage|boat house|boat shed|boat yard|boatyard|marine storage|mini warehouse|mini storage|self storage|self-storage|selfstorage|budget storage)\b/i;

const INSTANT_KEEP_NAME = /\b(exotic car storage|luxury car storage|luxury vehicle storage|collector car storage|classic car storage|supercar storage|sportscar storage|exotic vehicle storage|concours garage|car vault|auto vault|autovault|motor vault|motorvault|garage condo|garagecondo|motor condo|motorcondo|toy barn|automotorplex|auto motorplex|hagerty garage|hagerty|streetside classics)\b/i;

const LUXURY_KEYWORDS = [
  { pattern: /\bexotic[s]?\b/i, score: 15 },
  { pattern: /\bluxur(?:y|ious)\b/i, score: 15 },
  { pattern: /\bcollector\b/i, score: 12 },
  { pattern: /\bclassic[s]?\b/i, score: 10 },
  { pattern: /\bpremium\b/i, score: 12 },
  { pattern: /\belite\b/i, score: 10 },
  { pattern: /\bsupercar[s]?\b/i, score: 15 },
  { pattern: /\bsportscar[s]?\b/i, score: 12 },
  { pattern: /\bmotorcar[s]?\b/i, score: 12 },
  { pattern: /\bconcours\b/i, score: 15 },
  { pattern: /\bvault\b/i, score: 10 },
  { pattern: /\bheritage\b/i, score: 8 },
  { pattern: /\bbespoke\b/i, score: 10 },
  { pattern: /\bprestige\b/i, score: 8 },
  { pattern: /\bvintage\b/i, score: 8 },
  { pattern: /\bantique\b/i, score: 5 },
];

const PREMIUM_PATTERNS = [
  { pattern: /garage condo/i, score: 15 },
  { pattern: /motor\s*club/i, score: 15 },
  { pattern: /car\s*club/i, score: 12 },
  { pattern: /auto\s*club/i, score: 12 },
  { pattern: /garage\s*suite/i, score: 15 },
  { pattern: /motor\s*plaza/i, score: 12 },
  { pattern: /motor\s*space/i, score: 10 },
  { pattern: /motor\s*plex/i, score: 12 },
  { pattern: /toy barn/i, score: 15 },
  { pattern: /paddock/i, score: 12 },
  { pattern: /hangar[s]?\b/i, score: 8 },
  { pattern: /garage town/i, score: 8 },
  { pattern: /garages of/i, score: 10 },
  { pattern: /dream garage/i, score: 10 },
  { pattern: /ultimate garage/i, score: 12 },
  { pattern: /formula garage/i, score: 10 },
];

const NEGATIVE_KEYWORDS = [
  { pattern: /\brv\b/i, score: -8 },
  { pattern: /\bboat\b/i, score: -8 },
  { pattern: /\btruck\b/i, score: -5 },
  { pattern: /\btrailer\b/i, score: -5 },
  { pattern: /\bmini warehouse/i, score: -15 },
  { pattern: /\bself[- ]?storage/i, score: -15 },
  { pattern: /\bbudget\b/i, score: -10 },
  { pattern: /\bparking lot\b/i, score: -10 },
  { pattern: /\bmotorsports?\b(?!.*(?:storage|garage|vault|barn|condo))/i, score: -3 },
];

const VEHICLE_CONTEXT = /\b(car|cars|auto|automobile|vehicle|motor(?!ola)|classic|exotic|luxury|premium|elite|collector|supercar|sportscar|motorcar|muscle car|hotrod|hot rod|garage condo|garagecondo|motor ?club|car ?club|toy barn|paddock|concours)\b/i;

function isLuxury(name) {
  const nl = name.toLowerCase();

  // Instant checks
  if (INSTANT_REMOVE_NAME.test(nl)) return false;
  if (INSTANT_KEEP_NAME.test(nl)) return true;

  // Chain blocklist
  for (const chain of CHAIN_BLOCKLIST) {
    if (nl.includes(chain)) return false;
  }

  // Name reject
  if (NAME_REJECT.test(nl)) return false;

  let score = 0;
  let hasLuxurySignal = false;

  // Luxury keywords
  for (const { pattern, score: s } of LUXURY_KEYWORDS) {
    if (pattern.test(nl)) { score += s; hasLuxurySignal = true; }
  }

  // Premium patterns
  for (const { pattern, score: s } of PREMIUM_PATTERNS) {
    if (pattern.test(nl)) { score += s; hasLuxurySignal = true; }
  }

  // Negative keywords
  for (const { pattern, score: s } of NEGATIVE_KEYWORDS) {
    if (pattern.test(nl)) score += s;
  }

  // Context
  if (VEHICLE_CONTEXT.test(nl)) score += 3;
  else score -= 10;

  // Must have luxury signal
  if (!hasLuxurySignal) score -= 5;

  return score >= 6;
}

// ================================================================
// CLASSIFY TYPES
// ================================================================
function classifyStorageTypes(name) {
  const n = name.toLowerCase();
  const types = [];
  if (/indoor|enclosed|climate/i.test(n)) types.push("INDOOR");
  if (/outdoor|open air|uncovered/i.test(n)) types.push("OUTDOOR");
  if (/covered/i.test(n)) types.push("COVERED");
  if (/climate.?control/i.test(n)) types.push("CLIMATE_CONTROLLED");
  if (/enclosed/i.test(n)) types.push("ENCLOSED");
  if (types.length === 0) types.push("INDOOR");
  return [...new Set(types)];
}

function classifyVehicleTypes(name) {
  const n = name.toLowerCase();
  const types = [];
  if (/\b(car|auto|automobile|vehicle)\b/i.test(n)) types.push("CAR");
  if (/\bclassic|collector|vintage|antique\b/i.test(n)) types.push("CLASSIC");
  if (/\bexotic|luxury|premium|elite\b/i.test(n)) types.push("EXOTIC");
  if (/\brv|motorhome|camper\b/i.test(n)) types.push("RV");
  if (/\bboat|marine|yacht\b/i.test(n)) types.push("BOAT");
  if (/\btruck\b/i.test(n)) types.push("TRUCK");
  if (/\bmotorcycle|bike\b/i.test(n)) types.push("MOTORCYCLE");
  if (types.length === 0) types.push("CAR");
  return [...new Set(types)];
}

// ================================================================
// HELPERS
// ================================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""); }

function parseAddress(place) {
  const comps = place.addressComponents || [];
  const get = (type) => { const c = comps.find(c => c.types?.includes(type)); return c ? c.longText || c.shortText || "" : ""; };
  const getShort = (type) => { const c = comps.find(c => c.types?.includes(type)); return c ? c.shortText || c.longText || "" : ""; };
  const streetNum = get("street_number");
  const route = get("route");
  const city = get("locality") || get("sublocality") || get("administrative_area_level_3");
  const state = getShort("administrative_area_level_1");
  const zip = get("postal_code");
  const address = [streetNum, route].filter(Boolean).join(" ") || place.formattedAddress?.split(",")[0] || "";
  return { address, city, state, zip };
}

// ================================================================
// GOOGLE PLACES API
// ================================================================
const FIELD_MASK = [
  "places.id", "places.displayName", "places.types",
  "places.formattedAddress", "places.addressComponents",
  "places.location", "places.nationalPhoneNumber",
  "places.websiteUri", "places.rating", "places.userRatingCount",
  "places.regularOpeningHours", "places.photos",
].join(",");

async function searchPlaces(query) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      pageSize: 20,
      includedType: "storage",
      strictTypeFiltering: true,
    }),
  });
  if (!res.ok) {
    if (res.status === 429) {
      console.log("  Rate limited, waiting 5s...");
      await sleep(5000);
      return searchPlaces(query);
    }
    console.log(`  API ${res.status}`);
    return [];
  }
  const data = await res.json();
  return data.places || [];
}

async function fetchPhotoUrl(photoName) {
  try {
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1600&maxWidthPx=1600&skipHttpRedirect=true&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.photoUri || null;
  } catch { return null; }
}

// ================================================================
// DATABASE
// ================================================================
let db;
const existingPlaceIds = new Set();

async function connectDB() {
  if (DRY_RUN) return;
  db = new Client({ connectionString: DB_URL, ssl: false });
  await db.connect();
  const { rows } = await db.query('SELECT "googlePlaceId" FROM "Facility" WHERE "googlePlaceId" IS NOT NULL');
  rows.forEach(r => existingPlaceIds.add(r.googlePlaceId));
  console.log(`Loaded ${existingPlaceIds.size} existing place IDs for dedup`);
}

async function insertFacility(f) {
  if (DRY_RUN) return "dry-run-id";
  const baseSlug = slugify(`${f.name}-${f.city}-${f.state}`);
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    try {
      const { rows } = await db.query(`
        INSERT INTO "Facility" (
          id, slug, name, address, city, state, zip, country,
          lat, lng, phone, website, "googlePlaceId",
          "avgRating", "reviewCount", hours,
          "storageTypes", "vehicleTypes", amenities, tier,
          "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'CA',
          $7, $8, $9, $10, $11,
          $12, $13, $14::jsonb,
          $15::"StorageType"[], $16::"VehicleType"[], $17::"Amenity"[], $18::"FacilityTier",
          NOW(), NOW()
        )
        ON CONFLICT ("googlePlaceId") DO NOTHING
        RETURNING id
      `, [
        slug, f.name, f.address, f.city, f.state, f.zip,
        f.lat, f.lng, f.phone, f.website, f.googlePlaceId,
        f.avgRating, f.reviewCount, JSON.stringify(f.hours),
        `{${f.storageTypes.join(",")}}`, `{${f.vehicleTypes.join(",")}}`, "{}", "FREE",
      ]);
      return rows[0]?.id || null;
    } catch (err) {
      if (err.code === "23505" && err.constraint === "Facility_slug_key") continue;
      throw err;
    }
  }
  return null;
}

async function insertPhoto(facilityId, url, alt) {
  if (DRY_RUN || !url) return;
  await db.query(`
    INSERT INTO "FacilityPhoto" (id, url, alt, "order", source, "facilityId", "createdAt")
    VALUES (gen_random_uuid()::text, $1, $2, 0, 'GOOGLE'::"PhotoSource", $3, NOW())
    ON CONFLICT DO NOTHING
  `, [url, alt, facilityId]);
}

async function upsertCity(cityName, stateAbbrev, lat, lng) {
  if (DRY_RUN) return;
  const slug = slugify(`${cityName}-${stateAbbrev}`);
  const stateName = PROVINCE_NAMES[stateAbbrev] || stateAbbrev;
  const stateSlug = slugify(stateName);
  const { rows: countRows } = await db.query(
    'SELECT COUNT(*)::int as cnt FROM "Facility" WHERE city = $1 AND state = $2',
    [cityName, stateAbbrev]
  );
  const facilityCount = countRows[0]?.cnt || 0;
  await db.query(`
    INSERT INTO "City" (id, slug, name, state, "stateSlug", lat, lng, "facilityCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    ON CONFLICT (slug) DO UPDATE SET
      "facilityCount" = $7,
      lat = COALESCE(NULLIF("City".lat, 0), $5),
      lng = COALESCE(NULLIF("City".lng, 0), $6),
      "updatedAt" = NOW()
  `, [slug, cityName, stateAbbrev, stateSlug, lat, lng, facilityCount]);
}

// ================================================================
// MAIN
// ================================================================
console.log("============================================================");
console.log(DRY_RUN ? "CANADA LUXURY SEEDER — DRY RUN" : "CANADA LUXURY SEEDER — LIVE");
console.log("============================================================");
console.log(`Queries: ${QUERIES.length}`);
console.log(`Cities: ${CITIES.length}`);
console.log(`Max API calls: ${QUERIES.length * CITIES.length} (search) + photos`);
console.log(`Est. search cost: $${(QUERIES.length * CITIES.length * 0.040).toFixed(2)}`);
console.log();

await connectDB();

const seen = new Set();
let apiCalls = 0;
let photoCalls = 0;
let totalInserted = 0;
let totalSkippedExisting = 0;
let totalSkippedFiltered = 0;
const citiesWithNew = new Set();

for (let ci = 0; ci < CITIES.length; ci++) {
  const city = CITIES[ci];
  const pct = Math.round(((ci + 1) / CITIES.length) * 100);
  process.stdout.write(`[${ci + 1}/${CITIES.length} ${pct}%] ${city} `);

  let cityInserted = 0;
  let cityLat = 0, cityLng = 0;

  for (const q of QUERIES) {
    const places = await searchPlaces(`${q} in ${city}, Canada`);
    apiCalls++;
    await sleep(200);

    for (const p of places) {
      const placeId = p.id;
      if (seen.has(placeId)) continue;
      seen.add(placeId);

      if (existingPlaceIds.has(placeId)) { totalSkippedExisting++; continue; }

      const name = p.displayName?.text || "";

      // LUXURY FILTER — only insert if it passes
      if (!isLuxury(name)) { totalSkippedFiltered++; continue; }

      const addr = parseAddress(p);
      const loc = p.location || {};
      const storageTypes = classifyStorageTypes(name);
      const vehicleTypes = classifyVehicleTypes(name);
      const hours = p.regularOpeningHours?.weekdayDescriptions || null;

      const facility = {
        name,
        address: addr.address,
        city: addr.city || city.split(",")[0].trim(),
        state: addr.state || city.split(",")[1]?.trim() || "",
        zip: addr.zip,
        lat: loc.latitude || 0,
        lng: loc.longitude || 0,
        phone: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        googlePlaceId: placeId,
        avgRating: p.rating || 0,
        reviewCount: p.userRatingCount || 0,
        hours: hours ? { weekdays: hours } : {},
        storageTypes,
        vehicleTypes,
      };

      if (!cityLat && loc.latitude) { cityLat = loc.latitude; cityLng = loc.longitude; }

      const facId = await insertFacility(facility);
      if (facId) {
        totalInserted++;
        cityInserted++;
        citiesWithNew.add(city);

        // Fetch first photo
        const photos = p.photos || [];
        if (photos.length > 0) {
          const photoUrl = await fetchPhotoUrl(photos[0].name);
          if (photoUrl) {
            await insertPhoto(facId, photoUrl, name);
            photoCalls++;
          }
          await sleep(100);
        }
      }
    }
  }

  console.log(`+${cityInserted}`);

  // Upsert city record
  if (cityInserted > 0 && cityLat) {
    const [cn, prov] = city.split(",").map(s => s.trim());
    await upsertCity(cn, prov, cityLat, cityLng);
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log("CANADA SEEDER RESULTS");
console.log("=".repeat(60));
console.log(`API calls: ${apiCalls} search + ${photoCalls} photos`);
console.log(`Cost: ~$${((apiCalls * 0.040) + (photoCalls * 0.007)).toFixed(2)}`);
console.log(`Inserted: ${totalInserted} luxury facilities`);
console.log(`Skipped (existing): ${totalSkippedExisting}`);
console.log(`Skipped (not luxury): ${totalSkippedFiltered}`);
console.log(`Cities with new: ${citiesWithNew.size}`);

if (db) await db.end();
