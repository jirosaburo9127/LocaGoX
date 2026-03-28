import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type {
  HomeViewModel,
  PricingPlan,
  PublicStoreEligibility,
  QualityStateViewModel,
  Store
} from "@/lib/domain";

const defaultLocationLabel = "渋谷区恵比寿西 1-9 付近";

function getStoreEligibility(store: {
  isOpen: boolean;
  reliabilityState: string;
  statusSnapshots: Array<{
    acceptingSameDay: boolean;
  }>;
}): PublicStoreEligibility {
  const latestStatus = store.statusSnapshots[0];
  const acceptingSameDay = latestStatus?.acceptingSameDay ?? true;

  if (!store.isOpen || !acceptingSameDay) {
    return "detail_only";
  }

  if (store.reliabilityState === "healthy") {
    return "hero";
  }

  if (store.reliabilityState === "caution") {
    return "reservation_shelf";
  }

  return "detail_only";
}

function getBadgeLabel(reliabilityState: string) {
  switch (reliabilityState) {
    case "healthy":
      return "LINE相談しやすい掲載店";
    case "caution":
      return "確認しながら案内中";
    case "manual_only":
      return "詳細確認を優先中";
    default:
      return "掲載中";
  }
}

function mapStore(store: {
  id: string;
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  lastOrderAt: string;
  isOpen: boolean;
  heroCopy: string;
  benefitTags: string[];
  faq: string[];
  menuHighlights: string[];
  relatedStoreSlugs: string[];
  reliabilityState: string;
  reliabilityMode: string;
  reliabilityReason: string | null;
  reliabilityEvidence: Prisma.JsonValue | null;
  reliabilityUpdatedAt: Date | null;
  replySlaSnapshot: string | null;
  statusSnapshots: Array<{
    waitMinutes: number | null;
  }>;
}): Store {
  return {
    id: store.id,
    slug: store.slug,
    name: store.name,
    area: store.area,
    category: store.category,
    walkMinutes: store.walkMinutes,
    waitMinutes: store.statusSnapshots[0]?.waitMinutes ?? 0,
    lastOrderAt: store.lastOrderAt,
    isOpen: store.isOpen,
    benefitTags: store.benefitTags,
    heroCopy: store.heroCopy,
    faq: store.faq,
    menuHighlights: store.menuHighlights,
    relatedStoreSlugs: store.relatedStoreSlugs,
    reliabilityState: store.reliabilityState,
    reliabilityMode: store.reliabilityMode,
    reliabilityReason: store.reliabilityReason,
    reliabilityEvidence: store.reliabilityEvidence as Store["reliabilityEvidence"],
    reliabilityUpdatedAt: store.reliabilityUpdatedAt?.toISOString() ?? null,
    replySlaSnapshot: store.replySlaSnapshot,
    badgeLabel: getBadgeLabel(store.reliabilityState)
  };
}

async function fetchStores() {
  return db.store.findMany({
    include: {
      statusSnapshots: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });
}

export async function getHomeView(): Promise<HomeViewModel> {
  const stores = await db.store.findMany({
    include: {
      statusSnapshots: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    },
    orderBy: [
      {
        heroRank: "asc"
      },
      {
        reservationRank: "asc"
      }
    ]
  });

  const mappedStores = stores.map(mapStore);
  const heroCandidates = stores.filter((store) => getStoreEligibility(store) === "hero");
  const reservationCandidates = stores.filter((store) => {
    const eligibility = getStoreEligibility(store);
    return eligibility === "hero" || eligibility === "reservation_shelf";
  });

  if (mappedStores.length === 0) {
    throw new Error("No stores seeded in database. Run `npm run db:seed`.");
  }

  const heroStore = (heroCandidates[0] ? mapStore(heroCandidates[0]) : mappedStores[0]);
  const reservationShelf = (reservationCandidates.length > 0 ? reservationCandidates : stores)
    .map(mapStore)
    .slice()
    .sort((left, right) => left.waitMinutes - right.waitMinutes)
    .slice(0, 3);
  const discoveryShelf = mappedStores
    .filter((store) => store.slug !== heroStore.slug)
    .slice()
    .sort((left, right) => left.walkMinutes - right.walkMinutes)
    .reverse()
    .slice(0, 4);

  const qualitySegment =
    heroCandidates.length === 0
      ? "orange"
      : reservationCandidates.length <= 1
        ? "amber"
        : "green";

  return {
    locationLabel: defaultLocationLabel,
    heroStore,
    reservationShelf,
    discoveryShelf,
    qualitySegment
  };
}

export function getQualityStateView(segment: HomeViewModel["qualitySegment"]): QualityStateViewModel {
  switch (segment) {
    case "amber":
      return {
        segment,
        headline: "いまは確認を少し丁寧にしています",
        body: "おすすめの出し方や即時導線を少し控えめにしつつ、詳細や一覧からは変わらず見られる状態です。",
        statusLabel: "即時導線をやや調整中",
        recoveryActions: ["詳細ページから相談する", "近くの候補を見直す", "少し時間をずらして試す"]
      };
    case "orange":
      return {
        segment,
        headline: "今日は詳細からの確認をおすすめしています",
        body: "おすすめ面での露出は控えめですが、公開詳細や固定URLからは通常どおり確認できます。",
        statusLabel: "おすすめ表示を制御中",
        recoveryActions: ["詳細ページで営業時間を確認", "別時間の候補を見る", "掲載店の一覧へ移動する"]
      };
    case "red":
      return {
        segment,
        headline: "いまは手動確認を優先しています",
        body: "同日向けの強い導線は止めつつ、公開ページから情報確認と通常相談は続けられる状態です。",
        statusLabel: "即時予約は停止中",
        recoveryActions: ["公開詳細を確認する", "別日程を検討する", "エリア一覧から別候補を見る"]
      };
    case "green":
    default:
      return {
        segment: "green",
        headline: "いま行きやすい候補をそのまま見られます",
        body: "おすすめ、近くの候補、詳細ページの導線がそのまま使える通常状態です。",
        statusLabel: "おすすめ表示は通常",
        recoveryActions: ["まずおすすめを見る", "近くの候補を比較する", "詳細からLINEで相談する"]
      };
  }
}

export function getPricingPlans(): PricingPlan[] {
  return [
    {
      id: "basic",
      name: "Basic Listing",
      monthlyLabel: "月額固定 / 掲載開始向け",
      description: "まず掲載を始めて、詳細ページとLINE相談導線を整えるための基本プランです。",
      features: ["掲載店バッジ", "店舗詳細ページ", "LINE導線の基本計測", "固定URLの掲載"]
    },
    {
      id: "same-day",
      name: "Same-Day Assist",
      monthlyLabel: "月額固定 / 当日送客向け",
      description: "same-day 送客と更新運用を回しながら、Heroや予約棚への露出対象を整えるプランです。",
      features: ["Store Board運用", "same-day候補反映", "月次簡易レポート", "返信導線の見直し"],
      highlight: true
    },
    {
      id: "growth",
      name: "Growth Support",
      monthlyLabel: "月額固定 / 強化向け",
      description: "固定ページや素材補助も含めて、検索入口と掲載面の厚みを増やす拡張プランです。",
      features: ["固定URL強化", "素材制作補助", "特集ページ相談", "運用セットアップ"]
    }
  ];
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const store = await db.store.findUnique({
    where: {
      slug
    },
    include: {
      statusSnapshots: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });

  return store ? mapStore(store) : null;
}

export async function getStoreById(id: string): Promise<Store | null> {
  const store = await db.store.findUnique({
    where: {
      id
    },
    include: {
      statusSnapshots: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });

  return store ? mapStore(store) : null;
}

export async function getRelatedStores(store: Store): Promise<Store[]> {
  const stores = await fetchStores();

  return stores
    .filter((candidate) => store.relatedStoreSlugs.includes(candidate.slug))
    .map(mapStore);
}

export async function getAllStoreSlugs() {
  const stores = await db.store.findMany({
    select: {
      slug: true
    }
  });

  return stores.map((store) => store.slug);
}
