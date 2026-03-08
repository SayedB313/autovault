import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Thermometer, Lock, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Exotic Car Storage | Climate-Controlled Facilities | AutoVault",
  description:
    "Find secure, climate-controlled exotic car storage near you. Purpose-built facilities for Ferrari, Lamborghini, Porsche, McLaren and more. Compare pricing and features.",
  keywords:
    "exotic car storage, supercar storage, Ferrari storage, Lamborghini storage, luxury vehicle storage, climate controlled car storage",
};

export default async function ExoticCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["EXOTIC"] },
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
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Exotic Car Storage
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Your supercar deserves more than a garage. Find climate-controlled,
            high-security storage designed specifically for exotic vehicles.
          </p>
          <Link href="/search?vehicleType=EXOTIC">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Find Exotic Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          What to Look For in Exotic Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Climate Control</h3>
            <p className="text-sm text-muted-foreground">
              Consistent temperature and humidity prevents paint damage, interior degradation, and tire flat-spotting.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Security</h3>
            <p className="text-sm text-muted-foreground">
              Gated access, camera surveillance, alarm systems, and fire suppression protect your investment.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Insurance Coverage</h3>
            <p className="text-sm text-muted-foreground">
              Facilities should carry adequate liability insurance and support your collector car policy requirements.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Concierge Service</h3>
            <p className="text-sm text-muted-foreground">
              Battery tending, detailing, maintenance scheduling, and transport coordination on demand.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Exotic Car Storage Facilities
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
              <Link href="/search?vehicleType=EXOTIC">
                <Button variant="outline">View All Exotic Storage</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Own an Exotic Car Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of exotic car owners
          searching for premium storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
