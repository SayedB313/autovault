import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Search, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About AutoVault - Our Mission | AutoVault",
  description:
    "AutoVault connects car owners with trusted storage facilities across the United States. Learn about our mission to make vehicle storage simple and transparent.",
};

const VALUES = [
  {
    icon: Search,
    title: "Transparency",
    description:
      "Every listing includes real pricing, verified reviews, and detailed facility information so you can make informed decisions.",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Our verification process ensures that facilities meet quality standards. Premium listings are personally reviewed by our team.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We empower car owners to share their experiences through honest reviews, helping everyone find the right storage solution.",
  },
  {
    icon: Star,
    title: "Quality",
    description:
      "We partner with facilities that prioritize the care and security of your vehicle, from daily drivers to exotic supercars.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
        <section className="bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About AutoVault
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                We believe every vehicle deserves a safe place to rest. AutoVault
                is the most comprehensive directory of car storage facilities in
                the United States, connecting vehicle owners with the right
                storage solutions for their needs and budget.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Our Mission
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Finding reliable car storage used to mean hours of phone calls,
                unclear pricing, and guesswork about facility quality. AutoVault
                changes that by bringing every option together in one searchable,
                transparent directory.
              </p>
              <p>
                Whether you need a covered spot for your daily driver during a
                long trip, a climate-controlled bay for your classic car
                collection, or high-security storage for an exotic supercar, our
                platform helps you find, compare, and contact the right facility
                in minutes.
              </p>
              <p>
                For facility owners, AutoVault provides a platform to showcase
                their services, connect with car owners actively searching for
                storage, and manage their online reputation. Our tiered listing
                system ensures that facilities of all sizes can benefit from
                increased visibility.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                What We Stand For
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="flex gap-4 rounded-xl border bg-card p-6 shadow-sm"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Placeholder */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Our Team
            </h2>
            <p className="mt-4 text-muted-foreground">
              AutoVault is built by a small, dedicated team of car enthusiasts
              and technology professionals who understand the unique challenges
              of vehicle storage. We are passionate about connecting car owners
              with facilities that treat their vehicles with the care they
              deserve.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-700 px-8 py-12 text-center shadow-xl sm:px-16">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                Ready to Find Storage for Your Vehicle?
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
                Search our directory of 2,000+ car storage facilities across the
                United States.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/search">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  >
                    Search Facilities
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-primary-foreground hover:bg-white/10 px-8"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
