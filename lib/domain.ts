export type QualitySegment = "green" | "amber" | "orange" | "red";

export type BookingSessionState =
  | "draft"
  | "line_launched"
  | "message_prefilled"
  | "waiting_store_reply"
  | "accepted"
  | "alternate_time_proposed"
  | "full"
  | "timeout"
  | "rejected"
  | "review_required";

export type OutcomeSource =
  | "official_line_reservation_core"
  | "manual_fallback"
  | "ops_override";

export type Store = {
  id: string;
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  waitMinutes: number;
  lastOrderAt: string;
  isOpen: boolean;
  benefitTags: string[];
  heroCopy: string;
  faq: string[];
  menuHighlights: string[];
  relatedStoreSlugs: string[];
  reliabilityState: string;
  reliabilityMode: string;
  reliabilityReason: string | null;
  reliabilityEvidence: {
    windowHours?: number;
    totalOutcomes?: number;
    acceptedCount?: number;
    alternateCount?: number;
    blockedCount?: number;
    reviewOpenCount?: number;
  } | null;
  reliabilityUpdatedAt: string | null;
  replySlaSnapshot: string | null;
  badgeLabel: string;
};

export type PublicStoreEligibility = "hero" | "reservation_shelf" | "detail_only";

export type NavigationContext = {
  sourceSurface: "home.hero" | "home.reservation_shelf" | "home.discovery_shelf" | "direct_entry";
  shelfId: string;
  scrollY: number;
  locationLabel: string;
  filters: string[];
};

export type HomeViewModel = {
  locationLabel: string;
  heroStore: Store;
  reservationShelf: Store[];
  discoveryShelf: Store[];
  qualitySegment: QualitySegment;
};

export type QualityStateViewModel = {
  segment: QualitySegment;
  headline: string;
  body: string;
  statusLabel: string;
  recoveryActions: string[];
};

export type PricingPlan = {
  id: string;
  name: string;
  monthlyLabel: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

export type StoreBoardStore = Store & {
  nextAvailableWindow: string | null;
  note: string | null;
  acceptingSameDay: boolean;
  updatedAt: string;
};

export type StoreBoardSession = {
  id: string;
  storeId: string;
  storeName: string;
  state: BookingSessionState;
  preferredWindow: string;
  menuHint: string | null;
  sourceSurface: string;
  createdAt: string;
};

export type ReviewQueueItem = {
  id: string;
  bookingSessionId: string;
  storeName: string;
  sessionState: BookingSessionState;
  preferredWindow: string;
  reasonCode: string;
  sourceSurface: string;
  status: string;
  createdAt: string;
  resolutionNote: string | null;
};
