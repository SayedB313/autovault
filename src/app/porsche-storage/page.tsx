import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Thermometer, Gauge, Zap } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Porsche Storage | Climate-Controlled Facilities for 911 & More | AutoVault",
  description:
    "Find Porsche storage facilities with climate control and expert handling. From air-cooled 911s to GT3 RS and Taycan, find storage tailored to your Porsche.",
  keywords:
    "Porsche storage, 911 storage, Porsche GT3 storage, Porsche Taycan storage, air cooled Porsche storage, Porsche climate controlled storage",
};

const faqs = [
  {
    question: "What are the key storage requirements for a Porsche 911?",
    answer:
      "Porsche 911 storage requires climate control at 60-68°F with 45-55% relative humidity. The flat-six engine should be started every 2-3 weeks and brought to full operating temperature to circulate dry sump oil and prevent cylinder bore corrosion. A quality battery tender is essential, as Porsche electronics draw standby current. For air-cooled models (pre-1999), stable humidity is critical to prevent corrosion on non-coated aluminum engine components. GT models with PCCB ceramic brakes need dry conditions to prevent rotor moisture absorption.",
  },
  {
    question: "How much does Porsche storage cost per month?",
    answer:
      "Porsche storage costs between $300 and $1,500 per month depending on the model and facility tier. A modern 911 Carrera in basic climate-controlled storage runs $300-$500/month. GT3 RS, GT2 RS, and other GT-designated models typically require premium facilities at $500-$1,000/month. Rare air-cooled models and collectible Porsches (Singer restorations, 993 GT2, 959) command $800-$1,500/month at specialized facilities. Multi-car discounts of 15-25% are common for Porsche owners with multiple vehicles.",
  },
  {
    question: "Are there different storage needs for air-cooled vs water-cooled Porsches?",
    answer:
      "Yes, there are meaningful differences. Air-cooled Porsches (pre-1999) have exposed aluminum engine components without the corrosion protection of modern coatings, making humidity control more critical. Their Bosch CIS or Motronic fuel injection systems can develop issues from fuel varnishing during extended storage. Water-cooled Porsches (996 onward) need coolant system maintenance and are more sensitive to battery drain from complex electronics. Both benefit from dry sump oil circulation, but air-cooled engines are more prone to cylinder bore scoring if started cold without proper warm-up.",
  },
  {
    question: "Is the IMS bearing a concern for Porsches in storage?",
    answer:
      "The intermediate shaft (IMS) bearing is a known concern for 996 and early 997 Porsches (1999-2008, excluding GT3/GT3 RS/Turbo models). Extended storage can actually be harder on the IMS bearing because lack of oil circulation allows the bearing to sit without lubrication. If storing a 996 or early 997 long-term, periodic engine starts every 2 weeks are particularly important to keep oil flowing to the IMS bearing. Many owners opt for a preventive IMS bearing upgrade before putting these models into long-term storage. The bearing was redesigned for the 997.2 (2009+) and is not a concern on those or later models.",
  },
  {
    question: "What are the storage requirements for a Porsche Taycan EV?",
    answer:
      "The Porsche Taycan requires different storage protocols than combustion Porsches. The 800V lithium-ion battery should be maintained at 50-80% state of charge during storage -- never store fully charged or below 20%. The battery management system draws standby power, so plug in to a Level 2 charger monthly or use Porsche's built-in scheduled charging to maintain optimal levels. Keep the 12V accessory battery on a tender. Climate control is still important: store at 50-68°F to protect battery health and cabin materials. Enable transport mode in the PCM to reduce parasitic draw. Taycan tires are heavy due to the vehicle's weight and flat-spot more easily, so use tire cradles for storage beyond 6 weeks.",
  },
  {
    question: "What does a GT3 RS need in storage beyond a standard 911?",
    answer:
      "The GT3 RS has specific storage needs beyond a standard 911. Its naturally aspirated flat-six revs to 9,000+ RPM and benefits from more frequent starts (every 2 weeks) to keep the high-performance internals lubricated. PCCB carbon-ceramic brakes must be stored in low-humidity conditions to prevent moisture absorption in the ceramic matrix. The rear wing's hydraulic or fixed aero components need periodic inspection. The roll cage and racing bucket seats should be covered to prevent UV damage. The center-lock wheels require specific torque protocols when repositioning for flat-spot prevention. GT3 RS tires are ultra-high-performance compounds that flat-spot easily -- tire cradles are strongly recommended.",
  },
];

export default async function PorscheStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["EXOTIC", "CLASSIC"] },
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
      <section className="bg-gradient-to-b from-slate-800 to-slate-700 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Porsche Storage
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            From air-cooled 911 classics to modern GT3 RS track weapons and
            Taycan EVs. Find storage facilities that understand Porsche
            engineering.
          </p>
          <Link href="/search?vehicleType=EXOTIC">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Find Porsche Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Porsche-Specific Storage Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="font-semibold mb-2">Flat-Six Maintenance</h3>
            <p className="text-sm text-muted-foreground">
              Dry sump oil circulation every 2-3 weeks. IMS bearing care for
              996/997.1 models. Full operating temperature reached each start
              cycle.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Thermometer className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Air-Cooled Preservation</h3>
            <p className="text-sm text-muted-foreground">
              No humidity extremes for early 911s. Uncoated aluminum engine
              components require stable 45-55% relative humidity to prevent
              corrosion.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Gauge className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">GT Car Handling</h3>
            <p className="text-sm text-muted-foreground">
              PCCB ceramic brake protection in dry conditions. Active aero
              inspection. Center-lock wheel torque protocols for flat-spot
              prevention.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Taycan EV Storage</h3>
            <p className="text-sm text-muted-foreground">
              Battery state of charge maintained at 50-80%. 12V accessory
              battery tending. Transport mode enabled to minimize parasitic
              draw.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Porsche Storage Facilities
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
                <Button variant="outline">View All Porsche Storage</Button>
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
          Own a Porsche Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of Porsche owners
          searching for premium storage.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
