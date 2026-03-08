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
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Luxury Car Storage - Climate Controlled, High Security | AutoVault",
  description:
    "Find premium luxury car storage facilities for exotic, classic, and collector vehicles. Climate-controlled environments with concierge service, 24/7 security, and white-glove care.",
  openGraph: {
    title: "Luxury Car Storage | AutoVault",
    description:
      "Premium storage for exotic, classic, and collector vehicles. Climate-controlled, concierge service, and 24/7 security.",
    siteName: "AutoVault",
    type: "website",
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

  return (
    <>
      {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400 mb-6">
                <Star className="size-4 fill-amber-400" />
                Premium Vehicle Storage
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Luxury Car{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Storage
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                Premium climate-controlled facilities with concierge service for
                exotic, classic, and collector vehicles. Your prized automobile
                deserves world-class care.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/search?vehicleType=EXOTIC,CLASSIC&storageType=CLIMATE_CONTROLLED">
                  <Button
                    size="lg"
                    className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-semibold px-8"
                  >
                    Find Luxury Storage
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8"
                  >
                    View Premium Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
          </div>
        </section>

        {/* Featured Luxury Facilities */}
        {luxuryFacilities.length > 0 && (
          <section className="bg-muted/50 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Featured Luxury Facilities
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Verified and premium-tier facilities specializing in exotic and
                  classic vehicle storage
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {luxuryFacilities.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/search?vehicleType=EXOTIC,CLASSIC">
                  <Button variant="outline" size="lg">
                    View All Luxury Facilities
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* What to Look For */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What to Look For in Luxury Storage
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Not all car storage is created equal. Here are the key features to
              look for when storing a high-value vehicle.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CHECKLIST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
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
            ))}
          </div>
        </section>

        {/* Checklist Summary */}
        <section className="bg-muted/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-foreground text-center">
                Your Luxury Storage Checklist
              </h2>
              <div className="mt-8 space-y-3">
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
                    className="flex items-start gap-3 rounded-lg bg-card border p-3"
                  >
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find Premium Storage for Your Vehicle
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Search our network of verified luxury storage facilities. Compare
              amenities, read reviews, and contact facilities directly.
            </p>
            <div className="mt-8">
              <Link href="/search?vehicleType=EXOTIC,CLASSIC&storageType=CLIMATE_CONTROLLED">
                <Button
                  size="lg"
                  className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-semibold px-8"
                >
                  Search Luxury Storage
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
