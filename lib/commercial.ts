export type ListingPlan = "standard" | "verified" | "featured" | "premium";
export type PlacementId =
  | "HOME_HERO_SPONSOR"
  | "HOME_FEATURED_BUSINESS"
  | "SPARES_CATEGORY_BATTERIES_TOP"
  | "SPARES_CATEGORY_TYRES_TOP"
  | "MAKE_TOYOTA_SPONSOR"
  | "VEHICLE_HILUX_SIDEBAR"
  | "WORKSHOPS_SERVICE_TOP"
  | "MOTORING_FEATURED_SPONSOR"
  | "ARTICLE_INLINE_SPONSOR"
  | "LOCATION_HARARE_FEATURED";
export type CommercialPlacement = {
  id: string;
  placement: PlacementId;
  advertiser: string;
  label: "Sponsored" | "Featured" | "Promoted";
  creative?: string;
  destination: string;
  startsAt: string;
  endsAt: string;
  status: "draft" | "active" | "paused" | "expired";
  priority: number;
};
// Empty by design: campaigns are rendered only when Autoheads supplies and activates them.
export const commercialPlacements: CommercialPlacement[] = [];
export function activePlacement(placement: PlacementId, now = new Date()) {
  return (
    commercialPlacements
      .filter(
        (x) =>
          x.placement === placement &&
          x.status === "active" &&
          new Date(x.startsAt) <= now &&
          new Date(x.endsAt) >= now,
      )
      .sort((a, b) => b.priority - a.priority)[0] ?? null
  );
}
