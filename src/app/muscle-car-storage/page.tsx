import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chrome, Cog, Thermometer, CalendarRange } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Muscle Car Storage | Secure Facilities for American Performance | AutoVault",
  description:
    "Find secure muscle car storage for Corvette, Camaro, Mustang, Challenger, and more. Climate-controlled facilities to preserve your American performance car.",
  keywords:
    "muscle car storage, Corvette storage, Camaro storage, Mustang storage, Challenger storage, American muscle car storage, performance car storage",
};

const faqs = [
  {
    question: "What is muscle car storage?",
    answer:
      "Muscle car storage is a specialized vehicle storage service designed for American performance cars -- both classic and modern. These facilities cater to iconic vehicles like the Chevrolet Corvette, Camaro, and Chevelle, Ford Mustang and GT, Dodge Challenger and Charger, Pontiac GTO and Firebird, and Plymouth Barracuda. Proper muscle car storage maintains climate conditions that protect chrome trim, factory paint, vinyl and leather interiors, and high-performance engines. Many facilities offer engine start services, battery tending, and seasonal storage programs tailored to muscle car owners who drive their vehicles only during warm months.",
  },
  {
    question: "How much does muscle car storage cost per month?",
    answer:
      "Muscle car storage costs between $150 and $800 per month depending on the storage type and facility amenities. Basic indoor storage runs $150-$300/month, climate-controlled indoor storage costs $300-$500/month, and enclosed private bays with climate control range from $500-$800/month. Seasonal storage programs (typically 5-7 months over winter) often offer discounted monthly rates of 10-20% compared to month-to-month pricing. Multi-car discounts are common for owners storing two or more vehicles. Rural and suburban markets are significantly less expensive than major metro areas.",
  },
  {
    question: "How do I protect chrome on a stored muscle car?",
    answer:
      "Chrome protection during storage requires controlling both humidity and surface preparation. Before storage, clean all chrome surfaces thoroughly to remove road film, salt residue, and contaminants. Apply a high-quality chrome polish or wax -- products like Mothers or Flitz create a protective barrier against oxidation. Store the vehicle in a facility maintaining 40-55% relative humidity, as both excess moisture (causes pitting and surface rust) and extremely dry conditions (accelerates oxidation) damage chrome. Avoid covering chrome with plastic, which traps moisture; use breathable cotton covers if needed. Periodic inspection every 4-6 weeks catches early oxidation before it becomes permanent.",
  },
  {
    question: "How often should I start my muscle car in storage?",
    answer:
      "For carbureted classic muscle cars, start the engine every 2-3 weeks and let it reach full operating temperature (at least 15-20 minutes of runtime) to burn off condensation in the exhaust system and circulate oil through all engine components. For fuel-injected modern muscle cars, every 3-4 weeks is sufficient. Never start the engine for just a few minutes -- short runs build condensation without reaching temperature to evaporate it, causing more harm than no start at all. If the vehicle will be stored for 6+ months without starts, consider using a fuel stabilizer, disconnecting the battery, and using fogging oil in the cylinders.",
  },
  {
    question: "What is seasonal muscle car storage?",
    answer:
      "Seasonal muscle car storage is a program designed for owners who drive their vehicles during warm months and store them through winter. These programs typically run from October/November through March/April (5-7 months). Reputable seasonal programs include intake preparation (fuel stabilizer, battery tender connection, tire pressure adjustment, fluid check), periodic engine starts during winter, spring de-winterization with a full inspection, and a detail before pickup. Seasonal programs are popular in northern states where road salt, ice, and freezing temperatures make winter driving impractical for collectible muscle cars.",
  },
  {
    question: "Are there storage facilities with restoration services?",
    answer:
      "Yes, many muscle car storage facilities offer or coordinate restoration services ranging from basic preservation work to full frame-off restorations. Some facilities have in-house restoration shops capable of bodywork, paint, engine rebuilds, and interior restoration. Others partner with local restoration specialists and coordinate the work while the vehicle is in their care. This is particularly convenient for long-term storage clients who want restoration work completed incrementally. When selecting a facility with restoration capabilities, review their portfolio of completed projects, ask for references from previous restoration clients, and verify that their shop carries appropriate insurance for vehicles under restoration.",
  },
];

export default async function MuscleCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["CLASSIC", "EXOTIC"] },
    },
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
    take: 12,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(faqs)),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Muscle Car Storage
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Purpose-built storage for America&apos;s iconic performance machines.
            Climate-controlled facilities that preserve chrome, paint, and engine
            performance.
          </p>
          <Link href="/search?vehicleType=CLASSIC">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Find Muscle Car Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          What to Look For in Muscle Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Chrome className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Chrome Protection</h3>
            <p className="text-sm text-muted-foreground">
              Controlled humidity prevents chrome pitting and oxidation on bumpers, trim, and emblems.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Cog className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Engine Preservation</h3>
            <p className="text-sm text-muted-foreground">
              Periodic engine starts, fluid circulation, and fogging services keep powertrains ready to run.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Thermometer className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Climate Control</h3>
            <p className="text-sm text-muted-foreground">
              Consistent temperature and humidity prevents paint oxidation, interior cracking, and rubber dry rot.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <CalendarRange className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Seasonal Storage</h3>
            <p className="text-sm text-muted-foreground">
              Winter storage programs with intake prep, periodic starts, and spring de-winterization service.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Muscle Car Storage Facilities
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
                <Button variant="outline">View All Muscle Car Storage</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Own a Muscle Car Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of muscle car
          enthusiasts searching for secure, climate-controlled storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
