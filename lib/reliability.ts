import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const BLOCKING_STATES = new Set(["full", "timeout", "rejected"]);
const POSITIVE_STATES = new Set(["accepted", "alternate_time_proposed"]);

function buildDerivedState(input: {
  openReviewCount: number;
  acceptedCount: number;
  alternateCount: number;
  blockingCount: number;
  totalOutcomes: number;
}) {
  if (input.openReviewCount > 0) {
    return {
      state: "manual_only",
      reason: "open_review_queue_detected"
    } as const;
  }

  if (input.blockingCount >= 3 && input.acceptedCount === 0) {
    return {
      state: "manual_only",
      reason: "repeated_blocking_outcomes_detected"
    } as const;
  }

  if (input.blockingCount >= 2 || (input.totalOutcomes >= 3 && input.acceptedCount === 0 && input.alternateCount === 0)) {
    return {
      state: "caution",
      reason: "same_day_outcomes_need_careful_guidance"
    } as const;
  }

  return {
    state: "healthy",
    reason: "recent_store_replies_are_stable"
  } as const;
}

export async function syncStoreReliability(storeId: string, trigger: string) {
  const store = await db.store.findUnique({
    where: {
      id: storeId
    },
    select: {
      id: true,
      reliabilityState: true,
      reliabilityMode: true,
      reliabilityReason: true
    }
  });

  if (!store || store.reliabilityMode === "manual_override") {
    return {
      skipped: true as const
    };
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [recentOutcomes, openReviewCount] = await Promise.all([
    db.bookingOutcome.findMany({
      where: {
        bookingSession: {
          storeId
        },
        occurredAt: {
          gte: since
        }
      },
      orderBy: {
        occurredAt: "desc"
      },
      take: 8,
      select: {
        state: true
      }
    }),
    db.reviewQueueItem.count({
      where: {
        status: "open",
        bookingSession: {
          storeId
        }
      }
    })
  ]);

  const acceptedCount = recentOutcomes.filter((outcome) => outcome.state === "accepted").length;
  const alternateCount = recentOutcomes.filter((outcome) => outcome.state === "alternate_time_proposed").length;
  const blockingCount = recentOutcomes.filter((outcome) => BLOCKING_STATES.has(outcome.state)).length;

  const derived = buildDerivedState({
    openReviewCount,
    acceptedCount,
    alternateCount,
    blockingCount,
    totalOutcomes: recentOutcomes.length
  });

  const evidence = {
    windowHours: 24,
    totalOutcomes: recentOutcomes.length,
    acceptedCount,
    alternateCount,
    blockedCount: blockingCount,
    reviewOpenCount: openReviewCount,
    trigger
  } satisfies Prisma.InputJsonValue;

  if (store.reliabilityState === derived.state && store.reliabilityReason === derived.reason) {
    await db.store.update({
      where: {
        id: storeId
      },
      data: {
        reliabilityEvidence: evidence,
        reliabilityUpdatedAt: new Date()
      }
    });

    return {
      skipped: false as const,
      changed: false as const
    };
  }

  await db.store.update({
    where: {
      id: storeId
    },
    data: {
      reliabilityState: derived.state,
      reliabilityReason: derived.reason,
      reliabilityEvidence: evidence,
      reliabilityUpdatedAt: new Date()
    }
  });

  await db.auditLog.create({
    data: {
      actorRole: "system",
      targetType: "store",
      targetId: storeId,
      action: "reliability_recomputed",
      beforeState: {
        reliabilityState: store.reliabilityState,
        reliabilityReason: store.reliabilityReason
      },
      afterState: {
        reliabilityState: derived.state,
        reliabilityReason: derived.reason
      },
      reasonCode: trigger
    }
  });

  return {
    skipped: false as const,
    changed: true as const,
    state: derived.state
  };
}

export function formatReliabilityReason(reason: string | null) {
  switch (reason) {
    case "open_review_queue_detected":
      return "未解決の競合があるため手動確認を優先中";
    case "repeated_blocking_outcomes_detected":
      return "満枠やタイムアウトが続いたため強い即時導線を止めています";
    case "same_day_outcomes_need_careful_guidance":
      return "当日返信の安定性を見ながら慎重に案内しています";
    case "recent_store_replies_are_stable":
      return "最近の返信状況は安定しています";
    default:
      return "手動更新または初期状態です";
  }
}
