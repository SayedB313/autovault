import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FacilityCard } from "@/components/facility-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Shield, Thermometer, Lock, Eye, ArrowRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Exotic Car Storage | Climate-Controlled Facilities",
  description:
    "Find secure, climate-controlled exotic car storage near you. Purpose-built facilities for Ferrari, Lamborghini, Porsche, McLaren and more. Compare pricing and features.",
  alternates: { canonical: "https://autovault.network/exotic-car-storage" },
  openGraph: {
    title: "Exotic Car Storage | Climate-Controlled Facilities",
    description:
      "Find secure, climate-controlled exotic car storage near you. Purpose-built facilities for Ferrari, Lamborghini, Porsche, McLaren and more.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exotic Car Storage | AutoVault",
    description:
      "Find secure, climate-controlled exotic car storage near you. Purpose-built facilities for Ferrari, Lamborghini, Porsche, McLaren and more.",
  },
};

const FEATURES = [
  {
    icon: Thermometer,
    title: "Climate Control",
    description:
      "Consistent temperature and humidity prevents paint damage, interior degradation, and tire flat-spotting.",
  },
  {
    icon: Lock,
    title: "24/7 Security",
    description:
      "Gated access, camera surveillance, alarm systems, and fire suppression protect your investment.",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description:
      "Facilities should carry adequate liability insurance and support your collector car policy requirements.",
  },
  {
    icon: Eye,
    title: "Concierge Service",
    description:
      "Battery tending, detailing, maintenance scheduling, and transport coordination on demand.",
  },
];

export default async function ExoticCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["EXOTIC"] },
    },
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
    take: 12,
  });

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Exotic Car Storage" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- server-generated SEO schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.16_0_0)_0%,oklch(0.08_0_0)_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Exotic Car Storage
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/60">
              Your supercar deserves more than a garage. Find climate-controlled,
              high-security storage designed specifically for exotic vehicles.
            </p>
            <div className="mt-10">
              <Link href="/search?vehicleType=EXOTIC">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-semibold">
                  Find Exotic Storage Near You
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            What to Look For in Exotic Car Storage
          </h2>
        </AnimateOnScroll>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 100} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
                <feature.icon className="size-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="bg-card py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll className="mb-14">
              <div className="mx-auto mb-6 h-px w-12 bg-primary" />
              <h2 className="font-serif text-3xl font-light tracking-tight text-foreground">
                Exotic Car Storage Facilities
              </h2>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility, i) => (
                <AnimateOnScroll key={facility.id} delay={i * 80}>
                  <FacilityCard facility={facility} />
                </AnimateOnScroll>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/search?vehicleType=EXOTIC">
                <Button variant="outline" size="lg" className="px-8">
                  View All Exotic Storage
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground">
            Own an Exotic Car Storage Facility?
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            List your facility on AutoVault and reach thousands of exotic car owners
            searching for premium storage.
          </p>
          <div className="mt-8">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                List Your Facility
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
