import "dotenv/config";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

function makeCitySlug(name: string, state: string): string {
  return `${name}-${state}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeStateSlug(stateSlug: string): string {
  return stateSlug;
}

async function seedCities() {
  console.log("Seeding cities table...\n");

  let created = 0;
  let updated = 0;

  for (const city of CITIES) {
    const slug = makeCitySlug(city.name, city.state);

    const facilityCount = await prisma.facility.count({
      where: { state: city.state },
    });

    // Count facilities specifically in this city
    const cityFacilityCount = await prisma.facility.count({
      where: { city: city.name, state: city.state },
    });

    const result = await prisma.city.upsert({
      where: {
        slug_stateSlug: {
          slug,
          stateSlug: city.stateSlug,
        },
      },
      update: {
        facilityCount: cityFacilityCount,
        population: city.population,
      },
      create: {
        slug,
        name: city.name,
        state: city.state,
        stateSlug: city.stateSlug,
        lat: city.lat,
        lng: city.lng,
        population: city.population,
        facilityCount: cityFacilityCount,
        metaTitle: `Car Storage in ${city.name}, ${city.state} | AutoVault`,
        metaDescription: `Find car storage facilities in ${city.name}, ${city.state}. Compare prices, amenities, and reviews for vehicle storage near you.`,
      },
    });

    const status = cityFacilityCount > 0 ? `${cityFacilityCount} facilities` : "no facilities yet";
    console.log(`  ${city.name}, ${city.state}: ${status}`);
    created++;
  }

  console.log(`\nDone! Seeded ${created} cities.`);
  await prisma.$disconnect();
}

seedCities().catch((e) => {
  console.error(e);
  process.exit(1);
});
