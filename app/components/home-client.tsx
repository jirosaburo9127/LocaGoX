"use client";

import { useMemo, useState } from "react";
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

type CategoryInfo = {
  name: string;
  icon: string;
  count: number;
};

const CATEGORY_ICONS: Record<string, string> = {
  "ヘッドスパ": "💆",
  "整体": "🦴",
  "マッサージ": "💪",
  "リラクゼーション": "🧘",
  "エステ": "✨",
  "美容室": "💇",
  "ネイル": "💅",
  "ネイルサロン": "💅",
  "ヨガ": "🧘‍♀️",
  "ヨガスタジオ": "🧘‍♀️",
  "パーソナルジム": "🏋️",
  "鍼灸": "📍",
  "居酒屋": "🍶",
  "焼肉": "🥩",
  "イタリアン": "🍝",
  "フレンチ": "🇫🇷",
  "カフェ": "☕",
  "ラーメン": "🍜",
  "寿司": "🍣",
  "スイーツ": "🍰",
  "カレー": "🍛",
};

function CategoryPicker({
  categories,
  onSelect
}: {
  categories: CategoryInfo[];
  onSelect: (category: string | null) => void;
}) {
  return (
    <div className="cp-container">
      <div className="cp-header">
        <h1 className="cp-title">何を探していますか？</h1>
        <p className="cp-sub">カテゴリを選んでスワイプで探す</p>
      </div>
      <div className="cp-grid">
        {categories.map((cat) => (
          <button
            className="cp-card"
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            type="button"
          >
            <span className="cp-icon">{cat.icon}</span>
            <span className="cp-name">{cat.name}</span>
            <span className="cp-count">{cat.count}件</span>
          </button>
        ))}
      </div>
      <button className="cp-all" onClick={() => onSelect(null)} type="button">
        すべてのお店を見る
      </button>
    </div>
  );
}

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
  const [selectedCategory, setSelectedCategory] = useState<string | null | undefined>(undefined);

  // Build category list from all swipe stores
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of swipeStores) {
      map.set(s.category, (map.get(s.category) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        icon: CATEGORY_ICONS[name] ?? "🏪",
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [swipeStores]);

  // Filter swipe stores by selected category
  const filteredStores = useMemo(() => {
    if (selectedCategory === null) return swipeStores;
    if (selectedCategory === undefined) return [];
    return swipeStores.filter((s) => s.category === selectedCategory);
  }, [swipeStores, selectedCategory]);

  const showPicker = selectedCategory === undefined;

  return (
    <>
      {showPicker ? (
        <CategoryPicker categories={categories} onSelect={setSelectedCategory} />
      ) : (
        <>
          {/* Category label + back button */}
          <div className="sd-cat-bar">
            <button className="sd-cat-back" onClick={() => setSelectedCategory(undefined)} type="button">
              ← カテゴリ
            </button>
            <span className="sd-cat-label">
              {selectedCategory ?? "すべて"} ({filteredStores.length}件)
            </span>
          </div>
          {filteredStores.length > 0 && <SwipeDeck stores={filteredStores} key={selectedCategory ?? "all"} />}
        </>
      )}

      {/* Netflix rows always below */}
      {children}

      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
