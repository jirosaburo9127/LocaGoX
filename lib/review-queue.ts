import { db } from "@/lib/db";
import type { ReviewQueueItem } from "@/lib/domain";

function mapReviewItem(item: {
  id: string;
  bookingSessionId: string;
  reasonCode: string;
  status: string;
  createdAt: Date;
  resolutionNote: string | null;
  bookingSession: {
    state: string;
    preferredWindow: string;
    sourceSurface: string;
    store: {
      name: string;
    };
  };
}): ReviewQueueItem {
  return {
    id: item.id,
    bookingSessionId: item.bookingSessionId,
    storeName: item.bookingSession.store.name,
    sessionState: item.bookingSession.state as ReviewQueueItem["sessionState"],
    preferredWindow: item.bookingSession.preferredWindow,
    reasonCode: item.reasonCode,
    sourceSurface: item.bookingSession.sourceSurface,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    resolutionNote: item.resolutionNote
  };
}

export async function getReviewQueueView() {
  const items = await db.reviewQueueItem.findMany({
    where: {
      status: "open"
    },
    include: {
      bookingSession: {
        include: {
          store: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return items.map(mapReviewItem);
}
