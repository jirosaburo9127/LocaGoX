"use client";

import { useState } from "react";
import { BottomNav } from "./bottom-nav";
import { SearchOverlay } from "./search-overlay";
import { RecentlyViewedRow } from "./recently-viewed";

type SearchStore = {
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  isOpen: boolean;
  imgIndex: number;
};

export function HomeClientShell({
  stores,
  children
}: {
  stores: SearchStore[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {children}
      <RecentlyViewedRow />
      <BottomNav onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay stores={stores} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
