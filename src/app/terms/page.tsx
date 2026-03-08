import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AutoVault",
  description: "AutoVault terms of service and conditions of use.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm text-muted-foreground">
          Last updated: March 8, 2026
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using AutoVault (&quot;the Service&quot;), you agree to
          be bound by these Terms of Service. If you do not agree to these terms,
          do not use the Service.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          2. Description of Service
        </h2>
        <p>
          AutoVault is a directory and comparison platform for car storage
          facilities across the United States. We provide information about
          storage facilities, including locations, pricing, amenities, and user
          reviews. AutoVault does not own or operate any storage facilities.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          3. User Accounts
        </h2>
        <p>
          Facility owners may create accounts to claim and manage their listings.
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities under your account.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          4. Listing Information
        </h2>
        <p>
          Facility information is provided for informational purposes only.
          While we strive for accuracy, we do not guarantee the completeness or
          accuracy of any listing. Users should verify details directly with
          facilities before making storage decisions.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          5. Reviews
        </h2>
        <p>
          Users may submit reviews of storage facilities. Reviews must be
          truthful, based on actual experience, and not contain offensive or
          defamatory content. We reserve the right to remove reviews that violate
          these guidelines.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          6. Premium Services
        </h2>
        <p>
          Facility owners may purchase premium listing services. Subscription
          terms, pricing, and cancellation policies are detailed on our pricing
          page. All payments are processed securely through Stripe.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          7. Limitation of Liability
        </h2>
        <p>
          AutoVault is not liable for any damages arising from your use of the
          Service, interactions with storage facilities, or reliance on
          information provided through the platform.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          8. Contact
        </h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a
            href="mailto:legal@autovault.network"
            className="text-primary hover:underline"
          >
            legal@autovault.network
          </a>
          .
        </p>
      </div>
    </div>
  );
}
