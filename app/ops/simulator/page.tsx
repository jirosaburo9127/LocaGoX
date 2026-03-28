import Link from "next/link";
import { db } from "@/lib/db";
import { isMockModeEnabled } from "@/lib/mock-mode";
import { SimulatorClient } from "./simulator-client";

export default async function SimulatorPage() {
  if (isMockModeEnabled()) {
    return (
      <main className="page-shell">
        <section className="panel" style={{ maxWidth: 860, margin: "40px auto" }}>
          <span className="eyebrow">Mock Preview</span>
          <h1 className="section-title">Ops Simulator はモックモードでは停止中です</h1>
          <p className="muted">
            Preview では公開UIを優先しているため、booking_session と callback の検証面は非表示にしています。
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

  const stores = await db.store.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      reservationRank: "asc"
    }
  });

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="address-bar">
          <div>
            <div className="caption">Ops Simulator</div>
            <strong>booking_session と LINE callback の検証</strong>
          </div>
          <div className="pill-row">
            <span className="status-pill">manual test harness</span>
            <span className="status-pill">no curl required</span>
          </div>
        </div>
        <div className="pill-row">
          <Link className="link-chip" href="/ops/review-queue">
            Review Queue
          </Link>
          <Link className="link-chip" href="/store-board">
            Store Board
          </Link>
          <Link className="link-chip" href="/ops/line-setup">
            LINE Setup
          </Link>
          <form action="/api/access/logout" method="post">
            <button className="link-chip" type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>

      <SimulatorClient
        stores={stores.map((store) => ({
          id: store.id,
          name: store.name
        }))}
      />
    </main>
  );
}
