"use client";

import { useState } from "react";
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

  return (
    <>
      {/* Swipe deck is always first, scrollable past */}
      {swipeStores.length > 0 && <SwipeDeck stores={swipeStores} />}

      {/* Netflix rows always below */}
      {children}

      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
