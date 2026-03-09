import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Box, BatteryCharging, Bell } from "lucide-react";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Supercar Storage | Climate-Controlled Facilities for Supercars",
  description:
    "Find secure, climate-controlled supercar storage near you. Purpose-built facilities for Ferrari, Lamborghini, McLaren, Porsche, Bugatti, and more. Compare pricing and features.",
  alternates: { canonical: "https://autovault.network/supercar-storage" },
  openGraph: {
    title: "Supercar Storage | Climate-Controlled Facilities for Supercars",
    description:
      "Find secure, climate-controlled supercar storage near you. Purpose-built facilities for Ferrari, Lamborghini, McLaren, Porsche, Bugatti, and more.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supercar Storage | AutoVault",
    description:
      "Find secure, climate-controlled supercar storage near you. Purpose-built facilities for Ferrari, Lamborghini, McLaren, Porsche, Bugatti, and more.",
  },
};

const faqs = [
  {
    question: "What is supercar storage?",
    answer:
      "Supercar storage is a premium vehicle storage service designed for high-performance vehicles from manufacturers like Ferrari, Lamborghini, McLaren, Porsche, and Bugatti. These purpose-built facilities feature flush-floor entry to protect low ground clearance, individual enclosed bays with dedicated climate zones, advanced battery conditioning systems, and concierge-level services. Every detail is engineered to preserve the mechanical integrity and aesthetic condition of vehicles valued at $200,000 to $5,000,000+.",
  },
  {
    question: "How much does supercar storage cost per month?",
    answer:
      "Supercar storage typically costs between $500 and $2,000 per month depending on the facility tier, location, and services included. Basic climate-controlled enclosed storage starts around $500-$800/month, mid-tier facilities with battery conditioning and periodic starts run $800-$1,400/month, and full-service concierge storage with detailing, maintenance coordination, and transport ranges from $1,400-$2,000/month. Premium markets like Miami, Los Angeles, and New York command higher pricing. Multi-car discounts of 10-20% are common.",
  },
  {
    question: "What temperature should supercars be stored at?",
    answer:
      "Supercars should be stored at a stable temperature between 60-70°F (15-21°C) with relative humidity maintained at 45-55%. Temperature consistency matters more than the exact degree -- fluctuations cause condensation that can damage sensitive electronics, corrode lightweight alloy components, and degrade high-performance tire compounds. Carbon fiber body panels and ceramic brake components are particularly sensitive to humidity extremes, making precision climate control essential for long-term preservation.",
  },
  {
    question: "Why is flush-floor entry important for supercar storage?",
    answer:
      "Flush-floor entry is critical for supercars because these vehicles typically have only 3-5 inches of ground clearance. Standard ramps, inclines, and uneven thresholds can scrape front splitters, side skirts, and underbody aerodynamic components -- repairs that often cost $5,000-$20,000+. Purpose-built supercar storage facilities feature completely level, flush transitions from driveways to interior bays, eliminating any risk of undercarriage contact during entry and exit.",
  },
  {
    question: "Do supercars need battery tenders during storage?",
    answer:
      "Yes, battery tenders are essential for stored supercars. Modern supercars have complex ECUs, hydraulic suspension systems, and multiple battery management modules that draw power even when the vehicle is off. Without a quality battery tender, batteries can drain in 2-4 weeks, leading to system recalibration issues costing $1,000-$5,000 at a dealer. Premium storage facilities provide CTEK or Battery Tender brand conditioners connected to each vehicle, maintaining optimal charge levels and extending battery lifespan.",
  },
  {
    question: "What insurance do I need for a stored supercar?",
    answer:
      "Stored supercars require agreed-value insurance rather than standard actual cash value policies. Work with specialty insurers like Hagerty, Chubb, or AIG Private Client who understand supercar valuations. Ensure your policy covers the vehicle at its full agreed value while in storage, including fire, theft, flood, and facility structural damage. Verify that your storage facility carries adequate commercial liability insurance (minimum $1 million) and confirm their coverage doesn't conflict with your personal policy. Many facilities require proof of insurance before accepting vehicles.",
  },
];

export default async function SupercarStoragePage() {
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

  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Supercar Storage" },
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
            Supercar Storage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Purpose-built facilities with flush-floor entry, individual enclosed
            bays, and concierge services for the world&apos;s most exclusive vehicles.
          </p>
          <div className="mt-10">
            <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Find Supercar Storage Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-light text-center text-foreground mb-14">
          What to Look For in Supercar Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ArrowDownToLine, title: "Flush-Floor Entry", desc: "Level, zero-incline access protects low-clearance splitters, side skirts, and underbody aero components." },
            { icon: Box, title: "Individual Bays", desc: "Private, fully enclosed bays isolate your vehicle from dust, light, and contact with other cars." },
            { icon: BatteryCharging, title: "Battery Conditioning", desc: "Smart tenders maintain optimal charge levels, preventing costly ECU recalibration and system failures." },
            { icon: Bell, title: "Concierge Services", desc: "On-demand detailing, maintenance scheduling, transport coordination, and vehicle preparation." },
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
              Supercar Storage Facilities
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
              <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
                <Button variant="outline">View All Supercar Storage</Button>
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
            Own a Supercar Storage Facility?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            List your facility on AutoVault and reach thousands of supercar owners
            searching for premium storage.
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
