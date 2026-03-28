"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchStore = {
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  isOpen: boolean;
  imgIndex: number;
};

export function SearchOverlay({
  stores,
  isOpen,
  onClose
}: {
  stores: SearchStore[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return stores.filter(
      (s) => s.name.toLowerCase().includes(q) || s.area.includes(q) || s.category.includes(q)
    ).slice(0, 20);
  }, [query, stores]);

  if (!isOpen) return null;

  return (
    <div className="nf-search-overlay">
      <div className="nf-search-header">
        <input
          ref={inputRef}
          className="nf-search-input"
          placeholder="店名・エリア・カテゴリで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
        />
        <button className="nf-search-close" onClick={onClose} type="button">
          キャンセル
        </button>
      </div>
      {query.trim() && results.length === 0 && (
        <p className="nf-search-empty">「{query}」に一致するお店が見つかりません</p>
      )}
      <div className="nf-search-results">
        {results.map((store) => (
          <Link
            className="nf-search-item"
            href={`/stores/${store.slug}`}
            key={store.slug}
            onClick={onClose}
          >
            <img alt="" className="nf-search-thumb" src={`/stores/store-${(store.imgIndex % 10) + 1}.jpg`} />
            <div className="nf-search-info">
              <strong>{store.name}</strong>
              <span>{store.area} ・ {store.category}</span>
              <span className={store.isOpen ? "nf-search-open" : ""}>{store.isOpen ? `徒歩${store.walkMinutes}分 ・ 営業中` : "準備中"}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
