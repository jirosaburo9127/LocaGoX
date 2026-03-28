"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookmarkIcon, ClockIcon, PinIcon } from "@/app/components/public-icons";

type FavoriteStore = {
  id: string;
  slug: string;
  name: string;
  area: string;
  walkMinutes: number;
  waitMinutes: number;
  badgeLabel: string;
};

const STORAGE_KEY = "locagox-favorites";

function readFavorites() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesRail({ stores }: { stores: FavoriteStore[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("locagox:favorites-changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("locagox:favorites-changed", sync as EventListener);
    };
  }, []);

  const favoriteStores = useMemo(
    () => stores.filter((store) => favoriteIds.includes(store.id)),
    [favoriteIds, stores]
  );

  if (favoriteStores.length === 0) {
    return null;
  }

  return (
    <section className="public-section public-section-favorites" id="favorites">
      <div className="public-section-head">
        <div>
          <span className="public-kicker">Favorites</span>
          <h2 className="section-title">いいねしたお店</h2>
          <p className="public-section-copy">保存したお店をまとめて確認。</p>
        </div>
      </div>
      <div className="favorite-mini-grid favorite-mini-grid-mobile-rail">
        {favoriteStores.map((store) => (
          <Link className="favorite-mini-card" href={`/stores/${store.slug}?source=home.discovery_shelf&shelf=favorites&scroll=0`} key={store.id}>
            <div className="favorite-mini-top">
              <span className="favorite-mini-icon"><BookmarkIcon /></span>
              <span className="public-pill">{store.badgeLabel}</span>
            </div>
            <strong>{store.name}</strong>
            <div className="favorite-mini-meta">
              <span><PinIcon />{store.area}</span>
              <span><ClockIcon />徒歩 {store.walkMinutes}分</span>
              <span><ClockIcon />待ち {store.waitMinutes}分</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
