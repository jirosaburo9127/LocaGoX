"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { HeartIcon } from "@/app/components/public-icons";

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

function writeFavorites(next: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("locagox:favorites-changed", { detail: next }));
}

export function FavoriteButton({
  storeId,
  storeName,
  className = ""
}: {
  storeId: string;
  storeName: string;
  className?: string;
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const sync = () => {
      setLiked(readFavorites().includes(storeId));
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("locagox:favorites-changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("locagox:favorites-changed", sync as EventListener);
    };
  }, [storeId]);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const current = readFavorites();
    const next = current.includes(storeId)
      ? current.filter((id) => id !== storeId)
      : [...current, storeId];

    writeFavorites(next);
    setLiked(next.includes(storeId));
  }

  return (
    <button
      aria-label={liked ? `${storeName} をいいね解除` : `${storeName} をいいね`}
      aria-pressed={liked}
      className={`favorite-button${liked ? " is-liked" : ""}${className ? ` ${className}` : ""}`}
      onClick={toggle}
      type="button"
    >
      <HeartIcon className="favorite-button-icon" />
      <span>{liked ? "保存済み" : "いいね"}</span>
    </button>
  );
}
