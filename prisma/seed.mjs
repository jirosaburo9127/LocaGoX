import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stores = [
  {
    slug: "sonoda-head-spa",
    name: "Sonoda Head Spa",
    area: "恵比寿",
    category: "ヘッドスパ",
    walkMinutes: 6,
    lastOrderAt: "20:15",
    isOpen: true,
    heroCopy: "45分メニューが主役。今日は迷わずここから進める設計にしています。",
    benefitTags: ["当日OK", "静かな個室", "仕事帰り向き"],
    faq: [
      "LINE返信は通常5分以内です。",
      "予約成立は店舗の accepted 返信で確定します。",
      "満枠時は別時間か次候補へ戻せます。"
    ],
    menuHighlights: ["45分 頭浸浴", "60分 肩首ケア", "30分 クイック回復"],
    relatedStoreSlugs: ["costa-relax", "kuu-reset"],
    heroRank: 1,
    reservationRank: 1,
    discoveryRank: 2,
    status: {
      acceptingSameDay: true,
      waitMinutes: 10,
      nextAvailableWindow: "19:00-20:00",
      note: "即返答しやすい主役候補",
      updatedBy: "seed"
    }
  },
  {
    slug: "costa-relax",
    name: "Costa Relax",
    area: "恵比寿",
    category: "ヘッドスパ",
    walkMinutes: 8,
    lastOrderAt: "21:00",
    isOpen: true,
    heroCopy: "遅めの時間帯に強い第2候補。",
    benefitTags: ["駅近", "夜21時まで", "初回短時間"],
    faq: ["ショートメニューあり。", "混雑時は別時間提案に切り替えます。"],
    menuHighlights: ["35分 ライトケア", "50分 深めケア"],
    relatedStoreSlugs: ["sonoda-head-spa", "kuu-reset"],
    heroRank: 2,
    reservationRank: 2,
    discoveryRank: 3,
    status: {
      acceptingSameDay: true,
      waitMinutes: 15,
      nextAvailableWindow: "20:00-21:00",
      note: "夜帯の逃げ先",
      updatedBy: "seed"
    }
  },
  {
    slug: "kuu-reset",
    name: "Kuu Reset Lab",
    area: "中目黒",
    category: "整体",
    walkMinutes: 9,
    lastOrderAt: "19:45",
    isOpen: true,
    heroCopy: "整体カテゴリの補助候補。比較を増やしすぎず逃げ先として置きます。",
    benefitTags: ["当日枠あり", "姿勢ケア", "静音ブース"],
    faq: ["初回の所要確認があります。", "満枠時は近い棚へ戻ります。"],
    menuHighlights: ["40分 体幹リセット", "60分 全身ケア"],
    relatedStoreSlugs: ["sonoda-head-spa", "costa-relax"],
    heroRank: 3,
    reservationRank: 3,
    discoveryRank: 1,
    status: {
      acceptingSameDay: true,
      waitMinutes: 5,
      nextAvailableWindow: "18:30-19:30",
      note: "整体カテゴリの補助候補",
      updatedBy: "seed"
    }
  }
];

async function main() {
  for (const store of stores) {
    const savedStore = await prisma.store.upsert({
      where: {
        slug: store.slug
      },
      update: {
        name: store.name,
        area: store.area,
        category: store.category,
        walkMinutes: store.walkMinutes,
        lastOrderAt: store.lastOrderAt,
        isOpen: store.isOpen,
        heroCopy: store.heroCopy,
        benefitTags: store.benefitTags,
        faq: store.faq,
        menuHighlights: store.menuHighlights,
        relatedStoreSlugs: store.relatedStoreSlugs,
        heroRank: store.heroRank,
        reservationRank: store.reservationRank,
        discoveryRank: store.discoveryRank
      },
      create: {
        slug: store.slug,
        name: store.name,
        area: store.area,
        category: store.category,
        walkMinutes: store.walkMinutes,
        lastOrderAt: store.lastOrderAt,
        isOpen: store.isOpen,
        heroCopy: store.heroCopy,
        benefitTags: store.benefitTags,
        faq: store.faq,
        menuHighlights: store.menuHighlights,
        relatedStoreSlugs: store.relatedStoreSlugs,
        heroRank: store.heroRank,
        reservationRank: store.reservationRank,
        discoveryRank: store.discoveryRank
      }
    });

    await prisma.storeStatusSnapshot.create({
      data: {
        storeId: savedStore.id,
        acceptingSameDay: store.status.acceptingSameDay,
        waitMinutes: store.status.waitMinutes,
        nextAvailableWindow: store.status.nextAvailableWindow,
        note: store.status.note,
        updatedBy: store.status.updatedBy
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
