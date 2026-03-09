import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://autovault.network";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      // Explicitly allow AI crawlers for GEO visibility
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
