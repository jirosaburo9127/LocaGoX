import { NextRequest, NextResponse } from "next/server";
import { buildBookingSession, createBookingSessionSchema } from "@/lib/booking";
import { db } from "@/lib/db";
import { getStoreById } from "@/lib/data";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const parsed = createBookingSessionSchema.safeParse({
    storeId: url.searchParams.get("storeId"),
    preferredWindow: url.searchParams.get("preferredWindow"),
    etaMinutes: Number(url.searchParams.get("etaMinutes") ?? "-1"),
    menuHint: url.searchParams.get("menuHint"),
    navigationContext: {
      sourceSurface: url.searchParams.get("sourceSurface") ?? "direct_entry",
      shelfId: url.searchParams.get("shelfId") ?? "reservation-near-open",
      scrollY: Number(url.searchParams.get("scrollY") ?? "0"),
      locationLabel: url.searchParams.get("locationLabel") ?? "渋谷区恵比寿西 1-9 付近",
      filters: (url.searchParams.get("filters") ?? "当日OK,駅近")
        .split(",")
        .filter(Boolean)
    }
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_booking_session_request",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const session = buildBookingSession(parsed.data);
  const store = await getStoreById(parsed.data.storeId);

  if (!store) {
    return NextResponse.json(
      {
        error: "store_not_found"
      },
      { status: 404 }
    );
  }

  const sameDayBlocked =
    store.reliabilityState === "manual_only" ||
    !store.isOpen;

  if (sameDayBlocked) {
    return NextResponse.json(
      {
        error: "store_requires_manual_review",
        reason: store.reliabilityState,
        fallback: {
          type: "detail_only",
          href: `/stores/${store.slug}?source=direct_entry&shelf=manual-review&scroll=0`,
          message: "この店舗は今、詳細ページからの確認を優先しています。"
        }
      },
      { status: 409 }
    );
  }

  const navigationContext = await db.navigationContext.create({
    data: {
      sourceSurface: parsed.data.navigationContext.sourceSurface,
      shelfId: parsed.data.navigationContext.shelfId,
      scrollY: parsed.data.navigationContext.scrollY,
      locationLabel: parsed.data.navigationContext.locationLabel,
      filterState: parsed.data.navigationContext.filters,
      signedToken: session.returnToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    }
  });

  const persistedSession = await db.bookingSession.create({
    data: {
      storeId: parsed.data.storeId,
      state: session.state,
      sourceSurface: session.sourceSurface,
      preferredWindow: session.preferredWindow,
      etaMinutes: session.etaMinutes,
      menuHint: session.menuHint,
      returnToken: navigationContext.signedToken,
      dedupeKey: `${parsed.data.storeId}:${parsed.data.preferredWindow}:${parsed.data.navigationContext.sourceSurface}`
    }
  });

  return NextResponse.json({
    bookingSession: {
      ...session,
      id: persistedSession.id,
      returnToken: navigationContext.signedToken
    },
    lineLaunch: {
      type: "official_line_reservation_core",
      message: `【LocaGoX】${store.name} / ${parsed.data.menuHint} / 希望 ${parsed.data.preferredWindow} / ETA 約${parsed.data.etaMinutes}分`,
      returnToken: navigationContext.signedToken
    },
    nextAction: "launch_official_line"
  });
}
