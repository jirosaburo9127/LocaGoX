"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "locagox-recently-viewed";

type ViewedStore = {
  slug: string;
  name: string;
  area: string;
  imgIndex: number;
  timestamp: number;
};

function readRecent(): ViewedStore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ViewedStore[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(store: { slug: string; name: string; area: string; imgIndex: number }) {
  if (typeof window === "undefined") return;
  const list = readRecent().filter((s) => s.slug !== store.slug);
  list.unshift({ ...store, timestamp: Date.now() });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
}

export function RecentlyViewedRow() {
  const [stores, setStores] = useState<ViewedStore[]>([]);

  useEffect(() => {
    setStores(readRecent());
  }, []);

  if (stores.length === 0) return null;

  return (
    <section className="nf-row">
      <h2 className="nf-row-title">最近チェックしたお店</h2>
      <div className="nf-row-track">
        {stores.map((store) => (
          <Link className="nf-card" href={`/stores/${store.slug}`} key={store.slug}>
            <img alt="" className="nf-card-img" src={`/stores/store-${(store.imgIndex % 10) + 1}.jpg`} />
            <div className="nf-card-gradient" />
            <strong className="nf-card-name">{store.name}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
