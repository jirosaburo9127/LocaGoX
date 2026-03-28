import Link from "next/link";
import { formatReliabilityReason, getStoreBoardView } from "@/lib/store-board";

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

export default async function StoreBoardPage() {
  const board = await getStoreBoardView();

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="address-bar">
          <div>
            <div className="caption">Store Board</div>
            <strong>same-day 更新と manual fallback</strong>
          </div>
          <div className="pill-row">
            <span className="status-pill">1タップ更新</span>
            <span className="status-pill">manual outcome</span>
          </div>
        </div>
        <div className="pill-row">
          <Link className="link-chip" href="/">
            Homeへ戻る
          </Link>
          <Link className="link-chip" href="/ops/review-queue">
            Review Queue
          </Link>
          <Link className="link-chip" href="/ops/line-setup">
            LINE Setup
          </Link>
          <Link className="link-chip" href="/ops/simulator">
            Simulator
          </Link>
          <form action="/api/access/logout" method="post">
            <button className="link-chip" type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>

      <section className="grid-two" style={{ marginBottom: 24 }}>
        <div className="panel">
          <span className="eyebrow">Board Rules</span>
          <h2 className="section-title">店舗が変えるのは業務状態だけ</h2>
          <div className="timeline">
            <div className="timeline-step">
              <strong>same-day受付</strong>
              <span className="muted">営業状態、待ち時間、次回案内時刻を短く更新します。</span>
            </div>
            <div className="timeline-step">
              <strong>manual fallback</strong>
              <span className="muted">callback 不達時だけ outcome を手で入れ、台帳と audit を同時更新します。</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">Ops Split</span>
          <h2 className="section-title">source of truth</h2>
          <div className="timeline">
            <div className="timeline-step">
              <strong>LINE</strong>
              <span className="muted">transport と callback</span>
            </div>
            <div className="timeline-step">
              <strong>LocaGoX</strong>
              <span className="muted">booking_session / outcome / audit</span>
            </div>
            <div className="timeline-step">
              <strong>Store Board</strong>
              <span className="muted">accepted / alt / full / wait 更新</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 className="section-title">店舗ステータス更新</h2>
        <div className="shelf-grid">
          {board.stores.map((store) => (
            <article className="card" key={store.id}>
              <span className="eyebrow">
                {store.area} / {store.category}
              </span>
              <h3>{store.name}</h3>
              <div className="pill-row">
                <span className="pill">受付 {store.acceptingSameDay ? "ON" : "OFF"}</span>
                <span className="pill">待ち {store.waitMinutes}分</span>
                <span className="pill">次回 {store.nextAvailableWindow ?? "-"}</span>
                <span className="pill">品質 {store.reliabilityState}</span>
                <span className="pill">mode {store.reliabilityMode}</span>
              </div>
              <p className="muted">
                最終更新 {formatTime(store.updatedAt)}
                {store.note ? ` / ${store.note}` : ""}
              </p>
              <p className="muted">
                品質理由 {formatReliabilityReason(store.reliabilityReason)}
                {store.reliabilityUpdatedAt ? ` / 判定 ${formatTime(store.reliabilityUpdatedAt)}` : ""}
              </p>
              {store.reliabilityEvidence ? (
                <div className="pill-row" style={{ marginBottom: 14 }}>
                  <span className="pill">outcomes {store.reliabilityEvidence.totalOutcomes ?? 0}</span>
                  <span className="pill">accepted {store.reliabilityEvidence.acceptedCount ?? 0}</span>
                  <span className="pill">blocked {store.reliabilityEvidence.blockedCount ?? 0}</span>
                  <span className="pill">review open {store.reliabilityEvidence.reviewOpenCount ?? 0}</span>
                </div>
              ) : null}
              <form action="/api/store-board/status" method="post">
                <input name="storeId" type="hidden" value={store.id} />
                <div className="form-grid">
                  <label className="form-field">
                    <span>same-day受付</span>
                    <select defaultValue={store.acceptingSameDay ? "true" : "false"} name="acceptingSameDay">
                      <option value="true">受付中</option>
                      <option value="false">停止</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>待ち時間</span>
                    <input defaultValue={store.waitMinutes} min="0" name="waitMinutes" type="number" />
                  </label>
                  <label className="form-field">
                    <span>次回案内</span>
                    <input defaultValue={store.nextAvailableWindow ?? ""} name="nextAvailableWindow" type="text" />
                  </label>
                  <label className="form-field">
                    <span>メモ</span>
                    <input defaultValue={store.note ?? ""} name="note" type="text" />
                  </label>
                  <label className="form-field">
                    <span>品質モード</span>
                    <select defaultValue={store.reliabilityMode} name="reliabilityMode">
                      <option value="auto">auto</option>
                      <option value="manual_override">manual_override</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>品質状態</span>
                    <select defaultValue={store.reliabilityState} name="reliabilityState">
                      <option value="healthy">healthy</option>
                      <option value="caution">caution</option>
                      <option value="manual_only">manual_only</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>返信SLAメモ</span>
                    <input defaultValue={store.replySlaSnapshot ?? ""} name="replySlaSnapshot" type="text" />
                  </label>
                </div>
                <button className="cta-primary" type="submit">
                  スナップショット更新
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">manual fallback</h2>
        <div className="timeline">
          {board.sessions.map((session) => (
            <article className="panel" key={session.id}>
              <div className="pill-row" style={{ marginBottom: 12 }}>
                <span className="pill">{session.storeName}</span>
                <span className="pill">state: {session.state}</span>
                <span className="pill">source: {session.sourceSurface}</span>
                <span className="pill">作成 {formatTime(session.createdAt)}</span>
              </div>
              <p className="muted">
                Session ID: {session.id}
                {session.menuHint ? ` / ${session.menuHint}` : ""}
                {` / 希望 ${session.preferredWindow}`}
              </p>
              <form action="/api/store-board/outcomes/manual" method="post">
                <input name="bookingSessionId" type="hidden" value={session.id} />
                <div className="form-grid">
                  <label className="form-field">
                    <span>manual outcome</span>
                    <select defaultValue="accepted" name="nextState">
                      <option value="accepted">accepted</option>
                      <option value="alternate_time_proposed">alternate_time_proposed</option>
                      <option value="full">full</option>
                      <option value="timeout">timeout</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>reason code</span>
                    <input defaultValue="store_manual_update" name="reasonCode" type="text" />
                  </label>
                </div>
                <button className="cta-secondary" type="submit">
                  outcomeを記録
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
