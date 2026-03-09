import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DoorOpen, ShieldCheck, Snowflake, KeyRound } from "lucide-react";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Enclosed Car Storage | Private Vehicle Bays & Garages",
  description:
    "Find enclosed car storage with private, individual vehicle bays. Full protection from dust, light, and climate for luxury, exotic, and collector vehicles.",
  alternates: { canonical: "https://autovault.network/enclosed-car-storage" },
  openGraph: {
    title: "Enclosed Car Storage | Private Vehicle Bays & Garages",
    description:
      "Find enclosed car storage with private, individual vehicle bays. Full protection from dust, light, and climate for luxury, exotic, and collector vehicles.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enclosed Car Storage | AutoVault",
    description:
      "Find enclosed car storage with private, individual vehicle bays. Full protection from dust, light, and climate for luxury, exotic, and collector vehicles.",
  },
};

const faqs = [
  {
    question: "What is enclosed car storage?",
    answer:
      "Enclosed car storage provides your vehicle with a private, fully walled bay or individual garage unit within a larger storage facility. Unlike open-plan indoor storage where vehicles share a common floor, enclosed storage isolates your car in its own dedicated space with solid walls, a ceiling, and typically a locking door. This provides maximum protection from dust, ambient light, accidental contact with other vehicles, and environmental contaminants. Enclosed bays range from basic single-car units to premium climate-controlled suites with their own lighting and power.",
  },
  {
    question: "How much does enclosed car storage cost per month?",
    answer:
      "Enclosed car storage costs between $300 and $1,200 per month depending on the bay size, climate control, and market. Basic enclosed bays without climate control run $300-$500/month, climate-controlled enclosed units cost $500-$800/month, and premium enclosed suites with individual climate zones, dedicated power, and enhanced security range from $800-$1,200/month. Larger bays for extended-length vehicles or multi-car units command higher pricing. Urban markets like New York, San Francisco, and Los Angeles are at the top of the range, while suburban and rural facilities offer more competitive rates.",
  },
  {
    question: "What is the difference between enclosed and indoor car storage?",
    answer:
      "Indoor car storage places your vehicle inside a building but typically in a shared, open-plan space with other vehicles. Enclosed car storage goes further by placing your vehicle in its own private bay with dedicated walls, ceiling, and door. The key advantages of enclosed over basic indoor are: complete dust and particulate isolation, protection from accidental door dings and bumper contact from adjacent vehicles, individual light control to prevent UV-related fading, greater privacy and security with a dedicated locking entry, and the option for individual climate zone control. Enclosed storage costs 30-60% more than open indoor but offers significantly superior protection.",
  },
  {
    question: "What size enclosed bays are available?",
    answer:
      "Enclosed car storage bays come in several standard sizes. Standard bays (10x20 feet) accommodate most sedans, coupes, and sports cars. Large bays (12x24 feet) fit full-size luxury sedans, SUVs, and vehicles with wider body kits. Extended bays (12x30 feet) accommodate limousines, large SUVs, and trucks. Double bays (20x24 feet) store two vehicles side by side. Some facilities offer custom-sized bays for unusual vehicle dimensions. When selecting a bay size, ensure at least 18 inches of clearance on each side and 24 inches in front and rear to allow safe entry, exit, and door opening.",
  },
  {
    question: "How accessible is my car in enclosed storage?",
    answer:
      "Access policies for enclosed car storage vary by facility. Most facilities offer 24/7 access with your own key or access code to your individual bay. Some premium facilities provide scheduled access with staff assistance to ensure proper vehicle handling and bay security. Many offer a blend -- 24/7 self-access during business hours with after-hours access by appointment or via security escort. When evaluating facilities, ask about access hours, whether you receive a dedicated key or code, pull-through vs. back-in bay orientation, and whether staff assistance is required for vehicle movement.",
  },
  {
    question: "How does enclosed storage protect paint and finishes?",
    answer:
      "Enclosed storage protects paint and finishes in multiple ways. Physical isolation eliminates the risk of door dings, shopping cart damage, and contact from adjacent vehicles or foot traffic. Solid walls and ceilings block ambient dust and airborne contaminants that settle on surfaces and cause micro-scratching during removal. UV protection from enclosed bays prevents paint oxidation, clear coat degradation, and interior fading that occurs even under fluorescent indoor lighting. Climate-controlled enclosed bays additionally prevent humidity-related damage like water spotting, rust formation under paint, and clear coat delamination. For concours-level or investment vehicles, enclosed storage is the minimum recommended protection level.",
  },
];

export default async function EnclosedCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      storageTypes: { hasSome: ["ENCLOSED"] },
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
    { name: "Enclosed Car Storage" },
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
            Enclosed Car Storage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Private, fully enclosed bays offering maximum protection. Your
            vehicle is isolated from dust, light, and other vehicles in its own
            dedicated space.
          </p>
          <div className="mt-10">
            <Link href="/search?storageType=ENCLOSED">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Find Enclosed Storage Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-light text-center text-foreground mb-14">
          What to Look For in Enclosed Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: DoorOpen, title: "Individual Bays", desc: "Private, walled units with dedicated doors give your vehicle its own isolated, secure space." },
            { icon: ShieldCheck, title: "Dust & UV Protection", desc: "Solid walls and ceilings block dust, contaminants, and UV light that damage paint and interiors." },
            { icon: Snowflake, title: "Climate Isolation", desc: "Individual climate zones maintain optimal temperature and humidity for each enclosed bay." },
            { icon: KeyRound, title: "Private Access", desc: "Dedicated keys or access codes for your bay provide 24/7 entry without shared access concerns." },
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
              Enclosed Car Storage Facilities
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
              <Link href="/search?storageType=ENCLOSED">
                <Button variant="outline">View All Enclosed Storage</Button>
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
            Own an Enclosed Car Storage Facility?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            List your facility on AutoVault and reach thousands of vehicle owners
            searching for private, enclosed storage solutions.
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
