import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing - List Your Facility | AutoVault",
  description:
    "AutoVault pricing plans for facility owners. List your car storage facility for free, or upgrade to Verified or Premium for enhanced visibility and features.",
};

interface PlanFeature {
  label: string;
  free: boolean | string;
  verified: boolean | string;
  premium: boolean | string;
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get listed and start receiving inquiries at no cost.",
    cta: "Get Started Free",
    ctaHref: "/claim",
    highlighted: false,
    tier: "FREE" as const,
  },
  {
    name: "Verified",
    price: "$49",
    period: "/month",
    description:
      "Stand out with a verified badge and enhanced listing features.",
    cta: "Get Verified",
    ctaHref: "/claim?plan=verified",
    highlighted: true,
    tier: "VERIFIED" as const,
  },
  {
    name: "Premium",
    price: "$149",
    period: "/month",
    description:
      "Maximum visibility with premium placement and full analytics.",
    cta: "Go Premium",
    ctaHref: "/claim?plan=premium",
    highlighted: false,
    tier: "PREMIUM" as const,
  },
];

const FEATURES: PlanFeature[] = [
  {
    label: "Basic listing with contact info",
    free: true,
    verified: true,
    premium: true,
  },
  {
    label: "Appear in search results",
    free: true,
    verified: true,
    premium: true,
  },
  {
    label: "Receive contact inquiries",
    free: true,
    verified: true,
    premium: true,
  },
  { label: "Photos", free: "Up to 3", verified: "Up to 10", premium: "Unlimited" },
  {
    label: "Verified badge",
    free: false,
    verified: true,
    premium: true,
  },
  {
    label: "Priority search placement",
    free: false,
    verified: true,
    premium: true,
  },
  {
    label: "Respond to reviews",
    free: false,
    verified: true,
    premium: true,
  },
  {
    label: "Custom business description",
    free: false,
    verified: true,
    premium: true,
  },
  {
    label: "Featured on city pages",
    free: false,
    verified: false,
    premium: true,
  },
  {
    label: "Featured on homepage",
    free: false,
    verified: false,
    premium: true,
  },
  {
    label: "Lead analytics dashboard",
    free: false,
    verified: false,
    premium: true,
  },
  {
    label: "Competitor insights",
    free: false,
    verified: false,
    premium: true,
  },
  {
    label: "Premium badge",
    free: false,
    verified: false,
    premium: true,
  },
  {
    label: "Dedicated account manager",
    free: false,
    verified: false,
    premium: true,
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I try before I buy?",
    answer:
      "Absolutely. Start with our Free plan to get your facility listed and receiving inquiries. Upgrade to Verified or Premium at any time when you're ready for more visibility and features.",
  },
  {
    question: "What happens to my listing if I cancel?",
    answer:
      "If you cancel a paid plan, your listing reverts to the Free tier. Your basic information, photos (up to 3), and reviews remain intact. You won't lose any data.",
  },
  {
    question: "How does verification work?",
    answer:
      "When you upgrade to Verified, our team reviews your facility information, confirms your ownership, and validates your listing details. Once approved, you receive the Verified badge on your listing.",
  },
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time. When upgrading, the new features are available immediately. When downgrading, the change takes effect at the end of your current billing period.",
  },
  {
    question: "Do you offer annual pricing?",
    answer:
      "Yes. Contact us for annual pricing options which include a discount compared to monthly billing. Email hello@autovault.com for details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
        <section className="bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                List your car storage facility for free. Upgrade for more
                visibility, features, and leads.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm ${
                  plan.highlighted
                    ? "border-primary ring-2 ring-primary/20 shadow-lg"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-serif text-xl font-light text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="my-8 border-t" />

                <ul className="flex-1 space-y-3">
                  {FEATURES.map((feature) => {
                    const value = feature[plan.tier.toLowerCase() as keyof Omit<PlanFeature, "label">];
                    const included = value === true || typeof value === "string";

                    return (
                      <li
                        key={feature.label}
                        className={`flex items-start gap-2 text-sm ${
                          included
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {included ? (
                          <Check className="size-4 shrink-0 text-primary mt-0.5" />
                        ) : (
                          <X className="size-4 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {feature.label}
                          {typeof value === "string" && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({value})
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <Link href={plan.ctaHref} className="w-full">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="bg-muted/50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground text-center">
              Feature Comparison
            </h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 pr-4 text-left font-medium text-foreground">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-foreground">
                      Free
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-primary">
                      Verified
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-foreground">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feature) => (
                    <tr key={feature.label} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 text-foreground">
                        {feature.label}
                      </td>
                      {(["free", "verified", "premium"] as const).map((tier) => {
                        const value = feature[tier];
                        return (
                          <td key={tier} className="px-4 py-3 text-center">
                            {value === true ? (
                              <Check className="mx-auto size-4 text-primary" />
                            ) : value === false ? (
                              <X className="mx-auto size-4 text-muted-foreground/40" />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {value}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground text-center flex items-center justify-center gap-2">
              <HelpCircle className="size-6" />
              Frequently Asked Questions
            </h2>
            <div className="mt-10 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold text-foreground">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl font-light text-foreground">
              Ready to get started?
            </h2>
            <p className="mt-3 text-muted-foreground">
              List your facility today and start connecting with car owners.
            </p>
            <div className="mt-6">
              <Link href="/claim">
                <Button size="lg">
                  List Your Facility
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
