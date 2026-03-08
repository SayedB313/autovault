import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AutoVault | Find Car Storage Near You",
    template: "%s | AutoVault",
  },
  description:
    "AutoVault is the leading directory for car storage facilities across the United States. Compare indoor, outdoor, and climate controlled vehicle storage with reviews, pricing, and photos.",
  keywords: [
    "car storage",
    "vehicle storage",
    "indoor car storage",
    "climate controlled car storage",
    "exotic car storage",
    "classic car storage",
    "car storage near me",
  ],
  openGraph: {
    type: "website",
    siteName: "AutoVault",
    title: "AutoVault | Find Car Storage Near You",
    description:
      "The leading directory for car storage facilities. Compare indoor, outdoor, and climate controlled vehicle storage options.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://autovault.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
