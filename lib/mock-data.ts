import type { HomeViewModel, Store } from "@/lib/domain";

function toCatalogSegment(value: string) {
  return value.trim().toLowerCase().replaceAll(/\s+/g, "-");
}

const mockStores: Store[] = [
  {
    id: "mock-sonoda-head-spa",
    slug: "sonoda-head-spa",
    name: "Sonoda Head Spa",
    area: "恵比寿",
    category: "ヘッドスパ",
    walkMinutes: 6,
    waitMinutes: 10,
    lastOrderAt: "20:15",
    isOpen: true,
    benefitTags: ["当日OK", "静かな個室", "仕事帰り向き"],
    heroCopy: "45分メニューが主役。今日は迷わずここから進める設計にしています。",
    faq: ["LINE返信は通常5分以内です。", "予約成立は店舗の accepted 返信で確定します。", "満枠時は別時間か次候補へ戻せます。"],
    menuHighlights: ["45分 頭浸浴", "60分 肩首ケア", "30分 クイック回復"],
    relatedStoreSlugs: ["costa-relax", "kuu-reset"],
    reliabilityState: "healthy",
    reliabilityMode: "mock",
    reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null,
    reliabilityUpdatedAt: null,
    replySlaSnapshot: "通常5分以内",
    badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-costa-relax",
    slug: "costa-relax",
    name: "Costa Relax",
    area: "恵比寿",
    category: "ヘッドスパ",
    walkMinutes: 8,
    waitMinutes: 15,
    lastOrderAt: "21:00",
    isOpen: true,
    benefitTags: ["駅近", "夜21時まで", "初回短時間"],
    heroCopy: "遅めの時間帯に強い第2候補。",
    faq: ["ショートメニューあり。", "混雑時は別時間提案に切り替えます。"],
    menuHighlights: ["35分 ライトケア", "50分 深めケア"],
    relatedStoreSlugs: ["sonoda-head-spa", "kuu-reset"],
    reliabilityState: "caution",
    reliabilityMode: "mock",
    reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null,
    reliabilityUpdatedAt: null,
    replySlaSnapshot: "通常10分以内",
    badgeLabel: "確認しながら案内中"
  },
  {
    id: "mock-kuu-reset",
    slug: "kuu-reset",
    name: "Kuu Reset Lab",
    area: "中目黒",
    category: "整体",
    walkMinutes: 9,
    waitMinutes: 5,
    lastOrderAt: "19:45",
    isOpen: true,
    benefitTags: ["当日枠あり", "姿勢ケア", "静音ブース"],
    heroCopy: "整体カテゴリの補助候補。比較を増やしすぎず逃げ先として置きます。",
    faq: ["初回の所要確認があります。", "満枠時は近い棚へ戻ります。"],
    menuHighlights: ["40分 体幹リセット", "60分 全身ケア"],
    relatedStoreSlugs: ["sonoda-head-spa", "costa-relax"],
    reliabilityState: "healthy",
    reliabilityMode: "mock",
    reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null,
    reliabilityUpdatedAt: null,
    replySlaSnapshot: "通常5分以内",
    badgeLabel: "LINE相談しやすい掲載店"
  }
];

export function getMockStores() {
  return mockStores;
}

export function getMockStoreBySlug(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

export function getMockStoreById(id: string) {
  return mockStores.find((store) => store.id === id) ?? null;
}

export function getMockHomeView(): HomeViewModel {
  return {
    locationLabel: "渋谷区恵比寿西 1-9 付近",
    heroStore: mockStores[0],
    reservationShelf: [mockStores[2], mockStores[0], mockStores[1]],
    discoveryShelf: [mockStores[2], mockStores[0], mockStores[1]],
    qualitySegment: "green"
  };
}

export function getMockStoreSlugs() {
  return mockStores.map((store) => store.slug);
}

export function getMockRelatedStores(store: Store) {
  return mockStores.filter((candidate) => store.relatedStoreSlugs.includes(candidate.slug));
}

export function getMockAreaCategoryStaticParams() {
  const seen = new Set<string>();

  return mockStores
    .map((store) => ({
      area: toCatalogSegment(store.area),
      category: toCatalogSegment(store.category)
    }))
    .filter((entry) => {
      const key = `${entry.area}:${entry.category}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function getMockAreaCategoryView(areaSegment: string, categorySegment: string) {
  const stores = mockStores.filter(
    (store) => toCatalogSegment(store.area) === areaSegment && toCatalogSegment(store.category) === categorySegment
  );

  if (stores.length === 0) {
    return null;
  }

  return {
    area: stores[0].area,
    category: stores[0].category,
    stores
  };
}
