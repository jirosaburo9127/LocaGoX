import { NextRequest, NextResponse } from "next/server";
import { createOutcomeSchema } from "@/lib/booking";
import { recordBookingOutcome } from "@/lib/outcomes";

const allowedTransitions = new Set([
  "accepted",
  "alternate_time_proposed",
  "full",
  "timeout",
  "rejected",
  "review_required"
]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const parsed = createOutcomeSchema.safeParse({
    ...body,
    bookingSessionId: id
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_outcome_request",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  if (!allowedTransitions.has(parsed.data.nextState)) {
    return NextResponse.json(
      {
        error: "invalid_transition"
      },
      { status: 409 }
    );
  }

  const result = await recordBookingOutcome({
    bookingSessionId: id,
    nextState: parsed.data.nextState,
    source: parsed.data.source,
    reasonCode: parsed.data.reasonCode,
    callbackEventId: parsed.data.callbackEventId
  });

  if (result.kind === "not_found") {
    return NextResponse.json(
      {
        error: "booking_session_not_found"
      },
      { status: 404 }
    );
  }

  if (result.kind === "duplicate") {
    return NextResponse.json({
      bookingSessionId: result.bookingSessionId,
      state: result.state,
      duplicate: true,
      auditSynchronized: true
    });
  }

  if (result.kind === "queued") {
    return NextResponse.json(
      {
        state: "review_required",
        reviewReason: result.reviewReason,
        bookingSessionId: id
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    bookingSessionId: result.bookingSessionId,
    state: result.state,
    source: parsed.data.source,
    reasonCode: parsed.data.reasonCode,
    auditSynchronized: true
  });
}
