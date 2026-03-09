import pg from "pg";
const { Client } = pg;
const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });

await c.connect();

const q = async (sql, params) => (await c.query(sql, params)).rows;
const q1 = async (sql) => (await c.query(sql)).rows[0].cnt;

const total = await q1('SELECT COUNT(*)::int as cnt FROM "Facility"');
const photos = await q1('SELECT COUNT(*)::int as cnt FROM "FacilityPhoto"');
const cities = await q1('SELECT COUNT(*)::int as cnt FROM "City"');
const blogs = await q1('SELECT COUNT(*)::int as cnt FROM "BlogPost"');

console.log("=== TOTALS ===");
console.log(`Facilities: ${total}`);
console.log(`Photos: ${photos}`);
console.log(`Cities: ${cities}`);
console.log(`Blog Posts: ${blogs}`);

// By state
const byState = await q('SELECT state, COUNT(*)::int as cnt FROM "Facility" GROUP BY state ORDER BY cnt DESC');
console.log("\n=== BY STATE ===");
byState.forEach(r => console.log(`  ${r.state}: ${r.cnt}`));

// By tier
const byTier = await q('SELECT tier, COUNT(*)::int as cnt FROM "Facility" GROUP BY tier ORDER BY cnt DESC');
console.log("\n=== BY TIER ===");
byTier.forEach(r => console.log(`  ${r.tier}: ${r.cnt}`));

// Storage types
const byType = await q('SELECT unnest("storageTypes") as st, COUNT(*)::int as cnt FROM "Facility" GROUP BY st ORDER BY cnt DESC');
console.log("\n=== BY STORAGE TYPE ===");
byType.forEach(r => console.log(`  ${r.st}: ${r.cnt}`));

// Vehicle types
const byVehicle = await q('SELECT unnest("vehicleTypes") as vt, COUNT(*)::int as cnt FROM "Facility" GROUP BY vt ORDER BY cnt DESC');
console.log("\n=== BY VEHICLE TYPE ===");
byVehicle.forEach(r => console.log(`  ${r.vt}: ${r.cnt}`));

// Photos
const withPhotos = await q1('SELECT COUNT(DISTINCT "facilityId")::int as cnt FROM "FacilityPhoto"');
console.log("\n=== PHOTOS ===");
console.log(`With photos: ${withPhotos}`);
console.log(`Without photos: ${total - withPhotos}`);

// Ratings
const withRating = await q1('SELECT COUNT(*)::int as cnt FROM "Facility" WHERE "avgRating" IS NOT NULL AND "avgRating" > 0');
console.log("\n=== RATINGS ===");
console.log(`With rating: ${withRating}`);
console.log(`Without rating: ${total - withRating}`);

// Rating distribution
const ratingDist = await q('SELECT FLOOR("avgRating")::int as bucket, COUNT(*)::int as cnt FROM "Facility" WHERE "avgRating" > 0 GROUP BY bucket ORDER BY bucket');
console.log("\n=== RATING DISTRIBUTION ===");
ratingDist.forEach(r => console.log(`  ${r.bucket}-${r.bucket + 1} stars: ${r.cnt}`));

// Top 15 cities
const topCities = await q('SELECT name, state, "facilityCount" FROM "City" ORDER BY "facilityCount" DESC LIMIT 15');
console.log("\n=== TOP 15 CITIES ===");
topCities.forEach(r => console.log(`  ${r.name}, ${r.state}: ${r.facilityCount}`));

// Bottom 10 cities
const bottomCities = await q('SELECT name, state, "facilityCount" FROM "City" ORDER BY "facilityCount" ASC LIMIT 10');
console.log("\n=== BOTTOM 10 CITIES ===");
bottomCities.forEach(r => console.log(`  ${r.name}, ${r.state}: ${r.facilityCount}`));

// Category keywords
const kw = (await q(`SELECT
  SUM(CASE WHEN LOWER(name) LIKE '%exotic%' THEN 1 ELSE 0 END)::int as exotic,
  SUM(CASE WHEN LOWER(name) LIKE '%classic%' THEN 1 ELSE 0 END)::int as classic,
  SUM(CASE WHEN LOWER(name) LIKE '%luxury%' THEN 1 ELSE 0 END)::int as luxury,
  SUM(CASE WHEN LOWER(name) LIKE '%rv%' THEN 1 ELSE 0 END)::int as rv,
  SUM(CASE WHEN LOWER(name) LIKE '%boat%' THEN 1 ELSE 0 END)::int as boat,
  SUM(CASE WHEN LOWER(name) LIKE '%garage%' THEN 1 ELSE 0 END)::int as garage,
  SUM(CASE WHEN LOWER(name) LIKE '%motor%' THEN 1 ELSE 0 END)::int as motor,
  SUM(CASE WHEN LOWER(name) LIKE '%parking%' THEN 1 ELSE 0 END)::int as parking,
  SUM(CASE WHEN LOWER(name) LIKE '%collector%' THEN 1 ELSE 0 END)::int as collector,
  SUM(CASE WHEN LOWER(name) LIKE '%indoor%' THEN 1 ELSE 0 END)::int as indoor,
  SUM(CASE WHEN LOWER(name) LIKE '%warehouse%' THEN 1 ELSE 0 END)::int as warehouse,
  SUM(CASE WHEN LOWER(name) LIKE '%valet%' THEN 1 ELSE 0 END)::int as valet
FROM "Facility"`))[0];
console.log("\n=== FACILITY CATEGORIES (by name keyword) ===");
Object.entries(kw).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

await c.end();
