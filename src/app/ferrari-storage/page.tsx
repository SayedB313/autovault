import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Shield, Battery, Car } from "lucide-react";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ferrari Storage | Specialized Climate-Controlled Facilities",
  description:
    "Find specialized Ferrari storage facilities with climate control, battery conditioning, and expert handling. Protect your F40, 458, SF90, and more.",
  alternates: { canonical: "https://autovault.network/ferrari-storage" },
  openGraph: {
    title: "Ferrari Storage | Climate-Controlled Facilities",
    description:
      "Find specialized Ferrari storage facilities with climate control, battery conditioning, and expert handling. Protect your F40, 458, SF90, and more.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferrari Storage | AutoVault",
    description:
      "Find specialized Ferrari storage with climate control, battery conditioning, and expert handling for your F40, 458, SF90, and more.",
  },
};

const faqs = [
  {
    question: "What are the key storage requirements for a Ferrari?",
    answer:
      "Ferrari storage requires precise climate control at 60-68\u00b0F with 45-55% relative humidity to protect delicate paint finishes, carbon fiber components, and advanced electronics. The engine should be started every 2-3 weeks and brought to full operating temperature to circulate fluids and prevent seal degradation. A quality battery tender is essential, especially for models with F1 gearboxes that rely on hydraulic pressure. Flush-floor entry protects the low front splitter, and UV-filtered lighting prevents paint and interior fading.",
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
      "The ideal temperature for Ferrari storage is 60-68\u00b0F (15-20\u00b0C) with relative humidity maintained at 45-55%. Temperature stability is critical \u2014 fluctuations cause condensation that can damage Ferrari's sensitive Magneti Marelli electronics, corrode aluminum engine components, and degrade Bridgestone or Pirelli P Zero tires. Avoid storage below 50\u00b0F, as the hydraulic F1 gearbox fluid thickens and the Manettino system calibrations can drift in extreme cold.",
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

  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Ferrari Storage" },
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
            Ferrari Storage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Specialized facilities that understand the unique requirements of
            Ferrari ownership. From air-cooled classics to modern hybrids, find
            storage that protects your investment.
          </p>
          <div className="mt-10">
            <Link href="/search?vehicleType=EXOTIC&storageType=CLIMATE_CONTROLLED">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Find Ferrari Storage Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-light text-center text-foreground mb-14">
          Ferrari-Specific Storage Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Wrench, title: "Engine Start Protocol", desc: "Every 2-3 weeks with full operating temperature reached to circulate oil, exercise F1 hydraulics, and prevent seal dry-out." },
            { icon: Shield, title: "Carbon Fiber Care", desc: "UV protection and humidity maintained at 45-55% to preserve carbon fiber body panels, splitters, and interior trim from degradation." },
            { icon: Battery, title: "Battery Management", desc: "F1 battery tender for modern models with automated manual gearboxes. Hybrid system state-of-charge management for SF90 and 296 models." },
            { icon: Car, title: "Flush-Floor Entry", desc: "Level-entry bays protect the low ground clearance of Ferrari front splitters. No ramps or steep transitions that risk undercarriage damage." },
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
              Ferrari Storage Facilities
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
                <Button variant="outline">View All Ferrari Storage</Button>
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
            Own a Ferrari Storage Facility?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            List your facility on AutoVault and reach thousands of Ferrari owners
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
