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
        className={`gap-1 border-foreground/20 bg-foreground/5 text-foreground/80 backdrop-blur-sm ${className ?? ""}`}
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
        className={`gap-1 border-primary/30 bg-primary/10 text-primary backdrop-blur-sm ${className ?? ""}`}
      >
        <Star className="size-3 fill-current" />
        Premium
      </Badge>
    );
  }

  return null;
}
