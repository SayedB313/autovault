import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import type { FacilityTier } from "@/generated/prisma";

type TierBadgeProps = {
  tier: FacilityTier;
  className?: string;
};

export function TierBadge({ tier, className }: TierBadgeProps) {
  if (tier === "FREE") {
    return null;
  }

  if (tier === "VERIFIED") {
    return (
      <Badge
        variant="outline"
        className={`gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 ${className ?? ""}`}
      >
        <CheckCircle className="size-3" />
        Verified
      </Badge>
    );
  }

  if (tier === "PREMIUM") {
    return (
      <Badge
        variant="outline"
        className={`gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 ${className ?? ""}`}
      >
        <Star className="size-3 fill-current" />
        Premium
      </Badge>
    );
  }

  return null;
}
