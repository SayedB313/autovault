import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { cn } from "@/lib/utils";
import type { FacilityCardData } from "@/types";

// ============================================================
// Label Maps
// ============================================================

const STORAGE_TYPE_LABELS: Record<string, string> = {
  INDOOR: "Indoor",
  OUTDOOR: "Outdoor",
  COVERED: "Covered",
  CLIMATE_CONTROLLED: "Climate Controlled",
  ENCLOSED: "Enclosed",
};

const VEHICLE_TYPE_HIGHLIGHT: Record<string, string> = {
  EXOTIC: "Exotic",
  CLASSIC: "Classic",
  LUXURY: "Luxury",
};

const PRICE_PER_LABELS: Record<string, string> = {
  DAY: "/day",
  WEEK: "/wk",
  MONTH: "/mo",
  YEAR: "/yr",
};

// ============================================================
// Star Rating
// ============================================================

function StarRating({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <Star className="size-3.5 fill-primary text-primary" />
      <span className="text-sm font-medium text-foreground">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground">
        ({count})
      </span>
    </div>
  );
}

// ============================================================
// Price Display
// ============================================================

function PriceRange({
  min,
  max,
  pricePer,
}: {
  min: number | null;
  max: number | null;
  pricePer: string;
}) {
  if (min == null && max == null) return null;

  const suffix = PRICE_PER_LABELS[pricePer] ?? "/mo";

  if (min != null && max != null && min !== max) {
    return (
      <span className="text-sm font-semibold text-foreground">
        ${Math.round(min)} - ${Math.round(max)}
        <span className="text-xs font-normal text-muted-foreground">
          {suffix}
        </span>
      </span>
    );
  }

  const price = min ?? max;
  return (
    <span className="text-sm font-semibold text-foreground">
      ${Math.round(price!)}
      <span className="text-xs font-normal text-muted-foreground">
        {suffix}
      </span>
    </span>
  );
}

// ============================================================
// Facility Card
// ============================================================

type FacilityCardProps = {
  facility: FacilityCardData;
  className?: string;
};

export function FacilityCard({ facility, className }: FacilityCardProps) {
  const primaryPhoto = facility.photos
    .sort((a, b) => a.order - b.order)
    .at(0);

  const storageLabels = facility.storageTypes
    .map((t) => STORAGE_TYPE_LABELS[t])
    .filter(Boolean);

  const vehicleHighlights = facility.vehicleTypes
    .map((t) => VEHICLE_TYPE_HIGHLIGHT[t])
    .filter(Boolean);

  const isPremium = facility.tier === "PREMIUM";

  return (
    <Link
      href={`/facility/${facility.slug}`}
      className={cn("group block", className)}
    >
      <Card className={cn(
        "overflow-hidden border-0 bg-card ring-1 ring-border transition-all duration-300 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5",
        isPremium && "ring-primary/20"
      )}>
        {/* Photo */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {primaryPhoto ? (
            <>
              <Image
                src={primaryPhoto.url}
                alt={primaryPhoto.alt ?? facility.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay for smooth transition to content */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
              <MapPin className="size-8 text-muted-foreground/30" />
            </div>
          )}

          {/* Tier badge overlay */}
          {facility.tier !== "FREE" && (
            <div className="absolute top-3 left-3">
              <TierBadge tier={facility.tier} />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="space-y-2.5 px-4 pt-3 pb-4">
          {/* Name + Location */}
          <div>
            <h3 className="truncate text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {facility.name}
            </h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {facility.city}, {facility.state}
            </p>
          </div>

          {/* Rating + Price row */}
          <div className="flex items-center justify-between">
            {facility.reviewCount > 0 ? (
              <StarRating
                rating={facility.avgRating}
                count={facility.reviewCount}
              />
            ) : (
              <span className="text-xs text-muted-foreground">No reviews</span>
            )}

            <PriceRange
              min={facility.priceRangeMin}
              max={facility.priceRangeMax}
              pricePer={facility.pricePer}
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            {storageLabels.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="text-[11px] font-normal"
              >
                {label}
              </Badge>
            ))}
            {vehicleHighlights.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="text-[11px] font-normal border-primary/20 text-primary/80"
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
