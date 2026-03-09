import type { Metadata } from "next";
import { STATE_ABBR_TO_NAME } from "@/lib/geo";

// ============================================================
// Constants
// ============================================================

const SITE_NAME = "AutoVault";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://autovault.network";

// ============================================================
// Label Helpers
// ============================================================

const STORAGE_TYPE_LABELS: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  COVERED: "Covered",
  CLIMATE_CONTROLLED: "Climate Controlled",
  ENCLOSED: "Enclosed",
};

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CAR: "Car",
  MOTORCYCLE: "Motorcycle",
  RV: "RV",
  BOAT: "Boat",
  CLASSIC: "Classic Car",
  EXOTIC: "Exotic Car",
  TRUCK: "Truck",
  TRAILER: "Trailer",
};

function storageLabel(type: string): string {
  return STORAGE_TYPE_LABELS[type] ?? formatEnum(type);
}

function vehicleLabel(type: string): string {
  return VEHICLE_TYPE_LABELS[type] ?? formatEnum(type);
}

function formatEnum(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fullStateName(abbreviation: string): string {
  return STATE_ABBR_TO_NAME[abbreviation] ?? abbreviation;
}

function formatPrice(amount: number): string {
  return `$${Math.round(amount)}`;
}

// ============================================================
// Facility Page Meta
// ============================================================

type FacilityMetaInput = {
  name: string;
  city: string;
  state: string;
  description?: string | null;
  avgRating: number;
  reviewCount: number;
  priceRangeMin?: number | null;
  priceRangeMax?: number | null;
  storageTypes: string[];
  vehicleTypes: string[];
};

type FacilityMetaResult = Metadata & {
  keywords: string[];
};

export function generateFacilityMeta(facility: FacilityMetaInput): FacilityMetaResult {
  const stateName = fullStateName(facility.state);
  const storageDescriptors = facility.storageTypes.map(storageLabel);
  const vehicleDescriptors = facility.vehicleTypes.map(vehicleLabel);

  const ratingPart =
    facility.reviewCount > 0
      ? ` ${facility.reviewCount} review${facility.reviewCount !== 1 ? "s" : ""}, ${facility.avgRating.toFixed(1)} avg rating.`
      : "";

  const pricePart =
    facility.priceRangeMin != null
      ? facility.priceRangeMax != null &&
        facility.priceRangeMax !== facility.priceRangeMin
        ? ` Starting at ${formatPrice(facility.priceRangeMin)}/mo.`
        : ` From ${formatPrice(facility.priceRangeMin)}/mo.`
      : "";

  const storagePart =
    storageDescriptors.length > 0
      ? `${storageDescriptors.join(", ")} storage`
      : "car storage";

  const title = `${facility.name} - Car Storage in ${facility.city}, ${facility.state} | ${SITE_NAME}`;

  const description =
    facility.description?.slice(0, 160) ||
    `${facility.name} offers ${storagePart} in ${facility.city}, ${stateName}.${ratingPart}${pricePart}`;

  const keywords = [
    "car storage",
    `car storage ${facility.city}`,
    `vehicle storage ${facility.city} ${facility.state}`,
    facility.name,
    ...storageDescriptors.map((s) => `${s.toLowerCase()} car storage`),
    ...vehicleDescriptors.map((v) => `${v.toLowerCase()} storage`),
    `${facility.city} ${facility.state}`,
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

// ============================================================
// City Page Meta
// ============================================================

export function generateCityMeta(
  city: string,
  state: string,
  facilityCount: number
): Metadata {
  const stateName = fullStateName(state);
  const title = `Car Storage in ${city}, ${state} - ${facilityCount} Facilities | ${SITE_NAME}`;
  const description = `Compare ${facilityCount} car storage facilit${facilityCount !== 1 ? "ies" : "y"} in ${city}, ${stateName}. Find indoor, outdoor, and climate controlled vehicle storage with reviews, pricing, and photos.`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_NAME, type: "website" },
  };
}

// ============================================================
// State Page Meta
// ============================================================

export function generateStateMeta(
  state: string,
  cityCount: number,
  facilityCount: number
): Metadata {
  const stateName = fullStateName(state);
  const title = `Car Storage in ${stateName} - ${facilityCount} Facilities in ${cityCount} Cities | ${SITE_NAME}`;
  const description = `Browse ${facilityCount} car storage facilit${facilityCount !== 1 ? "ies" : "y"} across ${cityCount} cit${cityCount !== 1 ? "ies" : "y"} in ${stateName}. Compare pricing, read reviews, and find the best vehicle storage near you.`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_NAME, type: "website" },
  };
}

// ============================================================
// JSON-LD: Facility (LocalBusiness)
// ============================================================

type FacilityJsonLdInput = {
  name: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  zip?: string | null;
  country?: string;
  phone?: string | null;
  website?: string | null;
  avgRating: number;
  reviewCount: number;
  priceRangeMin?: number | null;
  priceRangeMax?: number | null;
  lat: number;
  lng: number;
  slug: string;
  photos?: { url: string; alt?: string | null; order: number }[];
};

export function facilityJsonLd(
  facility: FacilityJsonLdInput
): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SelfStorage",
    name: facility.name,
    description:
      facility.description ??
      `Car storage facility in ${facility.city}, ${facility.state}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: facility.address,
      addressLocality: facility.city,
      addressRegion: facility.state,
      postalCode: facility.zip ?? undefined,
      addressCountry: facility.country ?? "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: facility.lat,
      longitude: facility.lng,
    },
    url: `${SITE_URL}/facility/${facility.slug}`,
  };

  if (facility.phone) {
    jsonLd.telephone = facility.phone;
  }

  if (facility.website) {
    jsonLd.sameAs = facility.website;
  }

  if (facility.photos && facility.photos.length > 0) {
    jsonLd.image = facility.photos
      .sort((a, b) => a.order - b.order)
      .map((p) => p.url);
  }

  if (facility.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: facility.avgRating,
      reviewCount: facility.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (facility.priceRangeMin != null) {
    jsonLd.priceRange =
      facility.priceRangeMax != null &&
      facility.priceRangeMax !== facility.priceRangeMin
        ? `${formatPrice(facility.priceRangeMin)} - ${formatPrice(facility.priceRangeMax)}`
        : `From ${formatPrice(facility.priceRangeMin)}`;
  }

  return jsonLd;
}

// ============================================================
// JSON-LD: City (ItemList)
// ============================================================

type CityJsonLdFacility = {
  name: string;
  slug: string;
  avgRating: number;
  reviewCount: number;
};

export function cityJsonLd(
  city: string,
  facilities: CityJsonLdFacility[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Car Storage Facilities in ${city}`,
    numberOfItems: facilities.length,
    itemListElement: facilities.map((f, i) => {
      const listItem: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/facility/${f.slug}`,
        name: f.name,
      };
      if (f.reviewCount > 0) {
        listItem.item = {
          "@type": "SelfStorage",
          name: f.name,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: f.avgRating,
            reviewCount: f.reviewCount,
          },
        };
      }
      return listItem;
    }),
  };
}

// ============================================================
// JSON-LD: Organization
// ============================================================

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "AutoVault is the global directory for luxury, exotic, classic, and collector car storage. Find climate-controlled, concierge-level facilities for high-end vehicles worldwide.",
    foundingDate: "2026",
    sameAs: [
      "https://twitter.com/autovault",
      "https://www.linkedin.com/company/autovault",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${SITE_URL}/contact`,
    },
  };
}

// ============================================================
// JSON-LD: BreadcrumbList
// ============================================================

type BreadcrumbItem = { name: string; url?: string };

export function breadcrumbJsonLd(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

// ============================================================
// JSON-LD: FAQPage
// ============================================================

type FaqItem = { question: string; answer: string };

export function faqPageJsonLd(faqs: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
