import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | AutoVault",
  description:
    "Get in touch with the AutoVault team. Questions about listings, accounts, partnerships, or anything else - we're here to help.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
        <section className="bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have questions about AutoVault? We&apos;d love to hear from you.
                Send us a message and we&apos;ll respond within 1-2 business
                days.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Get in Touch
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Whether you have a question about listings, pricing,
                    partnerships, or anything else, our team is ready to help.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Email
                      </p>
                      <a
                        href="mailto:hello@autovault.com"
                        className="text-sm text-primary hover:underline"
                      >
                        hello@autovault.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Response Time
                      </p>
                      <p className="text-sm text-muted-foreground">
                        1-2 business days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-foreground">
                    Facility Owners
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If you&apos;re a facility owner looking to list or manage
                    your listing, visit our{" "}
                    <a
                      href="/claim"
                      className="text-primary hover:underline font-medium"
                    >
                      claim page
                    </a>{" "}
                    or check our{" "}
                    <a
                      href="/pricing"
                      className="text-primary hover:underline font-medium"
                    >
                      pricing plans
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
