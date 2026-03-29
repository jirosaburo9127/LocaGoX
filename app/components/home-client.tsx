"use client";

import { useCallback, useState } from "react";
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
  const [swipeFinished, setSwipeFinished] = useState(false);

  const handleFinished = useCallback(() => setSwipeFinished(true), []);

  return (
    <>
      {!swipeFinished && swipeStores.length > 0 && (
        <SwipeDeck stores={swipeStores} onFinished={handleFinished} />
      )}
      {(swipeFinished || swipeStores.length === 0) && children}
      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
