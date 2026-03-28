"use client";

import { useState } from "react";

type StoreOption = {
  id: string;
  name: string;
};

type SessionResponse = {
  bookingSession: {
    id: string;
    state: string;
    returnToken: string;
  };
  lineLaunch: {
    message: string;
  };
};

export function SimulatorClient({ stores }: { stores: StoreOption[] }) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [bookingSessionId, setBookingSessionId] = useState("");
  const [callbackEventId, setCallbackEventId] = useState("evt_demo_001");
  const [createResult, setCreateResult] = useState<string>("");
  const [callbackResult, setCallbackResult] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function createSession() {
    setIsCreating(true);
    setCreateResult("");

    try {
      const params = new URLSearchParams({
        storeId,
        preferredWindow: "19:00-20:00",
        etaMinutes: "8",
        menuHint: "45分 頭浸浴",
        sourceSurface: "home.hero",
        shelfId: "reservation-near-open",
        scrollY: "0",
        locationLabel: "渋谷区恵比寿西 1-9 付近",
        filters: "当日OK,駅近"
      });

      const response = await fetch(`/api/booking-sessions?${params.toString()}`);
      const json = (await response.json()) as SessionResponse | { error: string };
      setCreateResult(JSON.stringify(json, null, 2));

      if ("bookingSession" in json) {
        setBookingSessionId(json.bookingSession.id);
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function sendCallback(status: string) {
    if (!bookingSessionId) {
      setCallbackResult("bookingSessionId が空です。先に session を作成してください。");
      return;
    }

    setIsSending(true);
    setCallbackResult("");

    try {
      const response = await fetch("/api/integrations/line/status-callback", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          destination: "Udemo",
          events: [
            {
              webhookEventId: callbackEventId,
              type: "postback",
              timestamp: Date.now(),
              postback: {
                data: new URLSearchParams({
                  bookingSessionId,
                  status,
                  reasonCode: `simulated_${status}`
                }).toString()
              }
            }
          ]
        })
      });

      const json = await response.json();
      setCallbackResult(JSON.stringify(json, null, 2));
      setCallbackEventId((previous) => `${previous}-next`);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="grid-two">
      <article className="panel">
        <span className="eyebrow">Step 1</span>
        <h2 className="section-title">booking_session を作る</h2>
        <div className="form-grid">
          <label className="form-field">
            <span>Store</span>
            <select onChange={(event) => setStoreId(event.target.value)} value={storeId}>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Booking Session ID</span>
            <input
              onChange={(event) => setBookingSessionId(event.target.value)}
              placeholder="作成後に自動入力"
              type="text"
              value={bookingSessionId}
            />
          </label>
        </div>
        <button className="cta-primary" disabled={isCreating || !storeId} onClick={createSession} type="button">
          {isCreating ? "作成中..." : "session 作成"}
        </button>
        <pre className="code-block">{createResult || "ここに session 作成結果が出ます。"}</pre>
      </article>

      <article className="panel">
        <span className="eyebrow">Step 2</span>
        <h2 className="section-title">LINE callback を送る</h2>
        <div className="form-grid">
          <label className="form-field">
            <span>Callback Event ID</span>
            <input onChange={(event) => setCallbackEventId(event.target.value)} type="text" value={callbackEventId} />
          </label>
          <label className="form-field">
            <span>Flow</span>
            <div className="pill-row">
              <button className="cta-secondary" disabled={isSending} onClick={() => void sendCallback("accepted")} type="button">
                accepted
              </button>
              <button
                className="cta-secondary"
                disabled={isSending}
                onClick={() => void sendCallback("alternate_time_proposed")}
                type="button"
              >
                alt
              </button>
              <button className="cta-secondary" disabled={isSending} onClick={() => void sendCallback("full")} type="button">
                full
              </button>
              <button className="cta-secondary" disabled={isSending} onClick={() => void sendCallback("timeout")} type="button">
                timeout
              </button>
            </div>
          </label>
        </div>
        <pre className="code-block">{callbackResult || "ここに callback 結果が出ます。"}</pre>
      </article>
    </section>
  );
}
