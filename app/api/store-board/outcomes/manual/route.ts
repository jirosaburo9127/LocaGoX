import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { syncStoreReliability } from "@/lib/reliability";

const schema = z.object({
  bookingSessionId: z.string().min(1),
  nextState: z.enum([
    "accepted",
    "alternate_time_proposed",
    "full",
    "timeout",
    "rejected"
  ]),
  reasonCode: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = schema.safeParse({
    bookingSessionId: formData.get("bookingSessionId"),
    nextState: formData.get("nextState"),
    reasonCode: formData.get("reasonCode")
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_manual_outcome",
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
      state: parsed.data.nextState
    }
  });

  await db.bookingOutcome.create({
    data: {
      bookingSessionId: parsed.data.bookingSessionId,
      state: parsed.data.nextState,
      source: "manual_fallback",
      reasonCode: parsed.data.reasonCode,
      confirmationOrigin: "store_board_manual"
    }
  });

  await db.auditLog.create({
    data: {
      actorRole: "store_board",
      targetType: "booking_session",
      targetId: parsed.data.bookingSessionId,
      action: "manual_outcome_recorded",
      afterState: {
        state: parsed.data.nextState
      },
      reasonCode: parsed.data.reasonCode
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
    await syncStoreReliability(session.storeId, "store_board_manual_outcome");
  }

  return NextResponse.redirect(new URL("/store-board", request.url), {
    status: 303
  });
}
