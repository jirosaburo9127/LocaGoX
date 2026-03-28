import Link from "next/link";
import { db } from "@/lib/db";
import { SimulatorClient } from "./simulator-client";

export default async function SimulatorPage() {
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
