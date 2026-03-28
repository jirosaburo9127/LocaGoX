import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3002";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function requestJson(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  let json;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  return {
    status: response.status,
    json
  };
}

async function createSession(storeId, preferredWindow, sourceSurface = "home.hero") {
  const params = new URLSearchParams({
    storeId,
    preferredWindow,
    etaMinutes: "8",
    menuHint: "QA smoke menu",
    sourceSurface,
    shelfId: "reservation-near-open",
    scrollY: "0",
    locationLabel: "渋谷区恵比寿西 1-9 付近",
    filters: "当日OK,駅近"
  });

  return requestJson(`/api/booking-sessions?${params.toString()}`);
}

async function run() {
  const targetStore = await prisma.store.findFirst({
    where: {
      isOpen: true,
      NOT: {
        reliabilityState: "manual_only"
      }
    },
    orderBy: {
      reservationRank: "asc"
    }
  });

  assert(targetStore, "QA対象の受付可能な店舗が見つかりません。");

  const manualOnlyStore = await prisma.store.findFirst({
    where: {
      reliabilityState: "manual_only"
    },
    orderBy: {
      reservationRank: "asc"
    }
  });

  const suffix = Date.now().toString().slice(-6);
  const acceptedWindow = `QA-${suffix}-accepted`;
  const conflictWindow = `QA-${suffix}-conflict`;
  const callbackEventId = `evt_qa_${suffix}`;
  const conflictCallbackEventId = `evt_qa_conflict_${suffix}`;

  const createAccepted = await createSession(targetStore.id, acceptedWindow, "home.hero");
  assert(createAccepted.status === 200, `session作成に失敗: ${JSON.stringify(createAccepted.json)}`);
  assert(createAccepted.json?.bookingSession?.id, "bookingSession.id が返ってきませんでした。");

  const acceptedSessionId = createAccepted.json.bookingSession.id;

  const acceptedCallback = await requestJson("/api/integrations/line/status-callback", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      destination: "Uqa",
      events: [
        {
          webhookEventId: callbackEventId,
          type: "postback",
          timestamp: Date.now(),
          postback: {
            data: new URLSearchParams({
              bookingSessionId: acceptedSessionId,
              status: "accepted",
              reasonCode: "qa_smoke_accepted"
            }).toString()
          }
        }
      ]
    })
  });

  assert(acceptedCallback.status === 200, `accepted callback失敗: ${JSON.stringify(acceptedCallback.json)}`);
  assert(acceptedCallback.json?.results?.[0]?.state === "accepted", "accepted callback の state が想定どおりではありません。");

  const duplicateCallback = await requestJson("/api/integrations/line/status-callback", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      destination: "Uqa",
      events: [
        {
          webhookEventId: callbackEventId,
          type: "postback",
          timestamp: Date.now(),
          postback: {
            data: new URLSearchParams({
              bookingSessionId: acceptedSessionId,
              status: "accepted",
              reasonCode: "qa_smoke_duplicate"
            }).toString()
          }
        }
      ]
    })
  });

  assert(duplicateCallback.status === 200, `duplicate callback失敗: ${JSON.stringify(duplicateCallback.json)}`);
  assert(duplicateCallback.json?.results?.[0]?.duplicate === true, "duplicate callback が duplicate 扱いになっていません。");

  const createConflict = await createSession(targetStore.id, conflictWindow, "home.discovery_shelf");
  assert(createConflict.status === 200, `conflict用 session作成に失敗: ${JSON.stringify(createConflict.json)}`);
  const conflictSessionId = createConflict.json.bookingSession.id;

  const manualOutcome = await requestJson(`/api/booking-sessions/${conflictSessionId}/outcomes`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      nextState: "full",
      source: "manual_fallback",
      reasonCode: "qa_smoke_manual_full"
    })
  });

  assert(manualOutcome.status === 200, `manual outcome失敗: ${JSON.stringify(manualOutcome.json)}`);

  const conflictCallback = await requestJson("/api/integrations/line/status-callback", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      destination: "Uqa",
      events: [
        {
          webhookEventId: conflictCallbackEventId,
          type: "postback",
          timestamp: Date.now(),
          postback: {
            data: new URLSearchParams({
              bookingSessionId: conflictSessionId,
              status: "accepted",
              reasonCode: "qa_smoke_conflict"
            }).toString()
          }
        }
      ]
    })
  });

  assert(conflictCallback.status === 200, `conflict callback失敗: ${JSON.stringify(conflictCallback.json)}`);
  assert(
    conflictCallback.json?.results?.[0]?.state === "review_required",
    "manual fallback と callback の競合が review_required になっていません。"
  );

  const queuedReview = await prisma.reviewQueueItem.findFirst({
    where: {
      bookingSessionId: conflictSessionId,
      status: "open"
    }
  });

  assert(queuedReview, "review queue item が作成されていません。");

  if (manualOnlyStore) {
    const blocked = await createSession(manualOnlyStore.id, `QA-${suffix}-blocked`, "direct_entry");
    assert(blocked.status === 409, `manual_only fallback が 409 ではありません: ${JSON.stringify(blocked.json)}`);
    assert(blocked.json?.fallback?.type === "detail_only", "manual_only fallback の型が想定どおりではありません。");
  }

  const updatedStore = await prisma.store.findUnique({
    where: {
      id: targetStore.id
    },
    select: {
      reliabilityState: true,
      reliabilityReason: true,
      reliabilityMode: true
    }
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        baseUrl,
        scenarios: {
          acceptedFlow: true,
          duplicateCallback: true,
          conflictQueue: true,
          manualOnlyFallback: Boolean(manualOnlyStore)
        },
        storeReliability: updatedStore
      },
      null,
      2
    )
  );
}

run()
  .catch((error) => {
    console.error(
      JSON.stringify(
        {
          ok: false,
          baseUrl,
          error: error instanceof Error ? error.message : String(error)
        },
        null,
        2
      )
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
