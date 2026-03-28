"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FavoriteButton } from "./favorite-button";

type HeroStore = {
  id: string;
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  waitMinutes: number;
  lastOrderAt: string;
  imgIndex: number;
};

export function BillboardCarousel({ stores }: { stores: HeroStore[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % stores.length);
  }, [stores.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, paused]);

  const store = stores[current];
  const img = `/stores/store-${(store.imgIndex % 10) + 1}.jpg`;
  const heroHref = `/stores/${store.slug}?source=home.hero`;

  return (
    <section
      className="nf-billboard"
      id="billboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {stores.map((s, i) => (
        <img
          alt=""
          className={`nf-billboard-bg${i === current ? " is-active" : ""}`}
          key={s.id}
          src={`/stores/store-${(s.imgIndex % 10) + 1}.jpg`}
        />
      ))}
      <div className="nf-billboard-overlay" />
      <FavoriteButton className="nf-billboard-fav" storeId={store.id} storeName={store.name} />
      <div className="nf-billboard-body">
        <span className="nf-billboard-badge">Today&apos;s Pick</span>
        <h1 className="nf-billboard-title" key={store.id}>{store.name}</h1>
        <p className="nf-billboard-sub">{store.area} ・ {store.category}</p>
        <div className="nf-billboard-meta">
          <span>営業中</span>
          <span>徒歩{store.walkMinutes}分</span>
          <span>待ち{store.waitMinutes}分</span>
          <span>〜{store.lastOrderAt}</span>
        </div>
        <div className="nf-billboard-cta">
          <Link className="nf-btn-primary" href={heroHref}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            詳細を見る
          </Link>
          <Link className="nf-btn-secondary" href="#near">
            他の候補
          </Link>
        </div>
        {/* Dots */}
        <div className="nf-billboard-dots">
          {stores.map((s, i) => (
            <button
              className={`nf-billboard-dot${i === current ? " is-active" : ""}`}
              key={s.id}
              onClick={() => setCurrent(i)}
              type="button"
              aria-label={`${i + 1}番目のおすすめ`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
