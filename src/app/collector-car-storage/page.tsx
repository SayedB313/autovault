import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplets, FileText, SunDim, Wrench } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Collector Car Storage | Museum-Quality Vehicle Preservation | AutoVault",
  description:
    "Find museum-quality collector car storage for investment-grade vehicles. Climate-controlled, humidity-regulated facilities with provenance documentation support.",
  keywords:
    "collector car storage, vintage car storage, antique car storage, investment car storage, museum car storage, collector vehicle preservation",
};

const faqs = [
  {
    question: "What is collector car storage?",
    answer:
      "Collector car storage is a specialized preservation service for investment-grade automobiles including vintage, antique, and historically significant vehicles. These museum-quality facilities maintain precise climate conditions with temperature held at 65-72°F and humidity regulated at 40-50% to prevent corrosion, paint crazing, leather deterioration, and rubber degradation. Collector storage facilities also offer provenance documentation support, ensuring that every aspect of your vehicle's storage history is properly recorded to protect its investment value.",
  },
  {
    question: "How much does collector car storage cost per month?",
    answer:
      "Collector car storage costs between $200 and $1,500 per month depending on the vehicle's value, facility tier, and services required. Basic climate-controlled indoor storage runs $200-$500/month, mid-tier facilities with humidity regulation and periodic maintenance cost $500-$900/month, and full-service museum-quality storage with white-glove handling, provenance tracking, and maintenance runs $900-$1,500/month. Vehicles requiring specialized conditions such as pre-war brass era cars or concours-level restorations may command higher rates due to additional care requirements.",
  },
  {
    question: "What humidity level is best for collector car storage?",
    answer:
      "The ideal humidity level for collector car storage is 40-50% relative humidity, maintained consistently without fluctuation. Humidity above 55% accelerates corrosion on chrome, steel, and electrical components, while humidity below 35% causes leather to crack, wood trim to split, and rubber seals to dry out and shrink. Museum-quality facilities use industrial-grade dehumidification systems with continuous monitoring and automated adjustments to maintain this precise range. Some facilities provide per-bay humidity sensors with remote owner access for real-time monitoring.",
  },
  {
    question: "What insurance do collector cars need in storage?",
    answer:
      "Collector cars in storage require agreed-value insurance policies from specialty carriers like Hagerty, Grundy, or American Collectors Insurance. Unlike standard policies that pay depreciated actual cash value, agreed-value policies guarantee the full insured amount in case of a total loss. Ensure coverage includes fire, theft, flood, and structural damage while the vehicle is in a storage facility. Many collector policies offer reduced premiums for vehicles in approved storage facilities with proper security, fire suppression, and climate control systems. Review your facility's insurance certificate to confirm adequate commercial liability coverage.",
  },
  {
    question: "How does proper storage protect provenance documentation?",
    answer:
      "Proper collector car storage protects provenance by maintaining a documented chain of custody that supports the vehicle's history and authenticity. Top-tier facilities maintain detailed intake records including photographs, condition reports, and mileage documentation. Regular inspection logs, maintenance records, and climate data create a continuous care history that enhances the vehicle's pedigree. For concours-level vehicles, this documented storage history can significantly impact value at auction -- buyers and judges look favorably on vehicles stored in professional, climate-controlled environments with proper maintenance protocols.",
  },
  {
    question: "Does proper storage help collector cars appreciate in value?",
    answer:
      "Yes, professional storage directly protects and often enhances collector car appreciation. Vehicles stored in climate-controlled, humidity-regulated environments avoid the micro-damage that accumulates over years of inadequate storage -- paint oxidation, chrome pitting, leather cracking, and rubber deterioration. Each of these issues reduces value and may require costly restoration. A well-documented storage history from a reputable facility also adds to the vehicle's provenance, which is increasingly valued by collectors and auction houses. Investment-grade vehicles can appreciate 5-15% annually when properly maintained, while poorly stored examples of the same model often depreciate.",
  },
];

export default async function CollectorCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["CLASSIC", "EXOTIC"] },
      amenities: { hasSome: ["CLIMATE_MONITORING"] },
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
            Collector Car Storage
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Museum-quality environments for investment-grade automobiles.
            Preserve value with precision climate control, humidity regulation,
            and white-glove care.
          </p>
          <Link href="/search?vehicleType=CLASSIC">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Find Collector Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          What to Look For in Collector Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Humidity Control (40-50%)</h3>
            <p className="text-sm text-muted-foreground">
              Precision humidity regulation prevents corrosion, leather cracking, and rubber degradation on vintage components.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Provenance Records</h3>
            <p className="text-sm text-muted-foreground">
              Documented chain of custody with condition reports, photos, and maintenance logs to protect investment value.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <SunDim className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">UV Protection</h3>
            <p className="text-sm text-muted-foreground">
              UV-filtered lighting and shielded bays prevent paint fading, interior discoloration, and material degradation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Maintenance Access</h3>
            <p className="text-sm text-muted-foreground">
              On-site or coordinated maintenance services keep engines, fluids, and mechanical systems in running condition.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Collector Car Storage Facilities
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
                <Button variant="outline">View All Collector Storage</Button>
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
          Own a Collector Car Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of collector car
          enthusiasts searching for museum-quality storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
