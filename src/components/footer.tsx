import Link from "next/link";
import { Car } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Storage Types",
    links: [
      { label: "Indoor Storage", href: "/search?storageType=INDOOR" },
      { label: "Outdoor Storage", href: "/search?storageType=OUTDOOR" },
      { label: "Climate Controlled", href: "/search?storageType=CLIMATE_CONTROLLED" },
      { label: "Luxury Storage", href: "/luxury-car-storage" },
    ],
  },
  {
    title: "Top Cities",
    links: [
      { label: "Los Angeles", href: "/california/los-angeles-ca" },
      { label: "Miami", href: "/florida/miami-fl" },
      { label: "New York", href: "/new-york/new-york-ny" },
      { label: "Houston", href: "/texas/houston-tx" },
      { label: "Chicago", href: "/illinois/chicago-il" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-white"
            >
              <Car className="size-5" />
              AutoVault
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Find the perfect car storage facility
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-500">
            &copy; {year} AutoVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
