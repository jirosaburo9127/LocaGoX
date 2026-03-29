"use client";

import { useCallback, useMemo, useState } from "react";
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

// area → prefecture mapping
const AREA_TO_PREF: Record<string, string> = {
  "恵比寿": "東京都", "中目黒": "東京都", "代官山": "東京都", "渋谷": "東京都",
  "広尾": "東京都", "三軒茶屋": "東京都", "自由が丘": "東京都", "学芸大学": "東京都",
  "祐天寺": "東京都", "池尻大橋": "東京都",
  "梅田": "大阪府", "心斎橋": "大阪府", "難波": "大阪府", "天王寺": "大阪府",
  "四条": "京都府", "河原町": "京都府", "祇園": "京都府",
  "栄": "愛知県", "名駅": "愛知県", "大須": "愛知県",
  "天神": "福岡県", "博多": "福岡県", "中洲": "福岡県",
  "すすきの": "北海道", "大通": "北海道", "狸小路": "北海道",
  "みなとみらい": "神奈川県", "中華街": "神奈川県", "元町": "神奈川県",
  "三宮": "兵庫県", "北野": "兵庫県",
  "国分町": "宮城県", "一番町": "宮城県",
  "本通り": "広島県", "流川": "広島県",
  "国際通り": "沖縄県", "那覇": "沖縄県",
};

// Prefecture display order
const PREF_ORDER = [
  "北海道", "宮城県", "東京都", "神奈川県", "愛知県",
  "京都府", "大阪府", "兵庫県", "広島県", "福岡県", "沖縄県"
];

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
  const [selectedPref, setSelectedPref] = useState<string>("すべて");
  const [selectedArea, setSelectedArea] = useState<string>("すべて");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [locating, setLocating] = useState(false);

  // Build prefecture → area mapping from actual data
  const prefAreas = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const s of swipeStores) {
      const pref = AREA_TO_PREF[s.area] ?? "その他";
      if (!map.has(pref)) map.set(pref, new Set());
      map.get(pref)!.add(s.area);
    }
    return map;
  }, [swipeStores]);

  // Available prefectures (ordered)
  const prefectures = useMemo(() => {
    const available = PREF_ORDER.filter((p) => prefAreas.has(p));
    return ["すべて", ...available];
  }, [prefAreas]);

  // Areas filtered by selected prefecture
  const areas = useMemo(() => {
    if (selectedPref === "すべて") {
      const all = new Set(swipeStores.map((s) => s.area));
      return ["すべて", ...Array.from(all).sort()];
    }
    const prefSet = prefAreas.get(selectedPref);
    if (!prefSet) return ["すべて"];
    return ["すべて", ...Array.from(prefSet).sort()];
  }, [swipeStores, selectedPref, prefAreas]);

  // Categories from data
  const categories = useMemo(() => {
    const set = new Set(swipeStores.map((s) => s.category));
    return ["すべて", ...Array.from(set).sort()];
  }, [swipeStores]);

  // Reset area when prefecture changes
  const handlePrefChange = useCallback((pref: string) => {
    setSelectedPref(pref);
    setSelectedArea("すべて");
  }, []);

  // Filter stores
  const filtered = useMemo(() => {
    return swipeStores.filter((s) => {
      if (selectedPref !== "すべて") {
        const storePref = AREA_TO_PREF[s.area] ?? "その他";
        if (storePref !== selectedPref) return false;
      }
      if (selectedArea !== "すべて" && s.area !== selectedArea) return false;
      if (selectedCategory !== "すべて" && s.category !== selectedCategory) return false;
      return true;
    });
  }, [swipeStores, selectedPref, selectedArea, selectedCategory]);

  // Simulate geolocation
  const useLocation = useCallback(() => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => { setSelectedPref("東京都"); setSelectedArea("恵比寿"); setLocating(false); },
        () => { setSelectedPref("東京都"); setSelectedArea("恵比寿"); setLocating(false); },
        { timeout: 3000 }
      );
    } else {
      setSelectedPref("東京都"); setSelectedArea("恵比寿"); setLocating(false);
    }
  }, []);

  return (
    <>
      {/* Filter bar */}
      <div className="fb-container">
        {/* Row 1: Prefecture + Area */}
        <div className="fb-row">
          <div className="fb-group">
            <label className="fb-label">都道府県</label>
            <select
              className="fb-select"
              value={selectedPref}
              onChange={(e) => handlePrefChange(e.target.value)}
            >
              {prefectures.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
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
                title="現在地から探す"
              >
                {locating ? (
                  <span className="fb-spinner" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category */}
        <div className="fb-row" style={{ marginTop: 6 }}>
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
          <div className="fb-group fb-result-group">
            <span className="fb-result-num">{filtered.length}</span>
            <span className="fb-result-label">件ヒット</span>
          </div>
        </div>
      </div>

      {/* Swipe deck */}
      {filtered.length > 0 ? (
        <SwipeDeck stores={filtered} key={`${selectedPref}-${selectedArea}-${selectedCategory}`} />
      ) : (
        <div className="sd-done">
          <p>条件に合うお店がありません</p>
        </div>
      )}

      {children}
      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
