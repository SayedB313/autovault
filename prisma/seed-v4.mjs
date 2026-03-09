/**
 * AutoVault — Production Seeder V4
 * Strategy: includedType=storage + strictTypeFiltering + chain blocklist + strict name filter
 * Inserts facilities + photos into production database.
 *
 * Usage: GOOGLE_PLACES_API_KEY=xxx DATABASE_URL=xxx node seed-v4.mjs [--dry-run]
 */
import pg from "pg";
const { Client } = pg;

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const DB_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes("--dry-run");

if (!API_KEY) { console.error("Missing GOOGLE_PLACES_API_KEY"); process.exit(1); }
if (!DB_URL && !DRY_RUN) { console.error("Missing DATABASE_URL"); process.exit(1); }

// ================================================================
// QUERIES — Targeted car/vehicle storage searches
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
  "RV and boat storage facility",
];

// ================================================================
// CITIES — 200 US cities across all major markets
// ================================================================
const CITIES = [
  // AZ
  "Scottsdale, AZ", "Phoenix, AZ", "Tucson, AZ", "Mesa, AZ", "Chandler, AZ",
  // AL
  "Birmingham, AL", "Huntsville, AL",
  // AK
  "Anchorage, AK",
  // AR
  "Little Rock, AR",
  // CA
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA", "San Jose, CA",
  "Sacramento, CA", "Irvine, CA", "Beverly Hills, CA", "Monterey, CA",
  "Newport Beach, CA", "Palm Springs, CA", "Palo Alto, CA", "Fresno, CA",
  "Long Beach, CA", "Oakland, CA", "Riverside, CA", "Bakersfield, CA",
  // CO
  "Denver, CO", "Colorado Springs, CO", "Boulder, CO", "Fort Collins, CO",
  // CT
  "Greenwich, CT", "Stamford, CT", "Hartford, CT",
  // DE
  "Wilmington, DE",
  // FL
  "Miami, FL", "Tampa, FL", "Orlando, FL", "Jacksonville, FL", "Naples, FL",
  "Fort Lauderdale, FL", "Sarasota, FL", "Palm Beach, FL", "St. Petersburg, FL",
  "Boca Raton, FL", "Coral Gables, FL", "Pensacola, FL", "Tallahassee, FL",
  // GA
  "Atlanta, GA", "Savannah, GA", "Augusta, GA", "Alpharetta, GA",
  // HI
  "Honolulu, HI",
  // ID
  "Boise, ID",
  // IL
  "Chicago, IL", "Naperville, IL", "Schaumburg, IL", "Rockford, IL",
  // IN
  "Indianapolis, IN", "Carmel, IN", "Fort Wayne, IN",
  // IA
  "Des Moines, IA", "Cedar Rapids, IA",
  // KS
  "Overland Park, KS", "Wichita, KS",
  // KY
  "Louisville, KY", "Lexington, KY",
  // LA
  "New Orleans, LA", "Baton Rouge, LA",
  // ME
  "Portland, ME",
  // MD
  "Baltimore, MD", "Bethesda, MD", "Annapolis, MD",
  // MA
  "Boston, MA", "Cambridge, MA", "Worcester, MA",
  // MI
  "Detroit, MI", "Ann Arbor, MI", "Grand Rapids, MI",
  // MN
  "Minneapolis, MN", "St. Paul, MN",
  // MS
  "Jackson, MS",
  // MO
  "Kansas City, MO", "St. Louis, MO",
  // MT
  "Billings, MT", "Bozeman, MT",
  // NE
  "Omaha, NE", "Lincoln, NE",
  // NV
  "Las Vegas, NV", "Reno, NV",
  // NH
  "Manchester, NH",
  // NJ
  "Newark, NJ", "Jersey City, NJ", "Princeton, NJ", "Morristown, NJ",
  // NM
  "Albuquerque, NM", "Santa Fe, NM",
  // NY
  "New York, NY", "Buffalo, NY", "Albany, NY", "White Plains, NY",
  "Rochester, NY", "Syracuse, NY",
  // NC
  "Charlotte, NC", "Raleigh, NC", "Durham, NC", "Wilmington, NC",
  "Asheville, NC", "Greensboro, NC",
  // ND
  "Fargo, ND",
  // OH
  "Columbus, OH", "Cleveland, OH", "Cincinnati, OH", "Dayton, OH",
  // OK
  "Oklahoma City, OK", "Tulsa, OK",
  // OR
  "Portland, OR", "Eugene, OR", "Bend, OR",
  // PA
  "Philadelphia, PA", "Pittsburgh, PA", "Allentown, PA",
  // RI
  "Providence, RI",
  // SC
  "Charleston, SC", "Greenville, SC", "Columbia, SC",
  // SD
  "Sioux Falls, SD",
  // TN
  "Nashville, TN", "Memphis, TN", "Knoxville, TN", "Chattanooga, TN",
  // TX
  "Houston, TX", "Dallas, TX", "San Antonio, TX", "Austin, TX",
  "Fort Worth, TX", "El Paso, TX", "Plano, TX", "Frisco, TX",
  "The Woodlands, TX", "Sugar Land, TX", "Lubbock, TX", "Corpus Christi, TX",
  // UT
  "Salt Lake City, UT", "Park City, UT", "Provo, UT",
  // VT
  "Burlington, VT",
  // VA
  "Richmond, VA", "Virginia Beach, VA", "Arlington, VA", "Norfolk, VA",
  // WA
  "Seattle, WA", "Bellevue, WA", "Tacoma, WA", "Spokane, WA",
  // WV
  "Charleston, WV",
  // WI
  "Milwaukee, WI", "Madison, WI",
  // WY
  "Cheyenne, WY", "Jackson, WY",
  // DC
  "Washington, DC",
];

// ================================================================
// STATE NAME MAPPING (for stateSlug generation)
// ================================================================
const STATE_NAMES = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",
  KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",
  MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",
  NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",
  NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
  DC:"District of Columbia",
};

// ================================================================
// CHAIN BLOCKLIST
// ================================================================
const CHAIN_BLOCKLIST = [
  "public storage", "extra space storage", "cubesmart", "life storage",
  "u-haul", "uncle bob", "securcare", "storquest", "simply self storage",
  "budget self storage", "safeguard self storage", "storage king usa",
  "storage rentals of america", "move it self storage", "aaaa self storage",
  "storage sense", "mini mall storage", "prime storage", "smartstop",
  "istorage", "sparefoot", "sparebox", "storsmart", "dollar self storage",
  "national storage", "all american storage", "a-1 self storage",
  "lock box storage", "rightspace", "cardinal self storage",
  "storage xtra", "avid storage", "modern storage", "armor storage",
  "stor-it", "all purpose storage", "republic storage", "storage now",
  "the lock up", "american self storage", "storage post",
  "the storage center", "us storage centers", "secure space",
  "space center storage", "compass self storage",
];

// ================================================================
// NAME REJECT PATTERNS
// ================================================================
const NAME_REJECT = /\b(shipping|transport|carrier|hauling|hauler|moving co|logistics|freight|rental[s ]|rent a|rent-a|hertz|avis|turo|dealer(?:ship)?|(?:auto |car )sales|pre-owned|preowned|detail(?:ing|er|s)|car wash|auto wash|wrap(?:s|ping)|tint(?:ing|s|ed)|ceramic coat|paint protect|cosmetic|repair(?:s|ing)?|mechanic|body shop|collision|auto body|muffler|brake[s ]|tire[s ]|transmission|oil change|tow(?:ing|s|er)|wreck(?:er|ing)?|junk(?:yard)?|scrap|salvage|impound|museum|admission|coffee|restoration|restoring|restored|insurance|realt[yor]|apartment|condo(?:minium)? (?:for |sale|rent)|(?:for |home )sale|landscap|plumbing|electric(?:al|ian)|roofing|flooring|window|door(?:s| )|hvac|pest|cleaning service)\b/i;

// ================================================================
// CLASSIFICATION
// ================================================================
function isCarStorage(name) {
  const n = name.toLowerCase();
  for (const chain of CHAIN_BLOCKLIST) {
    if (n.includes(chain)) return false;
  }
  if (NAME_REJECT.test(n)) return false;

  const hasVehicle = /\b(car|auto|automobile|vehicle|motor(?!ola)|classic|exotic|luxury|premium|elite|collector|rv|boat|truck|motorcycle|trailer)\b/i.test(n);
  const hasStorage = /\b(storage|stored|storing|garage|vault|barn|hangar|warehouse|condo|depot|lot|locker|space|shed|club|lounge|den|conservanc|park(?:ing|ed))\b/i.test(n);

  if (hasVehicle && hasStorage) return true;
  if (/\b(garage condo|garagecondo|motor condo|motorcondo|car vault|auto vault|toy barn|motor barn|car barn|car club|auto club|motor club|car lounge|motorstorage|motorspace|motor space|car stash|car keep)\b/i.test(n)) return true;

  return false;
}

function classifyStorageTypes(name) {
  const n = name.toLowerCase();
  const types = [];
  if (/indoor|enclosed|climate/i.test(n)) types.push("INDOOR");
  if (/outdoor|open air|uncovered/i.test(n)) types.push("OUTDOOR");
  if (/covered(?! rv| boat)/i.test(n) || /canop/i.test(n)) types.push("COVERED");
  if (/climate.?control/i.test(n)) types.push("CLIMATE_CONTROLLED");
  if (/enclosed/i.test(n)) types.push("ENCLOSED");
  if (types.length === 0) types.push("INDOOR"); // default
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
  if (/\btrailer\b/i.test(n)) types.push("TRAILER");
  if (types.length === 0) types.push("CAR"); // default
  return [...new Set(types)];
}

// ================================================================
// HELPERS
// ================================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function parseAddress(place) {
  const comps = place.addressComponents || [];
  const get = (type) => {
    const c = comps.find(c => c.types?.includes(type));
    return c ? c.longText || c.shortText || "" : "";
  };
  const getShort = (type) => {
    const c = comps.find(c => c.types?.includes(type));
    return c ? c.shortText || c.longText || "" : "";
  };

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
      return searchPlaces(query); // retry once
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

  // Load existing googlePlaceIds for dedup
  const { rows } = await db.query('SELECT "googlePlaceId" FROM "Facility" WHERE "googlePlaceId" IS NOT NULL');
  rows.forEach(r => existingPlaceIds.add(r.googlePlaceId));
  console.log(`Loaded ${existingPlaceIds.size} existing place IDs for dedup`);
}

async function insertFacility(f) {
  if (DRY_RUN) return "dry-run-id";

  // Try slug with city-state for uniqueness (also better for SEO)
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
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'US',
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
      if (err.code === "23505" && err.constraint === "Facility_slug_key") {
        continue; // try next slug
      }
      throw err; // unexpected error
    }
  }
  return null; // all attempts failed
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
  const stateName = STATE_NAMES[stateAbbrev] || stateAbbrev;
  const stateSlug = slugify(stateName);

  // Count facilities in this city
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
console.log(DRY_RUN ? "V4 PRODUCTION SEEDER — DRY RUN" : "V4 PRODUCTION SEEDER — LIVE");
console.log("============================================================");
console.log(`Queries: ${QUERIES.length}`);
console.log(`Cities: ${CITIES.length}`);
console.log(`Max API calls: ${QUERIES.length * CITIES.length} (search) + photos`);
console.log(`Est. search cost: $${(QUERIES.length * CITIES.length * 0.040).toFixed(2)}`);
console.log();

await connectDB();

const seen = new Set(); // dedup within this run
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
    const places = await searchPlaces(`${q} in ${city}`);
    apiCalls++;
    await sleep(200);

    for (const p of places) {
      const placeId = p.id;
      if (seen.has(placeId)) continue;
      seen.add(placeId);

      // Skip if already in DB
      if (existingPlaceIds.has(placeId)) {
        totalSkippedExisting++;
        continue;
      }

      const name = p.displayName?.text || "";

      // V4 filtering
      if (!isCarStorage(name)) {
        totalSkippedFiltered++;
        continue;
      }

      // Parse address
      const addr = parseAddress(p);
      const lat = p.location?.latitude || 0;
      const lng = p.location?.longitude || 0;
      if (!cityLat && lat) { cityLat = lat; cityLng = lng; }

      // Build facility object
      const facility = {
        slug: slugify(name),
        name,
        address: addr.address,
        city: addr.city || city.split(",")[0].trim(),
        state: addr.state || city.split(",")[1]?.trim() || "",
        zip: addr.zip,
        lat, lng,
        phone: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        googlePlaceId: placeId,
        avgRating: p.rating || 0,
        reviewCount: p.userRatingCount || 0,
        hours: p.regularOpeningHours || null,
        storageTypes: classifyStorageTypes(name),
        vehicleTypes: classifyVehicleTypes(name),
      };

      // Insert facility
      const facilityId = await insertFacility(facility);
      if (!facilityId) continue; // conflict (already exists)

      totalInserted++;
      cityInserted++;
      existingPlaceIds.add(placeId); // prevent re-insert in same run

      // Fetch + insert one photo
      const photos = p.photos || [];
      if (photos.length > 0 && photos[0].name) {
        const photoUrl = await fetchPhotoUrl(photos[0].name);
        photoCalls++;
        if (photoUrl) {
          await insertPhoto(facilityId, photoUrl, name);
        }
        await sleep(100);
      }
    }
  }

  if (cityInserted > 0) {
    citiesWithNew.add(city);
    // Upsert city record
    const [cityName, stateAbbrev] = [city.split(",")[0].trim(), city.split(",")[1]?.trim()];
    if (cityName && stateAbbrev) {
      await upsertCity(cityName, stateAbbrev, cityLat, cityLng);
    }
  }

  console.log(`+${cityInserted} new`);
}

// Update facility counts for ALL cities that have facilities
if (!DRY_RUN) {
  console.log("\nUpdating all city facility counts...");
  await db.query(`
    UPDATE "City" c SET "facilityCount" = (
      SELECT COUNT(*)::int FROM "Facility" f WHERE f.city = c.name AND f.state = c.state
    )
  `);
}

// ================================================================
// REPORT
// ================================================================
const searchCost = apiCalls * 0.040;
const photoCost = photoCalls * 0.007;
const totalCost = searchCost + photoCost;

console.log(`\n${"=".repeat(60)}`);
console.log("SEEDING COMPLETE");
console.log(`${"=".repeat(60)}`);
console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
console.log(`API calls: ${apiCalls} search + ${photoCalls} photos`);
console.log(`Cost: $${searchCost.toFixed(2)} search + $${photoCost.toFixed(2)} photos = $${totalCost.toFixed(2)} total`);
console.log(`New facilities inserted: ${totalInserted}`);
console.log(`Skipped (already in DB): ${totalSkippedExisting}`);
console.log(`Skipped (filtered out): ${totalSkippedFiltered}`);
console.log(`Cities with new facilities: ${citiesWithNew.size}`);

if (citiesWithNew.size > 0) {
  console.log(`\nCities: ${[...citiesWithNew].join(", ")}`);
}

if (!DRY_RUN && db) await db.end();
