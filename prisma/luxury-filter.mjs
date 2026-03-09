/**
 * AutoVault — Luxury Filter
 * Scores every facility and classifies as LUXURY (keep) or REMOVE.
 *
 * Strategy: Multi-signal scoring system.
 * A facility needs to convincingly signal "premium car storage" to survive.
 *
 * DRY RUN by default. Pass --execute to actually delete.
 */

import pg from "pg";
const { Client } = pg;

const EXECUTE = process.argv.includes("--execute");

const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
await c.connect();

// ================================================================
// SCORING RULES
// ================================================================

// Instant REMOVE — these never belong in ultra-luxury
const INSTANT_REMOVE_NAME = /\b(rv storage|rv center|rv park|boat storage|boat house|boat shed|boat yard|boatyard|marine storage|mini warehouse|mini storage|self storage|self-storage|selfstorage|budget storage|u-haul|public storage|extra space|cubesmart|life storage|uncle bob|securcare|storquest|simply self|safeguard self|storage king|storage rentals of america|move it self|aaaa self|storage sense|mini mall|smartstop|istorage|sparefoot|sparebox|storsmart|dollar self|national storage|all american storage|a-1 self|lock box storage|rightspace|cardinal self|storage xtra|avid storage|modern storage|armor storage|stor-it|all purpose storage|republic storage|storage now|the lock up|american self storage|storage post|the storage center|us storage centers|secure space|space center storage|compass self|shipping|transport|carrier|hauling|hauler|moving co|logistics|freight|rental[s ]|rent a|rent-a|hertz|avis|turo|dealer(?:ship)?|(?:auto |car )sales|pre-owned|preowned|detail(?:ing|er|s)|car wash|auto wash|wrap(?:s|ping)|tint(?:ing|s|ed)|ceramic coat|paint protect|cosmetic|repair(?:s|ing)?|mechanic|body shop|collision|auto body|muffler|brake[s ]|tire[s ]|transmission|oil change|tow(?:ing|s|er)|wreck(?:er|ing)?|junk(?:yard)?|scrap|salvage|impound|museum|admission|coffee|restoration|restoring|restored|insurance|realt[yor]|apartment|condo(?:minium)? (?:for |sale|rent)|(?:for |home )sale|landscap|plumbing|electric(?:al|ian)|roofing|flooring|window|door(?:s| )|hvac|pest|cleaning service|shuttle|cruise parking|valet parking|driving experience)\b/i;

// Instant KEEP — unmistakable luxury car storage
const INSTANT_KEEP_NAME = /\b(exotic car storage|luxury car storage|luxury vehicle storage|collector car storage|classic car storage|supercar storage|sportscar storage|exotic vehicle storage|concours garage|car vault|auto vault|autovault|motor vault|motorvault|garage condo|garagecondo|motor condo|motorcondo|toy barn|automotorplex|auto motorplex|hagerty garage|hagerty|streetside classics)\b/i;

// Luxury name keywords — strong signals
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

// Premium facility patterns — strong signals
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
  { pattern: /motor barn/i, score: 10 },
  { pattern: /car barn/i, score: 10 },
  { pattern: /garage\s*\+?\s*social/i, score: 15 },
  { pattern: /paddock/i, score: 12 },
  { pattern: /hangar[s]?\b/i, score: 8 },
  { pattern: /\bthe shed garage/i, score: 10 },
  { pattern: /car lounge/i, score: 12 },
  { pattern: /reserve lounge/i, score: 10 },
  { pattern: /garage town/i, score: 8 },
  { pattern: /overflow garage/i, score: 8 },
  { pattern: /garages of/i, score: 10 },
  { pattern: /dream garage/i, score: 10 },
  { pattern: /ultimate garage/i, score: 12 },
  { pattern: /iron gate/i, score: 8 },
  { pattern: /formula garage/i, score: 10 },
  { pattern: /holy grail garage/i, score: 10 },
];

// Storage context terms
const STORAGE_CONTEXT = /\b(storage|stored|storing|garage|vault|barn|hangar|warehouse|condo|depot|locker|space|shed|club|lounge|den|conservanc|park(?:ing|ed)|facility|indoor|enclosed|climate|heated|secure|covered)\b/i;

// Vehicle context terms (includes garage condo/motor club since they're inherently automotive)
const VEHICLE_CONTEXT = /\b(car|cars|auto|automobile|vehicle|motor(?!ola)|classic|exotic|luxury|premium|elite|collector|supercar|sportscar|motorcar|muscle car|hotrod|hot rod|corvette|ferrari|lamborghini|porsche|maserati|bentley|rolls|mclaren|bugatti|aston martin|garage condo|garagecondo|motor ?club|car ?club|toy barn|paddock|concours)\b/i;

// Known premium brands and facilities (partial name match)
const KNOWN_PREMIUM = [
  "hagerty", "toy barn", "automotorplex", "motorvault", "streetside classics",
  "garagecondos", "garages of texas", "garages of america", "iron gate",
  "concours garage", "vault exotics", "supercar rooms", "atlanta motorcar club",
  "warehouse motorclub", "p1 garage", "monte carlo garage", "red hawk garage",
  "luxe dream garage", "the lux garage", "veloce motors", "fiorano",
  "cartopia", "motorcar manor", "historic motorcars", "griot",
  "cars dawydiak", "bigger garage", "autobar", "autoconcierge",
];

// Negative signals — things that make it less likely to be luxury
const NEGATIVE_KEYWORDS = [
  { pattern: /\brv\b/i, score: -8 },
  { pattern: /\bboat\b/i, score: -8 },
  { pattern: /\btruck\b/i, score: -5 },
  { pattern: /\btrailer\b/i, score: -5 },
  { pattern: /\bmini warehouse/i, score: -15 },
  { pattern: /\bself[- ]?storage/i, score: -15 },
  { pattern: /\bbudget\b/i, score: -10 },
  { pattern: /\bcheap\b/i, score: -10 },
  { pattern: /\baffordable\b/i, score: -5 },
  { pattern: /\bparking lot\b/i, score: -10 },
  { pattern: /\bparking garage\b/i, score: -5 },
  { pattern: /\bmotorsports?\b(?!.*(?:storage|garage|vault|barn|condo))/i, score: -3 },
];

function scoreFacility(f) {
  const name = f.name || "";
  const nl = name.toLowerCase();
  const storageTypes = Array.isArray(f.storageTypes) ? f.storageTypes : (f.storageTypes || "").replace(/[{}]/g, "").split(",").filter(Boolean);
  const vehicleTypes = Array.isArray(f.vehicleTypes) ? f.vehicleTypes : (f.vehicleTypes || "").replace(/[{}]/g, "").split(",").filter(Boolean);
  const amenities = Array.isArray(f.amenities) ? f.amenities : (f.amenities || "").replace(/[{}]/g, "").split(",").filter(Boolean);

  let score = 0;
  const signals = [];

  // Instant checks
  if (INSTANT_REMOVE_NAME.test(nl)) {
    return { score: -100, verdict: "REMOVE", signals: ["instant-remove: name pattern"] };
  }
  if (INSTANT_KEEP_NAME.test(nl)) {
    return { score: 100, verdict: "KEEP", signals: ["instant-keep: known luxury pattern"] };
  }

  // Known premium brand check
  for (const brand of KNOWN_PREMIUM) {
    if (nl.includes(brand)) {
      score += 20;
      signals.push(`known-premium: ${brand}`);
      break;
    }
  }

  // Luxury keyword scoring
  for (const { pattern, score: s } of LUXURY_KEYWORDS) {
    if (pattern.test(nl)) {
      score += s;
      signals.push(`luxury-kw: ${pattern.source} (+${s})`);
    }
  }

  // Premium pattern scoring
  for (const { pattern, score: s } of PREMIUM_PATTERNS) {
    if (pattern.test(nl)) {
      score += s;
      signals.push(`premium-pattern: ${pattern.source} (+${s})`);
    }
  }

  // Negative keyword scoring
  for (const { pattern, score: s } of NEGATIVE_KEYWORDS) {
    if (pattern.test(nl)) {
      score += s;
      signals.push(`negative: ${pattern.source} (${s})`);
    }
  }

  // DB field signals
  if (storageTypes.includes("CLIMATE_CONTROLLED")) {
    score += 8;
    signals.push("climate-controlled (+8)");
  }
  if (storageTypes.includes("INDOOR")) {
    score += 3;
    signals.push("indoor (+3)");
  }
  if (storageTypes.includes("ENCLOSED")) {
    score += 3;
    signals.push("enclosed (+3)");
  }
  if (vehicleTypes.includes("EXOTIC")) {
    score += 10;
    signals.push("vtype:exotic (+10)");
  }
  if (vehicleTypes.includes("CLASSIC")) {
    score += 8;
    signals.push("vtype:classic (+8)");
  }
  // RV/Boat ONLY (no car) is a strong negative
  const hasCarType = vehicleTypes.includes("CAR") || vehicleTypes.includes("CLASSIC") || vehicleTypes.includes("EXOTIC") || vehicleTypes.includes("MOTORCYCLE");
  const hasRVBoat = vehicleTypes.includes("RV") || vehicleTypes.includes("BOAT");
  if (hasRVBoat && !hasCarType) {
    score -= 20;
    signals.push("rv/boat-only (-20)");
  }

  // Amenity bonus (luxury amenities)
  const luxAmenities = ["CONCIERGE", "DETAILING", "EV_CHARGING", "LOUNGE", "CLIMATE_MONITORING", "FIRE_SUPPRESSION", "BATTERY_TENDER"];
  const luxCount = amenities.filter(a => luxAmenities.includes(a)).length;
  if (luxCount >= 3) {
    score += 10;
    signals.push(`luxury-amenities:${luxCount} (+10)`);
  } else if (luxCount >= 1) {
    score += 5;
    signals.push(`luxury-amenities:${luxCount} (+5)`);
  }

  // Rating bonus
  if (f.avgRating >= 4.8) {
    score += 3;
    signals.push(`high-rating:${f.avgRating} (+3)`);
  }

  // Has both vehicle + storage context in name (baseline for relevance)
  const hasVehicleContext = VEHICLE_CONTEXT.test(nl);
  const hasStorageContext = STORAGE_CONTEXT.test(nl);
  if (hasVehicleContext && hasStorageContext) {
    score += 3;
    signals.push("vehicle+storage-context (+3)");
  } else if (!hasVehicleContext && !hasStorageContext) {
    score -= 10;
    signals.push("no-vehicle-no-storage-context (-10)");
  } else if (!hasVehicleContext) {
    score -= 5;
    signals.push("no-vehicle-context (-5)");
  }

  // ULTRA-LUXURY GATE: Must have at least one genuine luxury signal.
  // Generic "car storage" or "vehicle storage" alone is NOT luxury.
  // A luxury signal = luxury keyword, premium pattern, known brand,
  //                   exotic/classic vtype, climate_controlled + amenities, or garage condo pattern.
  const hasLuxurySignal = signals.some(s =>
    s.startsWith("luxury-kw:") ||
    s.startsWith("premium-pattern:") ||
    s.startsWith("known-premium:") ||
    s.startsWith("vtype:exotic") ||
    s.startsWith("vtype:classic") ||
    s.startsWith("luxury-amenities:") ||
    s.startsWith("instant-keep:")
  );
  const hasClimateAndCar = storageTypes.includes("CLIMATE_CONTROLLED") && hasVehicleContext;

  if (!hasLuxurySignal && !hasClimateAndCar) {
    score -= 5;
    signals.push("no-luxury-signal (-5)");
  }

  // Determine verdict
  // Ultra-luxury threshold: 6+ = KEEP (has at least one luxury signal), <6 = REMOVE
  let verdict;
  if (score >= 6) verdict = "KEEP";
  else verdict = "REMOVE";

  return { score, verdict, signals };
}

// ================================================================
// RUN
// ================================================================

const { rows: all } = await c.query(`
  SELECT id, name, city, state, "storageTypes", "vehicleTypes", amenities, "avgRating", website
  FROM "Facility"
  ORDER BY name
`);

const results = { KEEP: [], REMOVE: [] };

for (const f of all) {
  const { score, verdict, signals } = scoreFacility(f);
  results[verdict].push({ ...f, score, signals });
}

// Sort each category by score
results.KEEP.sort((a, b) => b.score - a.score);
results.REMOVE.sort((a, b) => b.score - a.score);

console.log("=".repeat(70));
console.log("AUTOVAULT LUXURY FILTER — " + (EXECUTE ? "EXECUTING PURGE" : "DRY RUN"));
console.log("=".repeat(70));
console.log(`Total facilities: ${all.length}`);
console.log(`KEEP (luxury):    ${results.KEEP.length} (${Math.round(results.KEEP.length / all.length * 100)}%)`);
console.log(`REMOVE:           ${results.REMOVE.length} (${Math.round(results.REMOVE.length / all.length * 100)}%)`);

// Show KEEP list
console.log(`\n${"=".repeat(70)}`);
console.log(`KEEP — LUXURY FACILITIES (${results.KEEP.length})`);
console.log("=".repeat(70));
results.KEEP.forEach((f, i) => {
  console.log(`  ${String(i + 1).padStart(3)}. [${f.score}] ${f.name} | ${f.city}, ${f.state}`);
});

// Show sample of REMOVE list
console.log(`\n${"=".repeat(70)}`);
console.log(`REMOVE — SAMPLE (first 30 of ${results.REMOVE.length})`);
console.log("=".repeat(70));
results.REMOVE.slice(0, 30).forEach((f, i) => {
  console.log(`  ${String(i + 1).padStart(3)}. [${f.score}] ${f.name} | ${f.city}, ${f.state}`);
});

if (EXECUTE) {
  // Delete REMOVE facilities (and their photos, reviews, leads)
  const removeIds = results.REMOVE.map(f => f.id);

  console.log(`\n${"=".repeat(70)}`);
  console.log(`EXECUTING PURGE — Removing ${removeIds.length} facilities`);
  console.log("=".repeat(70));

  // Delete related records first
  const photoResult = await c.query(`DELETE FROM "FacilityPhoto" WHERE "facilityId" = ANY($1::text[])`, [removeIds]);
  console.log(`Deleted ${photoResult.rowCount} photos`);

  const reviewResult = await c.query(`DELETE FROM "Review" WHERE "facilityId" = ANY($1::text[])`, [removeIds]);
  console.log(`Deleted ${reviewResult.rowCount} reviews`);

  const leadResult = await c.query(`DELETE FROM "Lead" WHERE "facilityId" = ANY($1::text[])`, [removeIds]);
  console.log(`Deleted ${leadResult.rowCount} leads`);

  // Delete facilities
  const facResult = await c.query(`DELETE FROM "Facility" WHERE id = ANY($1::text[])`, [removeIds]);
  console.log(`Deleted ${facResult.rowCount} facilities`);

  // Update city facility counts
  await c.query(`
    UPDATE "City" SET "facilityCount" = (
      SELECT COUNT(*) FROM "Facility" WHERE "Facility".city = "City".name AND "Facility".state = "City".state
    )
  `);

  // Delete cities with 0 facilities
  const cityDel = await c.query(`DELETE FROM "City" WHERE "facilityCount" = 0`);
  console.log(`Removed ${cityDel.rowCount} empty cities`);

  // Final count
  const { rows: [{ count }] } = await c.query(`SELECT COUNT(*) as count FROM "Facility"`);
  console.log(`\nFinal facility count: ${count}`);
} else {
  console.log(`\n${"=".repeat(70)}`);
  console.log("DRY RUN COMPLETE — No changes made");
  console.log(`To execute: pass --execute flag`);
  console.log(`Will remove: ${results.REMOVE.length} facilities`);
  console.log(`Will keep: ${results.KEEP.length} luxury facilities`);
  console.log("=".repeat(70));
}

await c.end();
