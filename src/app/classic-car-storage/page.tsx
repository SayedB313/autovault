import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FacilityCard } from "@/components/facility-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Gauge, Droplets, Wrench, FileCheck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classic Car Storage | Collector Vehicle Facilities | AutoVault",
  description:
    "Find specialized classic car storage and collector vehicle facilities near you. Climate-controlled, secure storage to preserve your vintage automobile's value.",
  keywords:
    "classic car storage, collector car storage, vintage car storage, antique car storage, museum car storage",
};

const FEATURES = [
  {
    icon: Gauge,
    title: "Temperature Control",
    description:
      "Stable temperatures between 50-70°F prevent rubber degradation, fluid breakdown, and paint damage.",
  },
  {
    icon: Droplets,
    title: "Humidity Control",
    description:
      "40-50% relative humidity prevents rust, mold, and corrosion on chrome, steel, and leather.",
  },
  {
    icon: Wrench,
    title: "Maintenance Access",
    description:
      "Battery tenders, periodic engine runs, and fluid top-offs keep your classic road-ready.",
  },
  {
    icon: FileCheck,
    title: "Provenance Records",
    description:
      "Documented storage history adds value at auction and protects your investment's pedigree.",
  },
];

export default async function ClassicCarStoragePage() {
  const facilities = await prisma.facility.findMany({
    where: {
      vehicleTypes: { hasSome: ["CLASSIC"] },
    },
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: [{ tier: "desc" }, { avgRating: "desc" }],
    take: 12,
  });

  return (
    <>
      {/* Hero — warm tint for vintage feel */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.20_0.03_85)_0%,oklch(0.08_0_0)_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Classic Car Storage
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/60">
              Preserve your classic. Find storage facilities built to protect
              vintage and collector automobiles for generations.
            </p>
            <div className="mt-10">
              <Link href="/search?vehicleType=CLASSIC">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-semibold">
                  Find Classic Storage Near You
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preservation Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Essential Classic Car Storage Features
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
                Classic Car Storage Facilities
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
              <Link href="/search?vehicleType=CLASSIC">
                <Button variant="outline" size="lg" className="px-8">
                  View All Classic Storage
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
            Specialize in Classic Car Storage?
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Reach collectors actively searching for the right facility to preserve
            their vintage automobiles.
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
