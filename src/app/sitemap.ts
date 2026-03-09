import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://autovault.network";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages — use fixed dates to avoid misleading crawlers
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-03-08"), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date("2026-03-08"), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/luxury-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/exotic-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/classic-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/supercar-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/collector-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/concierge-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/enclosed-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/muscle-car-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ferrari-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/lamborghini-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/porsche-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/corvette-storage`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date("2026-03-08"), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date("2026-03-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date("2026-03-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date("2026-03-01"), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date("2026-03-01"), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Facility pages
  const facilities = await prisma.facility.findMany({
    select: { slug: true, updatedAt: true },
  });

  const facilityPages: MetadataRoute.Sitemap = facilities.map((f) => ({
    url: `${BASE_URL}/facility/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // City pages
  const cities = await prisma.city.findMany({
    select: { slug: true, stateSlug: true, updatedAt: true },
  });

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/${c.stateSlug}/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // State pages
  const states = await prisma.city.findMany({
    select: { stateSlug: true },
    distinct: ["stateSlug"],
  });

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE_URL}/${s.stateSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Blog posts
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...facilityPages, ...cityPages, ...statePages, ...blogPages];
}
