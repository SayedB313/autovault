/**
 * Fetch photos for all facilities that are missing them.
 * Uses Google Places API Text Search to find the place, then fetches its photo.
 */
import pg from "pg";
const { Client } = pg;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
await db.connect();

const { rows } = await db.query(`
  SELECT f.id, f.name, f."googlePlaceId"
  FROM "Facility" f
  LEFT JOIN "FacilityPhoto" fp ON fp."facilityId" = f.id
  WHERE fp.id IS NULL AND f."googlePlaceId" IS NOT NULL
  ORDER BY f.name
`);

console.log(`Found ${rows.length} facilities without photos`);

const sleep = ms => new Promise(r => setTimeout(r, ms));
let fetched = 0;
let failed = 0;
const noPhotos = [];

for (const f of rows) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.photos",
    },
    body: JSON.stringify({ textQuery: f.name, pageSize: 1 }),
  });

  if (!res.ok) {
    console.log(`  API error for ${f.name}: ${res.status}`);
    failed++;
    await sleep(200);
    continue;
  }

  const data = await res.json();
  const place = data.places?.[0];
  const photos = place?.photos || [];

  if (photos.length === 0) {
    noPhotos.push(f.name);
    await sleep(150);
    continue;
  }

  const photoName = photos[0].name;
  const photoRes = await fetch(`https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1600&maxWidthPx=1600&skipHttpRedirect=true&key=${API_KEY}`);
  if (!photoRes.ok) {
    failed++;
    await sleep(150);
    continue;
  }
  const photoData = await photoRes.json();
  const photoUrl = photoData.photoUri;

  if (photoUrl) {
    await db.query(`
      INSERT INTO "FacilityPhoto" (id, url, alt, "order", source, "facilityId", "createdAt")
      VALUES (gen_random_uuid()::text, $1, $2, 0, 'GOOGLE'::"PhotoSource", $3, NOW())
      ON CONFLICT DO NOTHING
    `, [photoUrl, f.name, f.id]);
    fetched++;
    process.stdout.write(".");
  }

  await sleep(150);
}

console.log(`\n\nDone. Fetched ${fetched} photos. Failed: ${failed}. No photos available: ${noPhotos.length}`);
if (noPhotos.length > 0) {
  console.log("\nFacilities with no Google photos:");
  noPhotos.forEach(n => console.log(`  - ${n}`));
}

const { rows: still } = await db.query(`
  SELECT COUNT(*) as cnt FROM "Facility" f
  LEFT JOIN "FacilityPhoto" fp ON fp."facilityId" = f.id
  WHERE fp.id IS NULL
`);
console.log(`\nFacilities still without photos: ${still[0].cnt}`);

await db.end();
