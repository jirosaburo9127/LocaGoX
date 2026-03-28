import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { BookingSessionState, NavigationContext, OutcomeSource } from "@/lib/domain";

const navigationContextSchema = z.object({
  sourceSurface: z.enum([
    "home.hero",
    "home.reservation_shelf",
    "home.discovery_shelf",
    "direct_entry"
  ]),
  shelfId: z.string().min(1),
  scrollY: z.number().min(0),
  locationLabel: z.string().min(1),
  filters: z.array(z.string())
});

export const createBookingSessionSchema = z.object({
  storeId: z.string().min(1),
  preferredWindow: z.string().min(1),
  etaMinutes: z.number().min(0).max(240),
  menuHint: z.string().min(1),
  navigationContext: navigationContextSchema
});

export const createOutcomeSchema = z.object({
  bookingSessionId: z.string().min(1),
  nextState: z.enum([
    "accepted",
    "alternate_time_proposed",
    "full",
    "timeout",
    "rejected",
    "review_required"
  ] satisfies [BookingSessionState, ...BookingSessionState[]]),
  source: z.enum([
    "official_line_reservation_core",
    "manual_fallback",
    "ops_override"
  ] satisfies [OutcomeSource, ...OutcomeSource[]]),
  reasonCode: z.string().min(1),
  callbackEventId: z.string().min(1).optional()
});

export function createReturnToken(context: NavigationContext): string {
  return Buffer.from(JSON.stringify({ ...context, v: 1 }), "utf8").toString("base64url");
}

export function decodeReturnToken(token: string): NavigationContext | null {
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    return navigationContextSchema.parse(parsed);
  } catch {
    return null;
  }
}

export function buildBookingSession(input: z.infer<typeof createBookingSessionSchema>) {
  const now = new Date().toISOString();

  return {
    id: `bs_${randomUUID()}`,
    state: "message_prefilled" as const,
    sourceSurface: input.navigationContext.sourceSurface,
    preferredWindow: input.preferredWindow,
    etaMinutes: input.etaMinutes,
    menuHint: input.menuHint,
    returnToken: createReturnToken(input.navigationContext),
    storeId: input.storeId,
    createdAt: now,
    updatedAt: now
  };
}
