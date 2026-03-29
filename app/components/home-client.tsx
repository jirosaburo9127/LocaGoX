"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BottomNav } from "./bottom-nav";
import { SearchOverlay } from "./search-overlay";
import { RecentlyViewedRow } from "./recently-viewed";
import { SwipeDeck } from "./swipe-deck";

type SearchStore = {
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  isOpen: boolean;
  imgIndex: number;
};

type SwipeStore = SearchStore & {
  waitMinutes: number;
  lastOrderAt: string;
  benefitTags: string[];
};

export function HomeClientShell({
  stores,
  swipeStores,
  children
}: {
  stores: SearchStore[];
  swipeStores: SwipeStore[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("すべて");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [locating, setLocating] = useState(false);

  // Unique areas & categories from data
  const areas = useMemo(() => {
    const set = new Set(swipeStores.map((s) => s.area));
    return ["すべて", ...Array.from(set).sort()];
  }, [swipeStores]);

  const categories = useMemo(() => {
    const set = new Set(swipeStores.map((s) => s.category));
    return ["すべて", ...Array.from(set).sort()];
  }, [swipeStores]);

  // Filter stores
  const filtered = useMemo(() => {
    return swipeStores.filter((s) => {
      if (selectedArea !== "すべて" && s.area !== selectedArea) return false;
      if (selectedCategory !== "すべて" && s.category !== selectedCategory) return false;
      return true;
    });
  }, [swipeStores, selectedArea, selectedCategory]);

  // Simulate geolocation → pick nearest area
  const useLocation = useCallback(() => {
    setLocating(true);
    // Simulate: pick "恵比寿" as nearest after a short delay
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In demo, always resolve to 恵比寿
          setSelectedArea("恵比寿");
          setLocating(false);
        },
        () => {
          setSelectedArea("恵比寿");
          setLocating(false);
        },
        { timeout: 3000 }
      );
    } else {
      setSelectedArea("恵比寿");
      setLocating(false);
    }
  }, []);

  return (
    <>
      {/* Filter bar */}
      <div className="fb-container">
        <div className="fb-row">
          {/* Area selector */}
          <div className="fb-group">
            <label className="fb-label">エリア</label>
            <div className="fb-select-row">
              <select
                className="fb-select"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button
                className="fb-location-btn"
                onClick={useLocation}
                disabled={locating}
                type="button"
              >
                {locating ? (
                  <span className="fb-spinner" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Category selector */}
          <div className="fb-group">
            <label className="fb-label">カテゴリ</label>
            <select
              className="fb-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="fb-result">
          {filtered.length > 0 ? (
            <span>{filtered.length}件のお店が見つかりました</span>
          ) : (
            <span>条件に合うお店がありません</span>
          )}
        </div>
      </div>

      {/* Swipe deck with filtered stores */}
      {filtered.length > 0 && (
        <SwipeDeck stores={filtered} key={`${selectedArea}-${selectedCategory}`} />
      )}

      {/* Netflix rows always below */}
      {children}

      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
