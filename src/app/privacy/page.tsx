import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AutoVault",
  description: "AutoVault privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm text-muted-foreground">
          Last updated: March 8, 2026
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          1. Information We Collect
        </h2>
        <p>
          We collect information you provide when creating an account (name,
          email), submitting reviews, or contacting facilities through our
          platform. We also collect usage data such as pages visited and search
          queries to improve our service.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          2. How We Use Your Information
        </h2>
        <p>
          We use your information to provide and improve the AutoVault service,
          process facility claims and subscriptions, send relevant
          communications, and maintain the security of our platform.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          3. Information Sharing
        </h2>
        <p>
          We do not sell your personal information. We may share information with
          facility owners when you submit a contact request, and with service
          providers (Stripe for payments, Resend for emails) necessary to
          operate the platform.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          4. Cookies
        </h2>
        <p>
          We use essential cookies for authentication and session management. We
          may use analytics cookies to understand how the service is used. You
          can control cookie settings through your browser.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          5. Data Security
        </h2>
        <p>
          We implement appropriate security measures to protect your data,
          including encryption in transit and at rest. However, no method of
          transmission over the internet is completely secure.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          6. Your Rights
        </h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting us. Account holders can update their information
          through the dashboard.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          7. Contact
        </h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <a
            href="mailto:privacy@autovault.network"
            className="text-primary hover:underline"
          >
            privacy@autovault.network
          </a>
          .
        </p>
      </div>
    </div>
  );
}
