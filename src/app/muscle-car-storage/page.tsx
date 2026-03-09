import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chrome, Cog, Thermometer, CalendarRange } from "lucide-react";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Muscle Car Storage | Secure Facilities for American Performance",
  description:
    "Find secure muscle car storage for Corvette, Camaro, Mustang, Challenger, and more. Climate-controlled facilities to preserve your American performance car.",
  alternates: { canonical: "https://autovault.network/muscle-car-storage" },
  openGraph: {
    title: "Muscle Car Storage | Secure Facilities for American Performance",
    description:
      "Find secure muscle car storage for Corvette, Camaro, Mustang, Challenger, and more. Climate-controlled facilities to preserve your American performance car.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muscle Car Storage | AutoVault",
    description:
      "Find secure muscle car storage for Corvette, Camaro, Mustang, Challenger, and more. Climate-controlled facilities to preserve your American performance car.",
  },
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

  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Muscle Car Storage" },
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
            Muscle Car Storage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Purpose-built storage for America&apos;s iconic performance machines.
            Climate-controlled facilities that preserve chrome, paint, and engine
            performance.
          </p>
          <div className="mt-10">
            <Link href="/search?vehicleType=CLASSIC">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Find Muscle Car Storage Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-light text-center text-foreground mb-14">
          What to Look For in Muscle Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Chrome, title: "Chrome Protection", desc: "Controlled humidity prevents chrome pitting and oxidation on bumpers, trim, and emblems." },
            { icon: Cog, title: "Engine Preservation", desc: "Periodic engine starts, fluid circulation, and fogging services keep powertrains ready to run." },
            { icon: Thermometer, title: "Climate Control", desc: "Consistent temperature and humidity prevents paint oxidation, interior cracking, and rubber dry rot." },
            { icon: CalendarRange, title: "Seasonal Storage", desc: "Winter storage programs with intake prep, periodic starts, and spring de-winterization service." },
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
              Muscle Car Storage Facilities
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
              <Link href="/search?vehicleType=CLASSIC">
                <Button variant="outline">View All Muscle Car Storage</Button>
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
            Own a Muscle Car Storage Facility?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            List your facility on AutoVault and reach thousands of muscle car
            enthusiasts searching for secure, climate-controlled storage.
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
