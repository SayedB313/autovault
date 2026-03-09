import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Shield, Battery, Car } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ferrari Storage | Specialized Climate-Controlled Facilities | AutoVault",
  description:
    "Find specialized Ferrari storage facilities with climate control, battery conditioning, and expert handling. Protect your F40, 458, SF90, and more.",
  keywords:
    "Ferrari storage, Ferrari car storage, Ferrari F40 storage, Ferrari 458 storage, store my Ferrari, Ferrari climate controlled storage",
};

const faqs = [
  {
    question: "What are the key storage requirements for a Ferrari?",
    answer:
      "Ferrari storage requires precise climate control at 60-68°F with 45-55% relative humidity to protect delicate paint finishes, carbon fiber components, and advanced electronics. The engine should be started every 2-3 weeks and brought to full operating temperature to circulate fluids and prevent seal degradation. A quality battery tender is essential, especially for models with F1 gearboxes that rely on hydraulic pressure. Flush-floor entry protects the low front splitter, and UV-filtered lighting prevents paint and interior fading.",
  },
  {
    question: "How much does Ferrari storage cost per month?",
    answer:
      "Ferrari storage typically costs between $500 and $2,000 per month depending on the facility tier and services included. Basic climate-controlled indoor storage runs $500-$800/month, mid-tier with concierge services costs $800-$1,400/month, and full-service facilities with detailing, engine starts, and transport range from $1,400-$2,000/month. Markets like Miami, Scottsdale, and Los Angeles command premium pricing. Multi-car discounts of 15-25% are common for owners storing multiple Ferraris.",
  },
  {
    question: "How often should I start my Ferrari while in storage?",
    answer:
      "Your Ferrari should be started every 2-3 weeks and allowed to reach full operating temperature (approximately 15-20 minutes of idle and light rev cycles). This circulates oil through the flat-plane crankshaft, charges the battery, exercises the F1 gearbox hydraulics on automated manual models, and prevents seal dry-out. For carbureted models like the F40 and earlier cars, more frequent starts may be needed to keep carburetors from varnishing. Always consult Ferrari's official long-term storage guidelines for your specific model.",
  },
  {
    question: "What is the ideal temperature for storing a Ferrari?",
    answer:
      "The ideal temperature for Ferrari storage is 60-68°F (15-20°C) with relative humidity maintained at 45-55%. Temperature stability is critical -- fluctuations cause condensation that can damage Ferrari's sensitive Magneti Marelli electronics, corrode aluminum engine components, and degrade Bridgestone or Pirelli P Zero tires. Avoid storage below 50°F, as the hydraulic F1 gearbox fluid thickens and the Manettino system calibrations can drift in extreme cold.",
  },
  {
    question: "Are there different storage needs for an F40 vs a modern Ferrari?",
    answer:
      "Yes, there are significant differences. The F40 and other carbureted or early fuel-injected Ferraris (308, 348, 355) require more frequent engine starts to prevent carburetor varnishing and fuel system degradation. Their simpler electronics are less sensitive, but the tubular chassis and Kevlar/carbon body panels need careful humidity control. Modern Ferraris (458, 488, SF90) have complex ECUs, hybrid battery systems, and electronically controlled suspensions that require battery conditioning and periodic system activation. The SF90 Stradale's plug-in hybrid battery needs state-of-charge management between 40-80%.",
  },
  {
    question: "What insurance do I need for a Ferrari in storage?",
    answer:
      "For a Ferrari in storage, you need an agreed-value collector car insurance policy rather than standard auto coverage. Companies like Hagerty, Grundy, and Chubb specialize in Ferrari coverage. Ensure the policy covers the full agreed value (not actual cash value), includes storage-specific perils like fire, flood, and theft, and does not require the car to be driven regularly. Verify the storage facility carries adequate liability insurance ($1M+ recommended) and that their coverage coordinates with your personal policy. Some insurers offer reduced premiums for vehicles stored in approved climate-controlled facilities.",
  },
];

export default async function FerrariStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["EXOTIC"] },
      storageTypes: { hasSome: ["CLIMATE_CONTROLLED", "ENCLOSED"] },
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
      <section className="bg-gradient-to-b from-red-900 to-red-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ferrari Storage
          </h1>
          <p className="text-lg text-red-200 max-w-2xl mx-auto mb-8">
            Specialized facilities that understand the unique requirements of
            Ferrari ownership. From air-cooled classics to modern hybrids, find
            storage that protects your investment.
          </p>
          <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
            <Button size="lg" className="bg-white text-red-900 hover:bg-red-50">
              Find Ferrari Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Ferrari-Specific Storage Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Engine Start Protocol</h3>
            <p className="text-sm text-muted-foreground">
              Every 2-3 weeks with full operating temperature reached to
              circulate oil, exercise F1 hydraulics, and prevent seal dry-out.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Carbon Fiber Care</h3>
            <p className="text-sm text-muted-foreground">
              UV protection and humidity maintained at 45-55% to preserve carbon
              fiber body panels, splitters, and interior trim from degradation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Battery className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Battery Management</h3>
            <p className="text-sm text-muted-foreground">
              F1 battery tender for modern models with automated manual
              gearboxes. Hybrid system state-of-charge management for SF90 and
              296 models.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Flush-Floor Entry</h3>
            <p className="text-sm text-muted-foreground">
              Level-entry bays protect the low ground clearance of Ferrari front
              splitters. No ramps or steep transitions that risk undercarriage
              damage.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Ferrari Storage Facilities
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
              <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
                <Button variant="outline">View All Ferrari Storage</Button>
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
          Own a Ferrari Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of Ferrari owners
          searching for premium storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
