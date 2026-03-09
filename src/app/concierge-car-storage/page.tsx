import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, CalendarClock, Truck, BatteryCharging } from "lucide-react";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Concierge Car Storage | White-Glove Vehicle Care",
  description:
    "Find concierge car storage with white-glove services. Detailing, maintenance scheduling, battery tending, transport coordination, and VIP access for luxury vehicle owners.",
  alternates: { canonical: "https://autovault.network/concierge-car-storage" },
  openGraph: {
    title: "Concierge Car Storage | White-Glove Vehicle Care",
    description:
      "Find concierge car storage with white-glove services. Detailing, maintenance scheduling, battery tending, transport coordination, and VIP access for luxury vehicle owners.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concierge Car Storage | AutoVault",
    description:
      "Find concierge car storage with white-glove services. Detailing, maintenance scheduling, battery tending, transport coordination, and VIP access for luxury vehicle owners.",
  },
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

  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Concierge Car Storage" },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- server-generated SEO schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- server-generated SEO schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.03_25)_0%,oklch(0.08_0_0)_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Specialized Storage
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Concierge Car Storage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            White-glove storage where your vehicle is professionally maintained,
            detailed, and ready to drive at a moment&apos;s notice.
          </p>
          <div className="mt-10">
            <Link href="/search?amenity=CONCIERGE">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Find Concierge Storage Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-light text-center text-foreground mb-14">
          What to Look For in Concierge Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Sparkles, title: "On-Demand Detailing", desc: "Professional interior and exterior detailing keeps your vehicle showroom-ready at all times." },
            { icon: CalendarClock, title: "Maintenance Scheduling", desc: "Coordinated service appointments, fluid checks, and preventive maintenance with trusted mechanics." },
            { icon: Truck, title: "Enclosed Transport", desc: "Door-to-door enclosed vehicle delivery to your home, airport, event, or any destination." },
            { icon: BatteryCharging, title: "Battery Tending", desc: "Smart conditioners maintain optimal charge levels with periodic engine starts and system checks." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-light text-foreground mb-10">
              Concierge Car Storage Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((f) => (
                <Link key={f.id} href={`/facility/${f.slug}`}>
                  <div className="bg-background rounded-xl overflow-hidden ring-1 ring-border hover:ring-primary/30 transition-all">
                    <div
                      className="h-48 bg-muted bg-cover bg-center"
                      style={{
                        backgroundImage: f.photos[0]
                          ? `url(${f.photos[0].url})`
                          : undefined,
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground truncate">{f.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {f.city}, {f.state}
                      </p>
                      {f.avgRating > 0 && (
                        <p className="text-sm mt-1">
                          <span className="text-primary">&#9733;</span> {f.avgRating.toFixed(1)}
                          <span className="text-muted-foreground"> ({f.reviewCount})</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/search?amenity=CONCIERGE">
                <Button variant="outline">View All Concierge Storage</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto px-4 max-w-4xl">
          <div className="mx-auto mb-8 h-px w-12 bg-primary" />
          <h2 className="font-serif text-3xl font-light text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-xl p-6 ring-1 ring-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground mb-4">
            Own a Concierge Car Storage Facility?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            List your facility on AutoVault and reach thousands of luxury vehicle
            owners searching for white-glove storage services.
          </p>
          <Link href="/pricing">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
              List Your Facility
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
