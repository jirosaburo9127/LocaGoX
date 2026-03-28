import Link from "next/link";
import { isMockModeEnabled } from "@/lib/mock-mode";
import { getReviewQueueView } from "@/lib/review-queue";

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

export default async function ReviewQueuePage() {
  if (isMockModeEnabled()) {
    return (
      <main className="page-shell">
        <section className="panel" style={{ maxWidth: 860, margin: "40px auto" }}>
          <span className="eyebrow">Mock Preview</span>
          <h1 className="section-title">Review Queue はモックモードでは停止中です</h1>
          <p className="muted">
            Preview では公開面の確認を優先しているため、競合解決キューは Supabase 接続時のみ有効です。
          </p>
          <div className="pill-row" style={{ marginTop: 16 }}>
            <Link className="link-chip" href="/">
              公開Homeへ戻る
            </Link>
            <Link className="link-chip" href="/ops/line-setup">
              LINE Setup を見る
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const items = await getReviewQueueView();

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="address-bar">
          <div>
            <div className="caption">Ops Review Queue</div>
            <strong>競合 payload と manual fallback 競合の解決</strong>
          </div>
          <div className="pill-row">
            <span className="status-pill">open items: {items.length}</span>
            <span className="status-pill">human resolution</span>
          </div>
        </div>
        <div className="pill-row">
          <Link className="link-chip" href="/store-board">
            Store Board
          </Link>
          <Link className="link-chip" href="/ops/simulator">
            Simulator
          </Link>
          <Link className="link-chip" href="/ops/line-setup">
            LINE Setup
          </Link>
          <Link className="link-chip" href="/">
            Home
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
          <span className="eyebrow">Queue Rules</span>
          <h2 className="section-title">silent success を作らない</h2>
          <div className="timeline">
            <div className="timeline-step">
              <strong>Conflict first</strong>
              <span className="muted">callback と manual fallback が競合したら自動確定せず queue に送ります。</span>
            </div>
            <div className="timeline-step">
              <strong>Ops resolution</strong>
              <span className="muted">最終 state は ops が確定し、台帳と audit を同時更新します。</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">Release Guard</span>
          <h2 className="section-title">review_required を放置しない</h2>
          <p className="muted">
            same-day 導線で review_required が積み上がると成立率と整合性の両方に効くので、この面は blocker 対応に近い位置づけです。
          </p>
        </div>
      </section>

      <section>
        <h2 className="section-title">Open Queue</h2>
        <div className="timeline">
          {items.length === 0 ? (
            <article className="panel">
              <span className="eyebrow">No Open Items</span>
              <p className="muted">いまは review_required の未解決案件はありません。</p>
            </article>
          ) : null}

          {items.map((item) => (
            <article className="panel" key={item.id}>
              <div className="pill-row" style={{ marginBottom: 12 }}>
                <span className="pill">{item.storeName}</span>
                <span className="pill">session: {item.sessionState}</span>
                <span className="pill">source: {item.sourceSurface}</span>
                <span className="pill">作成 {formatTime(item.createdAt)}</span>
              </div>
              <p className="muted">
                Queue ID: {item.id} / Booking Session: {item.bookingSessionId} / 理由: {item.reasonCode}
              </p>

              <form action="/api/ops/review-queue/resolve" method="post">
                <input name="reviewQueueItemId" type="hidden" value={item.id} />
                <input name="bookingSessionId" type="hidden" value={item.bookingSessionId} />
                <div className="form-grid">
                  <label className="form-field">
                    <span>resolved state</span>
                    <select defaultValue="accepted" name="resolvedState">
                      <option value="accepted">accepted</option>
                      <option value="alternate_time_proposed">alternate_time_proposed</option>
                      <option value="full">full</option>
                      <option value="timeout">timeout</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </label>
                  <label className="form-field">
                    <span>resolution note</span>
                    <input defaultValue={item.reasonCode} name="resolutionNote" type="text" />
                  </label>
                </div>
                <button className="cta-primary" type="submit">
                  queueを解決
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
