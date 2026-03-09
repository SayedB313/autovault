import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Thermometer, Wrench, Car } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Corvette Storage | Secure Facilities for C1 to C8 | AutoVault",
  description:
    "Find specialized Corvette storage from C1 classics to the C8 Stingray. Climate-controlled facilities that protect fiberglass, paint, and performance.",
  keywords:
    "Corvette storage, C8 Corvette storage, C3 Corvette storage, Corvette Z06 storage, vintage Corvette storage, Corvette climate controlled storage",
};

const faqs = [
  {
    question: "What are the key storage requirements for a Corvette?",
    answer:
      "Corvette storage requires climate control at 60-68°F with 45-55% relative humidity to protect the fiberglass or composite body panels from UV damage and moisture absorption. The engine should be started every 2-3 weeks and brought to full operating temperature. A quality battery tender prevents drain from the ECU and security system. Tire flat-spot prevention is important -- use tire cradles or rotate the car periodically. For C1-C3 models, chrome trim and rubber seals need humidity control to prevent pitting and dry rot.",
  },
  {
    question: "How much does Corvette storage cost per month?",
    answer:
      "Corvette storage costs between $150 and $800 per month depending on the model, facility tier, and location. Basic indoor climate-controlled storage for a modern C7 or C8 runs $150-$300/month. Mid-tier facilities with concierge services, engine starts, and detailing cost $300-$500/month. Premium facilities specializing in classic or high-value Corvettes (C2 Split Window, L88, C8 Z06) range from $500-$800/month. Markets like Scottsdale, South Florida, and Southern California tend to be at the higher end. Multi-car discounts of 15-25% are common.",
  },
  {
    question: "What are the fiberglass storage considerations for Corvettes?",
    answer:
      "Corvette fiberglass (C1-C4) and composite (C5-C8) body panels have unique storage needs. Fiberglass is porous and absorbs moisture if relative humidity exceeds 60%, which can cause micro-blistering and gelcoat failures over time. UV exposure causes fiberglass yellowing and chalking, so storage must have UV-filtered lighting or no direct sunlight. Temperature extremes cause fiberglass expansion and contraction that can crack paint and gelcoat. Modern composite panels (C5+) are more dimensionally stable but still benefit from consistent climate control. Always use a breathable car cover, never plastic, as trapped moisture accelerates fiberglass degradation.",
  },
  {
    question: "What are the storage needs specific to the C8 mid-engine Corvette?",
    answer:
      "The C8 Corvette has unique storage requirements due to its mid-engine layout. The dry sump oil system needs periodic activation to keep oil distributed through the engine. The dual-clutch transmission benefits from periodic engagement to prevent clutch plate adhesion. The frunk and engine bay lids should both be checked for proper seal alignment after extended storage. The C8's electronic limited-slip differential and magnetic ride control system draw standby battery power, making a quality battery tender essential. The Z06's flat-plane crank LT6 engine is particularly sensitive to oil starvation and needs more frequent starts (every 2 weeks) compared to the standard LT2.",
  },
  {
    question: "Are there different storage needs for classic vs modern Corvettes?",
    answer:
      "Yes, there are significant differences between classic and modern Corvette storage. Classic Corvettes (C1-C3) have chrome bumpers, trim, and emblems that pit and corrode in humid conditions, requiring lower humidity levels (40-50%). Their carbureted engines need fuel stabilizer and more frequent starts to prevent varnishing. Rubber weatherstripping, vinyl tops, and soft tops dry rot without proper humidity control. Modern Corvettes (C5-C8) have complex electronics that drain batteries faster, advanced traction and stability systems that benefit from periodic activation, and performance tires that flat-spot more readily. C4 Corvettes fall in between, with electronic fuel injection but simpler electronics than later models.",
  },
  {
    question: "What is a winter storage checklist for a Corvette?",
    answer:
      "A complete winter storage checklist for a Corvette includes: wash and wax thoroughly, then apply paint sealant. Fill the fuel tank and add a fuel stabilizer rated for ethanol fuel. Change oil and filter to remove contaminants. Inflate tires to 40 PSI or use tire cradles to prevent flat spots. Connect a quality battery tender (CTEK or Battery Tender brand). Do not engage the parking brake -- use wheel chocks to prevent brake pad adhesion. Place moisture-absorbing desiccant packs in the cabin and trunk. Stuff steel wool in the exhaust tips and air intake to prevent rodent nesting. Cover with a breathable indoor car cover. For convertibles, leave the top up to maintain its shape. Check antifreeze concentration if stored in unheated spaces.",
  },
];

export default async function CorvetteStoragePage() {
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

  const faqJsonLd = JSON.stringify(faqPageJsonLd(faqs));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Corvette Storage
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            America&apos;s sports car deserves America&apos;s best storage. From
            first-generation C1 classics to the mid-engine C8, find facilities
            built for Corvette care.
          </p>
          <Link href="/search?vehicleType=CLASSIC">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              Find Corvette Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Corvette-Specific Storage Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Thermometer className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Fiberglass Body Care</h3>
            <p className="text-sm text-muted-foreground">
              UV and humidity protection to prevent fiberglass micro-blistering,
              gelcoat yellowing, and composite panel degradation across all
              Corvette generations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Generation-Specific Needs</h3>
            <p className="text-sm text-muted-foreground">
              C1-C3 chrome trim and rubber seal care. C4-C7 plastic and
              composite protection. C8 carbon fiber and mid-engine layout
              considerations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Engine Preservation</h3>
            <p className="text-sm text-muted-foreground">
              LT, LS, and LT6 specific protocols. Dry sump care for C8 models.
              Periodic starts every 2-3 weeks to circulate oil and prevent seal
              degradation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Tire Flat-Spot Prevention</h3>
            <p className="text-sm text-muted-foreground">
              Tire cradles or regular rotation schedule to prevent flat spots on
              performance tires. Over-inflate to 40 PSI for seasonal storage
              periods.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Corvette Storage Facilities
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
                <Button variant="outline">View All Corvette Storage</Button>
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
          Own a Corvette Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of Corvette owners
          searching for premium storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
