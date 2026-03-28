import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLineSetupStatus, verifyLineSignature } from "@/lib/line";
import { recordBookingOutcome } from "@/lib/outcomes";

const eventSchema = z.object({
  webhookEventId: z.string().min(1),
  type: z.string().min(1),
  timestamp: z.number().optional(),
  deliveryContext: z
    .object({
      isRedelivery: z.boolean().optional()
    })
    .optional(),
  postback: z.object({
    data: z.string().min(1)
  })
});

const callbackSchema = z.object({
  destination: z.string().optional(),
  events: z.array(eventSchema).min(1)
});

function parsePostbackData(data: string) {
  const params = new URLSearchParams(data);

  return {
    bookingSessionId: params.get("bookingSessionId") ?? "",
    status: params.get("status") ?? "",
    reasonCode: params.get("reasonCode") ?? "line_status_callback",
    proposedWindow: params.get("proposedWindow") ?? undefined
  };
}

export async function GET() {
  const status = getLineSetupStatus();

  return NextResponse.json({
    ok: true,
    endpoint: "/api/integrations/line/status-callback",
    webhookUrl: status.webhookUrl || null,
    signatureVerificationEnabled: status.signatureVerificationEnabled,
    now: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signatureCheck = verifyLineSignature(rawBody, request.headers.get("x-line-signature"));

  if (!signatureCheck.ok) {
    return NextResponse.json(
      {
        error: "invalid_line_signature",
        reason: signatureCheck.reason
      },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        error: "invalid_json_body"
      },
      { status: 400 }
    );
  }

  const parsed = callbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_line_callback",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const outcomes = [];

  for (const event of parsed.data.events) {
    if (event.type !== "postback") {
      outcomes.push({
        webhookEventId: event.webhookEventId,
        skipped: true,
        reason: "unsupported_event_type"
      });
      continue;
    }

    const postback = parsePostbackData(event.postback.data);
    const statusParse = z
      .enum(["accepted", "alternate_time_proposed", "full", "timeout", "rejected"])
      .safeParse(postback.status);

    if (!postback.bookingSessionId || !statusParse.success) {
      outcomes.push({
        webhookEventId: event.webhookEventId,
        skipped: true,
        reason: "invalid_postback_payload"
      });
      continue;
    }

    const result = await recordBookingOutcome({
      bookingSessionId: postback.bookingSessionId,
      nextState: statusParse.data,
      source: "official_line_reservation_core",
      reasonCode: postback.reasonCode,
      callbackEventId: event.webhookEventId,
      confirmationOrigin:
        statusParse.data === "accepted" ? "line.callback.accepted" : "line.callback.status",
      evidenceRef: postback.proposedWindow
    });

    if (result.kind === "not_found") {
      outcomes.push({
        webhookEventId: event.webhookEventId,
        ok: false,
        error: "booking_session_not_found"
      });
      continue;
    }

    if (result.kind === "duplicate") {
      outcomes.push({
        webhookEventId: event.webhookEventId,
        ok: true,
        duplicate: true,
        bookingSessionId: result.bookingSessionId,
        state: result.state
      });
      continue;
    }

    if (result.kind === "queued") {
      outcomes.push({
        webhookEventId: event.webhookEventId,
        ok: false,
        state: "review_required",
        reviewReason: result.reviewReason
      });
      continue;
    }

    outcomes.push({
      webhookEventId: event.webhookEventId,
      ok: true,
      bookingSessionId: result.bookingSessionId,
      state: result.state
    });
  }

  return NextResponse.json({
    ok: true,
    signatureMode: signatureCheck.mode,
    results: outcomes
  });
}
