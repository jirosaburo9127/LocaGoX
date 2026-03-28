import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { syncStoreReliability } from "@/lib/reliability";

const schema = z.object({
  reviewQueueItemId: z.string().min(1),
  bookingSessionId: z.string().min(1),
  resolvedState: z.enum([
    "accepted",
    "alternate_time_proposed",
    "full",
    "timeout",
    "rejected"
  ]),
  resolutionNote: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = schema.safeParse({
    reviewQueueItemId: formData.get("reviewQueueItemId"),
    bookingSessionId: formData.get("bookingSessionId"),
    resolvedState: formData.get("resolvedState"),
    resolutionNote: formData.get("resolutionNote")
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_review_resolution",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  await db.bookingSession.update({
    where: {
      id: parsed.data.bookingSessionId
    },
    data: {
      state: parsed.data.resolvedState
    }
  });

  await db.bookingOutcome.create({
    data: {
      bookingSessionId: parsed.data.bookingSessionId,
      state: parsed.data.resolvedState,
      source: "ops_override",
      reasonCode: "review_queue_resolution",
      confirmationOrigin: "ops_review_queue",
      evidenceRef: parsed.data.resolutionNote
    }
  });

  await db.reviewQueueItem.update({
    where: {
      id: parsed.data.reviewQueueItemId
    },
    data: {
      status: "resolved",
      resolvedState: parsed.data.resolvedState,
      resolutionNote: parsed.data.resolutionNote,
      resolvedBy: "ops_console",
      resolvedAt: new Date()
    }
  });

  await db.auditLog.create({
    data: {
      actorRole: "ops_console",
      targetType: "review_queue_item",
      targetId: parsed.data.reviewQueueItemId,
      action: "review_resolved",
      afterState: {
        resolvedState: parsed.data.resolvedState
      },
      reasonCode: parsed.data.resolutionNote
    }
  });

  const session = await db.bookingSession.findUnique({
    where: {
      id: parsed.data.bookingSessionId
    },
    select: {
      storeId: true
    }
  });

  if (session) {
    await syncStoreReliability(session.storeId, "ops_review_resolved");
  }

  return NextResponse.redirect(new URL("/ops/review-queue", request.url), {
    status: 303
  });
}
