import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, CalendarClock, Truck, BatteryCharging } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Concierge Car Storage | White-Glove Vehicle Care | AutoVault",
  description:
    "Find concierge car storage with white-glove services. Detailing, maintenance scheduling, battery tending, transport coordination, and VIP access for luxury vehicle owners.",
  keywords:
    "concierge car storage, white glove car storage, valet car storage, luxury car concierge, car storage with detailing, car storage with maintenance",
};

const faqs = [
  {
    question: "What is concierge car storage?",
    answer:
      "Concierge car storage is a premium, full-service vehicle storage experience where dedicated staff manage every aspect of your vehicle's care. Beyond climate-controlled storage, concierge facilities provide on-demand detailing, scheduled maintenance, battery conditioning, tire pressure management, fluid top-offs, and enclosed transport coordination. Your vehicle is professionally maintained and ready to drive at a moment's notice -- whether you need it delivered to your home, an airport, or an event.",
  },
  {
    question: "How much does concierge car storage cost per month?",
    answer:
      "Concierge car storage ranges from $700 to $2,000 per month depending on the service level and market. Base concierge packages at $700-$1,000/month typically include climate-controlled enclosed storage, battery tending, periodic engine starts, and basic detailing. Premium concierge at $1,000-$1,500/month adds scheduled maintenance coordination, detailed condition reporting, and transport services. Elite concierge at $1,500-$2,000/month includes unlimited detailing, on-demand vehicle delivery, and dedicated account management. Some facilities offer a la carte concierge add-ons starting at $100-$300/month.",
  },
  {
    question: "What services are included in concierge car storage?",
    answer:
      "Concierge car storage services typically include: climate-controlled enclosed storage, battery conditioning and tending, periodic engine starts and idle cycles, interior and exterior detailing (frequency varies by tier), tire pressure monitoring and adjustment, fluid level checks and top-offs, maintenance scheduling with preferred mechanics, enclosed transport coordination, vehicle preparation for pickup or events, detailed photo condition reports, and 24/7 owner access or scheduled vehicle retrieval. Premium facilities may also offer fuel management, registration renewal assistance, and insurance coordination.",
  },
  {
    question: "How often is my car detailed in concierge storage?",
    answer:
      "Detailing frequency in concierge storage depends on the service tier. Basic concierge packages include a full detail upon intake and one detail every 60-90 days. Mid-tier concierge provides monthly exterior washes with quarterly full details. Premium concierge includes bi-weekly exterior maintenance and monthly comprehensive detailing covering paint decontamination, interior conditioning, and wheel care. Most facilities also offer pre-pickup detailing so your vehicle is showroom-ready whenever you request it. Additional detailing services like ceramic coating maintenance or leather conditioning can be scheduled on demand.",
  },
  {
    question: "Can concierge storage coordinate vehicle transport?",
    answer:
      "Yes, transport coordination is a core concierge storage service. Facilities work with vetted enclosed transport carriers to move your vehicle safely between locations -- from storage to your home, airport, vacation property, or events. Most concierge facilities offer local delivery within their metro area (often included or at a flat fee), regional transport, and cross-country enclosed shipping. Lead times range from same-day for local delivery to 3-7 days for long-distance transport. Some premium facilities maintain their own enclosed trailers for immediate local transport availability.",
  },
  {
    question: "How is concierge storage different from standard car storage?",
    answer:
      "Standard car storage provides a space and basic security for your vehicle. Concierge car storage provides a complete vehicle care program. The key differences include: dedicated staff assigned to your vehicle vs. self-service access, proactive maintenance and monitoring vs. passive storage, professional detailing included vs. owner responsibility, transport and delivery services vs. owner pickup only, detailed condition reporting vs. no reporting, and vehicle preparation for use vs. as-stored condition. Concierge storage treats your vehicle as a managed asset rather than a parked possession, making it ideal for owners who want their cars maintained and ready without personal involvement.",
  },
];

export default async function ConciergeCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      amenities: { hasSome: ["CONCIERGE", "DETAILING", "MAINTENANCE"] },
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
            Concierge Car Storage
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            White-glove storage where your vehicle is professionally maintained,
            detailed, and ready to drive at a moment&apos;s notice.
          </p>
          <Link href="/search?amenity=CONCIERGE">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Find Concierge Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          What to Look For in Concierge Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">On-Demand Detailing</h3>
            <p className="text-sm text-muted-foreground">
              Professional interior and exterior detailing keeps your vehicle showroom-ready at all times.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Maintenance Scheduling</h3>
            <p className="text-sm text-muted-foreground">
              Coordinated service appointments, fluid checks, and preventive maintenance with trusted mechanics.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Enclosed Transport</h3>
            <p className="text-sm text-muted-foreground">
              Door-to-door enclosed vehicle delivery to your home, airport, event, or any destination.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <BatteryCharging className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Battery Tending</h3>
            <p className="text-sm text-muted-foreground">
              Smart conditioners maintain optimal charge levels with periodic engine starts and system checks.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Concierge Car Storage Facilities
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
              <Link href="/search?amenity=CONCIERGE">
                <Button variant="outline">View All Concierge Storage</Button>
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
          Own a Concierge Car Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of luxury vehicle
          owners searching for white-glove storage services.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
