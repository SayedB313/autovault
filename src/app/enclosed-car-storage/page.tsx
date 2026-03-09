import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DoorOpen, ShieldCheck, Snowflake, KeyRound } from "lucide-react";
import { faqPageJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Enclosed Car Storage | Private Vehicle Bays & Garages | AutoVault",
  description:
    "Find enclosed car storage with private, individual vehicle bays. Full protection from dust, light, and climate for luxury, exotic, and collector vehicles.",
  keywords:
    "enclosed car storage, private car storage, individual car bay, private garage storage, enclosed vehicle storage, single car garage",
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
            Enclosed Car Storage
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
            Private, fully enclosed bays offering maximum protection. Your
            vehicle is isolated from dust, light, and other vehicles in its own
            dedicated space.
          </p>
          <Link href="/search?storageType=ENCLOSED">
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Find Enclosed Storage Near You
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          What to Look For in Enclosed Car Storage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <DoorOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Individual Bays</h3>
            <p className="text-sm text-muted-foreground">
              Private, walled units with dedicated doors give your vehicle its own isolated, secure space.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Dust & UV Protection</h3>
            <p className="text-sm text-muted-foreground">
              Solid walls and ceilings block dust, contaminants, and UV light that damage paint and interiors.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Snowflake className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Climate Isolation</h3>
            <p className="text-sm text-muted-foreground">
              Individual climate zones maintain optimal temperature and humidity for each enclosed bay.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Private Access</h3>
            <p className="text-sm text-muted-foreground">
              Dedicated keys or access codes for your bay provide 24/7 entry without shared access concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Enclosed Car Storage Facilities
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
              <Link href="/search?storageType=ENCLOSED">
                <Button variant="outline">View All Enclosed Storage</Button>
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
          Own an Enclosed Car Storage Facility?
        </h2>
        <p className="text-muted-foreground mb-6">
          List your facility on AutoVault and reach thousands of vehicle owners
          searching for private, enclosed storage solutions.
        </p>
        <Link href="/pricing">
          <Button>List Your Facility</Button>
        </Link>
      </section>
    </div>
  );
}
