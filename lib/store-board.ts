import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { StoreBoardSession, StoreBoardStore } from "@/lib/domain";
import { formatReliabilityReason } from "@/lib/reliability";

function mapBoardStore(store: {
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
    acceptingSameDay: boolean;
    waitMinutes: number | null;
    nextAvailableWindow: string | null;
    note: string | null;
    createdAt: Date;
  }>;
}): StoreBoardStore {
  const latestStatus = store.statusSnapshots[0];

  return {
    id: store.id,
    slug: store.slug,
    name: store.name,
    area: store.area,
    category: store.category,
    walkMinutes: store.walkMinutes,
    waitMinutes: latestStatus?.waitMinutes ?? 0,
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
    reliabilityEvidence: store.reliabilityEvidence as StoreBoardStore["reliabilityEvidence"],
    reliabilityUpdatedAt: store.reliabilityUpdatedAt?.toISOString() ?? null,
    replySlaSnapshot: store.replySlaSnapshot,
    badgeLabel:
      store.reliabilityState === "healthy"
        ? "LINE相談しやすい掲載店"
        : store.reliabilityState === "caution"
          ? "確認しながら案内中"
          : "詳細確認を優先中",
    nextAvailableWindow: latestStatus?.nextAvailableWindow ?? null,
    note: latestStatus?.note ?? null,
    acceptingSameDay: latestStatus?.acceptingSameDay ?? true,
    updatedAt: latestStatus?.createdAt.toISOString() ?? new Date(0).toISOString()
  };
}

function mapBoardSession(session: {
  id: string;
  storeId: string;
  state: string;
  preferredWindow: string;
  menuHint: string | null;
  sourceSurface: string;
  createdAt: Date;
  store: {
    name: string;
  };
}): StoreBoardSession {
  return {
    id: session.id,
    storeId: session.storeId,
    storeName: session.store.name,
    state: session.state as StoreBoardSession["state"],
    preferredWindow: session.preferredWindow,
    menuHint: session.menuHint,
    sourceSurface: session.sourceSurface,
    createdAt: session.createdAt.toISOString()
  };
}

export async function getStoreBoardView() {
  const [stores, sessions] = await Promise.all([
    db.store.findMany({
      include: {
        statusSnapshots: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        reservationRank: "asc"
      }
    }),
    db.bookingSession.findMany({
      include: {
        store: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 12
    })
  ]);

  return {
    stores: stores.map(mapBoardStore),
    sessions: sessions.map(mapBoardSession)
  };
}

export { formatReliabilityReason };
