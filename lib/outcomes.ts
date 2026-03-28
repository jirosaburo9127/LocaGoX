import type { Prisma } from "@prisma/client";
import type { BookingSessionState, OutcomeSource } from "@/lib/domain";
import { db } from "@/lib/db";
import { syncStoreReliability } from "@/lib/reliability";

type RecordOutcomeInput = {
  bookingSessionId: string;
  nextState: BookingSessionState;
  source: OutcomeSource;
  reasonCode: string;
  callbackEventId?: string;
  confirmationOrigin?: string;
  evidenceRef?: string;
};

const conflictReasons = {
  manualFallbackCompeted: "manual_fallback_and_callback_competed",
  invalidTransition: "invalid_transition_requires_review"
} as const;

export async function queueReviewItem(input: {
  bookingSessionId: string;
  storeId: string;
  reasonCode: string;
  payload: Prisma.InputJsonValue;
}) {
  await db.bookingSession.update({
    where: {
      id: input.bookingSessionId
    },
    data: {
      state: "review_required"
    }
  });

  await db.bookingOutcome.create({
    data: {
      bookingSessionId: input.bookingSessionId,
      state: "review_required",
      source: "manual_fallback",
      reasonCode: input.reasonCode,
      confirmationOrigin: "review_queue"
    }
  });

  await db.reviewQueueItem.create({
    data: {
      bookingSessionId: input.bookingSessionId,
      reasonCode: input.reasonCode,
      payload: input.payload
    }
  });

  await db.auditLog.create({
    data: {
      actorRole: "system",
      targetType: "booking_session",
      targetId: input.bookingSessionId,
      action: "conflict_queued",
      afterState: {
        state: "review_required"
      },
      reasonCode: input.reasonCode
    }
  });

  await syncStoreReliability(input.storeId, "review_item_queued");
}

export async function recordBookingOutcome(input: RecordOutcomeInput) {
  if (input.callbackEventId) {
    const existingCallback = await db.bookingOutcome.findFirst({
      where: {
        callbackEventId: input.callbackEventId
      }
    });

    if (existingCallback) {
      return {
        kind: "duplicate" as const,
        bookingSessionId: existingCallback.bookingSessionId,
        state: existingCallback.state
      };
    }
  }

  const session = await db.bookingSession.findUnique({
    where: {
      id: input.bookingSessionId
    },
    include: {
      store: {
        select: {
          id: true
        }
      },
      outcomes: {
        orderBy: {
          occurredAt: "desc"
        },
        take: 1
      }
    }
  });

  if (!session) {
    return {
      kind: "not_found" as const
    };
  }

  const latestOutcome = session.outcomes[0];
  const manualConflict =
    input.source === "official_line_reservation_core" &&
    latestOutcome?.source === "manual_fallback" &&
    session.state !== "review_required";

  if (manualConflict) {
    await queueReviewItem({
      bookingSessionId: input.bookingSessionId,
      storeId: session.store.id,
      reasonCode: conflictReasons.manualFallbackCompeted,
      payload: {
        callbackEventId: input.callbackEventId,
        requestedState: input.nextState,
        sessionState: session.state
      }
    });

    return {
      kind: "queued" as const,
      reviewReason: conflictReasons.manualFallbackCompeted
    };
  }

  const terminalStates: BookingSessionState[] = [
    "accepted",
    "alternate_time_proposed",
    "full",
    "timeout",
    "rejected"
  ];
  const invalidTransition =
    terminalStates.includes(session.state) &&
    session.state !== input.nextState &&
    session.state !== "review_required";

  if (invalidTransition) {
    await queueReviewItem({
      bookingSessionId: input.bookingSessionId,
      storeId: session.store.id,
      reasonCode: conflictReasons.invalidTransition,
      payload: {
        callbackEventId: input.callbackEventId,
        requestedState: input.nextState,
        sessionState: session.state
      }
    });

    return {
      kind: "queued" as const,
      reviewReason: conflictReasons.invalidTransition
    };
  }

  const updatedSession = await db.bookingSession.update({
    where: {
      id: input.bookingSessionId
    },
    data: {
      state: input.nextState
    }
  });

  await db.bookingOutcome.create({
    data: {
      bookingSessionId: input.bookingSessionId,
      state: input.nextState,
      source: input.source,
      reasonCode: input.reasonCode,
      callbackEventId: input.callbackEventId,
      confirmationOrigin:
        input.confirmationOrigin ??
        (input.nextState === "accepted" ? "store.reply.accepted" : input.source),
      evidenceRef: input.evidenceRef
    }
  });

  await db.auditLog.create({
    data: {
      actorRole: input.source,
      targetType: "booking_session",
      targetId: input.bookingSessionId,
      action: "outcome_recorded",
      afterState: {
        state: input.nextState
      },
      reasonCode: input.reasonCode
    }
  });

  await syncStoreReliability(session.store.id, "booking_outcome_recorded");

  return {
    kind: "recorded" as const,
    bookingSessionId: updatedSession.id,
    state: input.nextState
  };
}
