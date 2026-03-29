"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type SwipeStore = {
  slug: string;
  name: string;
  area: string;
  category: string;
  walkMinutes: number;
  waitMinutes: number;
  lastOrderAt: string;
  isOpen: boolean;
  imgIndex: number;
  benefitTags: string[];
};

const SWIPE_THRESHOLD = 80;
const TAP_THRESHOLD = 8;

export function SwipeDeck({ stores }: { stores: SwipeStore[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const [entering, setEntering] = useState(false);
  const startRef = useRef({ x: 0, y: 0, t: 0 });
  const moved = useRef(false);

  const current = stores[index];
  const next1 = stores[index + 1];
  const next2 = stores[index + 2];
  const finished = index >= stores.length;

  const advance = useCallback((dir: "left" | "right") => {
    setExiting(dir);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setExiting(null);
      setOffset({ x: 0, y: 0 });
      // Trigger enter animation for new card
      setEntering(true);
      setTimeout(() => setEntering(false), 50);
    }, 250);
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (exiting) return;
    setDragging(true);
    moved.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging || exiting) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      moved.current = true;
    }
    // Only horizontal swipe
    setOffset({ x: dx, y: 0 });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    // Tap → go to detail
    if (!moved.current && current) {
      router.push(`/stores/${current.slug}`);
      return;
    }

    if (offset.x < -SWIPE_THRESHOLD) {
      advance("left");
    } else if (offset.x > SWIPE_THRESHOLD) {
      advance("right");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === "ArrowRight") advance("right");
      if (e.key === "ArrowLeft") advance("left");
      if (e.key === "Enter" && current) router.push(`/stores/${current.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, current, finished, router]);

  if (finished || !current) {
    return (
      <div className="sd-done">
        <p>{stores.length}件すべてチェック済み</p>
      </div>
    );
  }

  const rotation = offset.x * 0.06;
  const rightOpacity = Math.min(Math.max(offset.x, 0) / SWIPE_THRESHOLD, 1);
  const leftOpacity = Math.min(Math.max(-offset.x, 0) / SWIPE_THRESHOLD, 1);

  const exitX = exiting === "right" ? "110vw" : exiting === "left" ? "-110vw" : "0";

  return (
    <div className="sd-section">
      <div className="sd-header">
        <p className="sd-header-sub">← 次へ ・ タップで詳細 ・ 保存 →</p>
      </div>
    <div className="sd-container">
      {/* Progress segments */}
      <div className="sd-segments">
        {stores.map((_, i) => (
          <div className={`sd-segment${i < index ? " sd-segment--done" : i === index ? " sd-segment--active" : ""}`} key={i} />
        ))}
      </div>

      {/* Background cards */}
      {next2 && (
        <div className="sd-card sd-card--bg" style={{ transform: "scale(0.9) translateY(16px)", zIndex: 8 }}>
          <img alt="" className="sd-card-img" src={`/stores/store-${(next2.imgIndex % 10) + 1}.jpg`} />
          <div className="sd-card-gradient" />
        </div>
      )}
      {next1 && (
        <div className="sd-card sd-card--bg" style={{ transform: "scale(0.95) translateY(8px)", zIndex: 9 }}>
          <img alt="" className="sd-card-img" src={`/stores/store-${(next1.imgIndex % 10) + 1}.jpg`} />
          <div className="sd-card-gradient" />
        </div>
      )}

      {/* Active card */}
      <div
        className={`sd-card sd-card--active${entering ? " sd-card--entering" : ""}`}
        key={current.slug}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: exiting
            ? `translateX(${exitX}) rotate(${exiting === "right" ? 15 : -15}deg)`
            : `translateX(${offset.x}px) rotate(${rotation}deg)`,
          transition: dragging ? "none" : "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 20,
          cursor: dragging ? "grabbing" : "pointer",
          touchAction: "pan-y"
        }}
      >
        <img alt="" className="sd-card-img" src={`/stores/store-${(current.imgIndex % 10) + 1}.jpg`} draggable={false} />
        <div className="sd-card-gradient" />

        {/* Swipe feedback overlays */}
        <div className="sd-feedback sd-feedback--next" style={{ opacity: leftOpacity }}>
          <span>次へ</span>
        </div>
        <div className="sd-feedback sd-feedback--save" style={{ opacity: rightOpacity }}>
          <span>保存</span>
        </div>

        {/* Card content */}
        <div className="sd-card-info">
          <div className="sd-card-top">
            <span className="sd-badge">{current.area}</span>
            <span className="sd-badge">{current.category}</span>
            {current.isOpen && <span className="sd-badge sd-badge--open">営業中</span>}
          </div>
          <h2 className="sd-card-name">{current.name}</h2>
          <div className="sd-card-meta">
            <span>🚶 {current.walkMinutes}分</span>
            <span>⏱ 待ち{current.waitMinutes}分</span>
            <span>〜{current.lastOrderAt}</span>
          </div>
          <div className="sd-card-tags">
            {current.benefitTags.slice(0, 3).map((tag) => (
              <span className="sd-tag" key={tag}>{tag}</span>
            ))}
          </div>
          {/* Tap hint */}
          <div className="sd-tap-hint">タップで詳細を見る</div>
        </div>
      </div>

      {/* Action buttons with labels */}
      <div className="sd-actions">
        <button className="sd-action sd-action--next" onClick={() => advance("left")} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          <span>次へ</span>
        </button>
        <button className="sd-action sd-action--detail" onClick={() => router.push(`/stores/${current.slug}`)} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>詳細</span>
        </button>
        <button className="sd-action sd-action--save" onClick={() => advance("right")} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>保存</span>
        </button>
      </div>

    </div>
    </div>
  );
}
