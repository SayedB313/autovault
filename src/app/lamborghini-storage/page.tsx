import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Car, Battery, Shield } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lamborghini Storage | Secure Facilities for Your Lambo | AutoVault",
  description:
    "Find specialized Lamborghini storage with climate control, V10/V12 care, and expert handling. Protect your Aventador, Huracán, Urus, and more.",
  keywords:
    "Lamborghini storage, Lambo storage, Aventador storage, Huracán storage, Lamborghini climate controlled storage, supercar storage",
};

const faqs = [
  {
    question: "What are the key storage requirements for a Lamborghini?",
    answer:
      "Lamborghini storage requires climate control at 60-68°F with 45-55% relative humidity to protect the dramatic bodywork, carbon fiber aerodynamic components, and high-performance electronics. V10 and V12 engines need periodic starts every 2-3 weeks to circulate oil and prevent bearing issues. Scissor doors on Aventador and Murciélago models require adequate bay ceiling height. Battery conditioning is critical, as Lamborghini electronics draw significant standby current. Carbon-ceramic brakes need dry storage conditions to prevent rotor moisture damage.",
  },
  {
    question: "How much does Lamborghini storage cost per month?",
    answer:
      "Lamborghini storage costs between $500 and $2,000 per month depending on the facility and services. Basic climate-controlled enclosed storage runs $500-$800/month, mid-tier with concierge services costs $800-$1,400/month, and full-service facilities with detailing, engine starts, and enclosed transport range from $1,400-$2,000/month. Premium markets like Miami, Scottsdale, and Los Angeles charge at the top of this range. Many facilities offer multi-vehicle discounts of 15-25% for owners with multiple supercars.",
  },
  {
    question: "Do Lamborghinis have battery drain issues in storage?",
    answer:
      "Yes, Lamborghinis are known for significant parasitic battery drain due to their complex electronics, security systems, and ECU standby modes. The Aventador and Huracán can drain a battery in as little as 2-3 weeks without a tender. A high-quality CTEK or Battery Tender brand maintainer rated for exotic vehicles is essential. For Revuelto and other hybrid models, both the 12V accessory battery and the high-voltage hybrid battery require separate management. Disconnect the battery if storing for more than 4 weeks without a tender.",
  },
  {
    question: "How much clearance do scissor doors need in storage?",
    answer:
      "Lamborghini scissor doors (on Aventador, Murciélago, Countach, and Diablo models) require a minimum of 8.5 feet of ceiling clearance when fully open, though 9-10 feet is recommended for comfortable entry and exit. Storage bay width should be at least 10 feet to allow doors to open fully without risk of contact with walls or adjacent vehicles. Many standard garage bays are too narrow or low for scissor door operation. When selecting a storage facility, verify the bay dimensions and ensure staff are trained in proper scissor door handling to avoid hinge damage.",
  },
  {
    question: "Are there different storage needs for Aventador vs Huracán?",
    answer:
      "Yes, there are notable differences. The Aventador uses a 6.5L V12 with a single-clutch ISR gearbox that needs careful hydraulic system maintenance during storage, while the Huracán's 5.2L V10 with a dual-clutch LDF gearbox is somewhat more storage-friendly. The Aventador's scissor doors require taller storage bays, while the Huracán uses conventional doors. Both share carbon-ceramic brake care needs, but the Aventador's pushrod suspension is more sensitive to prolonged static load. The Huracán EVO's rear-wheel steering system benefits from periodic activation during storage.",
  },
  {
    question: "What are the best seasonal storage tips for a Lamborghini?",
    answer:
      "For seasonal Lamborghini storage, start with a thorough wash and paint sealant application. Fill the fuel tank completely and add a quality fuel stabilizer. Change the oil and filter before storage to remove contaminants. Inflate tires to 40-42 PSI to prevent flat spots, or use tire cradles for storage beyond 3 months. Connect a battery tender rated for your specific model. Do not engage the parking brake -- use wheel chocks instead to prevent brake pad adhesion to rotors. Place desiccant packs in the interior and leave windows cracked slightly for air circulation. Cover with a breathable indoor car cover, never plastic.",
  },
];

export default async function LamborghiniStoragePage() {
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
      <section className="bg-gradient-to-b from-yellow-900 to-amber-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lamborghini Storage
          </h1>
          <p className="text-lg text-amber-200 max-w-2xl mx-auto mb-8">
            Purpose-built facilities for the most dramatic supercars on earth.
            Protect your V10, V12, and hybrid Lamborghini with precision climate
            control and expert care.
          </p>
          <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
            <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50">
              Find Lamborghini Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Lamborghini-Specific Storage Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">V10/V12 Engine Care</h3>
            <p className="text-sm text-muted-foreground">
              Periodic oil circulation and engine starts to maintain bearing
              health and exhaust system integrity on naturally aspirated
              powertrains.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Car className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Scissor Door Clearance</h3>
            <p className="text-sm text-muted-foreground">
              Adequate ceiling height (9ft+) and bay width (10ft+) to safely
              operate iconic scissor doors on Aventador, Countach, and
              Murciélago models.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Battery className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Battery Conditioning</h3>
            <p className="text-sm text-muted-foreground">
              12V battery tending for all models plus hybrid high-voltage
              battery management for the Revuelto and future electrified
              Lamborghini models.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Carbon-Ceramic Brake Care</h3>
            <p className="text-sm text-muted-foreground">
              Dry storage conditions to prevent moisture damage to
              carbon-ceramic brake rotors. No parking brake engagement during
              long-term storage.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Lamborghini Storage Facilities
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
                <Button variant="outline">View All Lamborghini Storage</Button>
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
          Own a Lamborghini Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of Lamborghini
          owners searching for premium storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
