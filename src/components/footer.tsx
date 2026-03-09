import Link from "next/link";

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
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-lg font-light tracking-[0.15em] uppercase text-foreground transition-colors hover:text-primary"
            >
              AutoVault
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The premier network for luxury car storage worldwide.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/60">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
        <div className="mt-16 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground/60 tracking-wider">
            &copy; {year} AutoVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
