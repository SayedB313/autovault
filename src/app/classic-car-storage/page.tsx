import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gauge, Droplets, Wrench, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Classic Car Storage | Collector Vehicle Facilities | AutoVault",
  description:
    "Find specialized classic car storage and collector vehicle facilities near you. Climate-controlled, secure storage to preserve your vintage automobile's value.",
  keywords:
    "classic car storage, collector car storage, vintage car storage, antique car storage, museum car storage",
};

export default async function ClassicCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["CLASSIC"] },
    },
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
    take: 12,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-900 to-amber-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Classic Car Storage
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl mx-auto mb-8">
            Preserve your classic. Find storage facilities built to protect
            vintage and collector automobiles for generations.
          </p>
          <Link href="/search?vehicleType=CLASSIC">
            <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50">
              Find Classic Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Preservation Tips */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Essential Classic Car Storage Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Gauge className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="font-semibold mb-2">Temperature Control</h3>
            <p className="text-sm text-muted-foreground">
              Stable temperatures between 50-70°F prevent rubber degradation, fluid breakdown, and paint damage.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Humidity Control</h3>
            <p className="text-sm text-muted-foreground">
              40-50% relative humidity prevents rust, mold, and corrosion on chrome, steel, and leather.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Maintenance Access</h3>
            <p className="text-sm text-muted-foreground">
              Battery tenders, periodic engine runs, and fluid top-offs keep your classic road-ready.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Provenance Records</h3>
            <p className="text-sm text-muted-foreground">
              Documented storage history adds value at auction and protects your investment&apos;s pedigree.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-amber-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Classic Car Storage Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((f) => (
                <Link key={f.id} href={`/facility/${f.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div
                      className="h-48 bg-muted bg-cover bg-center"
                      style={{
                        backgroundImage: f.photos[0]
                          ? `url(${f.photos[0].url})`
                          : undefined,
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{f.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {f.city}, {f.state}
                      </p>
                      {f.avgRating > 0 && (
                        <p className="text-sm mt-1">
                          <span className="text-yellow-500">★</span> {f.avgRating.toFixed(1)}
                          <span className="text-muted-foreground"> ({f.reviewCount})</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/search?vehicleType=CLASSIC">
                <Button variant="outline">View All Classic Storage</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Specialize in Classic Car Storage?
        </h2>
        <p className="text-muted-foreground mb-6">
          Reach collectors actively searching for the right facility to preserve
          their vintage automobiles.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
