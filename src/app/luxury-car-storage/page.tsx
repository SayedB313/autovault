import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  Thermometer,
  Eye,
  Lock,
  Car,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { FacilityCard } from "@/components/facility-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Luxury Car Storage - Climate Controlled, High Security",
  description:
    "Find premium luxury car storage facilities for exotic, classic, and collector vehicles. Climate-controlled environments with concierge service, 24/7 security, and white-glove care.",
  alternates: { canonical: "https://autovault.network/luxury-car-storage" },
  openGraph: {
    title: "Luxury Car Storage - Climate Controlled, High Security",
    description:
      "Find premium luxury car storage facilities for exotic, classic, and collector vehicles. Climate-controlled environments with concierge service, 24/7 security, and white-glove care.",
    siteName: "AutoVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Car Storage | AutoVault",
    description:
      "Find premium luxury car storage facilities for exotic, classic, and collector vehicles. Climate-controlled environments with concierge service, 24/7 security, and white-glove care.",
  },
};

const CHECKLIST_ITEMS = [
  {
    icon: Thermometer,
    title: "Climate Control",
    description:
      "Temperature and humidity regulated to protect paint, leather, and rubber components from deterioration.",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description:
      "24/7 surveillance, biometric access, alarm systems, and dedicated security personnel for maximum protection.",
  },
  {
    icon: Eye,
    title: "Regular Inspections",
    description:
      "Routine condition checks, tire pressure monitoring, and battery maintenance to keep your vehicle in peak condition.",
  },
  {
    icon: Lock,
    title: "Insurance Coverage",
    description:
      "Comprehensive insurance options specifically designed for high-value and collectible vehicles.",
  },
  {
    icon: Car,
    title: "Transport Services",
    description:
      "Enclosed transport available for safe pickup and delivery of your vehicle to and from the storage facility.",
  },
  {
    icon: Sparkles,
    title: "Detailing & Maintenance",
    description:
      "Professional detailing, fluid top-offs, and preventive maintenance services to keep your car showroom-ready.",
  },
];

export default async function LuxuryCarStoragePage() {
  const luxuryFacilities = await prisma.facility.findMany({
    where: {
      OR: [
        { vehicleTypes: { hasSome: ["EXOTIC", "CLASSIC"] } },
        { amenities: { hasSome: ["CONCIERGE", "DETAILING"] } },
      ],
      tier: { in: ["VERIFIED", "PREMIUM"] },
    },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { avgRating: "desc" },
    take: 6,
  });

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://autovault.network" },
    { name: "Luxury Car Storage" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- server-generated SEO schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.02_85)_0%,oklch(0.08_0_0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.22_0.04_85)_0%,transparent_50%)] opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Star className="size-4 fill-current" />
              Premium Vehicle Storage
            </div>
            <h1 className="font-serif text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Luxury Car{" "}
              <span className="text-primary">Storage</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/60">
              Premium climate-controlled facilities with concierge service for
              exotic, classic, and collector vehicles. Your prized automobile
              deserves world-class care.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <Link href="/search?vehicleType=EXOTIC,CLASSIC&storageType=CLIMATE_CONTROLLED">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              >
                Find Luxury Storage
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Storage Designed for High-Value Vehicles
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Standard parking garages and driveways expose your investment to
            the elements, theft, and accidental damage. Luxury car storage
            facilities provide purpose-built environments with precise
            temperature control, advanced security systems, and professional
            staff dedicated to preserving the condition and value of your
            vehicle.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Featured Luxury Facilities */}
      {luxuryFacilities.length > 0 && (
        <section className="bg-card py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll className="text-center">
              <div className="mx-auto mb-6 h-px w-12 bg-primary" />
              <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Featured Luxury Facilities
              </h2>
              <p className="mt-4 text-muted-foreground">
                Verified and premium-tier facilities specializing in exotic and
                classic vehicle storage
              </p>
            </AnimateOnScroll>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {luxuryFacilities.map((facility, i) => (
                <AnimateOnScroll key={facility.id} delay={i * 100}>
                  <FacilityCard facility={facility} />
                </AnimateOnScroll>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/search?vehicleType=EXOTIC,CLASSIC">
                <Button variant="outline" size="lg" className="px-8">
                  View All Luxury Facilities
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* What to Look For */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            What to Look For in Luxury Storage
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Not all car storage is created equal. Here are the key features to
            look for when storing a high-value vehicle.
          </p>
        </AnimateOnScroll>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CHECKLIST_ITEMS.map((item, i) => (
            <AnimateOnScroll key={item.title} delay={i * 80}>
              <div className="flex gap-4 rounded-xl bg-card p-6 ring-1 ring-border">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Checklist Summary */}
      <section className="bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground text-center">
              Your Luxury Storage Checklist
            </h2>
            <div className="mt-10 space-y-3">
              {[
                "Climate-controlled environment (temperature and humidity)",
                "24/7 video surveillance and security monitoring",
                "Individual alarmed bays or enclosed units",
                "Battery tender connections and tire pressure monitoring",
                "Fire suppression systems",
                "Comprehensive insurance coverage for high-value vehicles",
                "Professional detailing and maintenance services",
                "Enclosed transport options for pickup and delivery",
                "Limited access with biometric or key-card entry",
                "Experienced staff familiar with exotic and classic vehicles",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg bg-muted ring-1 ring-border p-3.5"
                >
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-2xl bg-card px-8 py-20 text-center ring-1 ring-border sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.20_0.02_85)_0%,transparent_70%)] opacity-50" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Find Premium Storage for Your Vehicle
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Search our network of verified luxury storage facilities. Compare
                amenities, read reviews, and contact facilities directly.
              </p>
              <div className="mt-10">
                <Link href="/search?vehicleType=EXOTIC,CLASSIC&storageType=CLIMATE_CONTROLLED">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                  >
                    Search Luxury Storage
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
