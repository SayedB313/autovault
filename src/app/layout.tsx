import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AutoVault | The World's Premier Luxury Vehicle Storage Directory",
    template: "%s | AutoVault",
  },
  description:
    "AutoVault is the global directory for luxury, exotic, classic, and collector car storage. Find climate-controlled, concierge-level facilities for Ferrari, Lamborghini, Porsche, and high-end vehicles worldwide.",
  keywords: [
    "luxury car storage",
    "exotic car storage",
    "supercar storage",
    "classic car storage",
    "collector car storage",
    "Ferrari storage",
    "Lamborghini storage",
    "Porsche storage",
    "climate controlled car storage",
    "concierge car storage",
    "enclosed car storage",
    "car vault",
  ],
  openGraph: {
    type: "website",
    siteName: "AutoVault",
    title: "AutoVault | The World's Premier Luxury Vehicle Storage Directory",
    description:
      "The global directory for luxury, exotic, and collector car storage. Find climate-controlled, concierge-level facilities worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@autovault",
    title: "AutoVault | Luxury Vehicle Storage Directory",
    description:
      "The global directory for luxury, exotic, and collector car storage. Find climate-controlled, concierge-level facilities worldwide.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://autovault.network"
  ),
  verification: {
    google: "google64fd76f59a3147f0",
    other: {
      "msvalidate.01": "3814AE54AADDF5CFB226612E16D5BF01",
    },
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#0A0A0A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
