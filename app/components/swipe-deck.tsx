"use client";

import Link from "next/link";
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

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export function SwipeDeck({
  stores,
  onFinished
}: {
  stores: SwipeStore[];
  onFinished: () => void;
}) {
  const [deck, setDeck] = useState(stores);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"left" | "right" | "up" | null>(null);
  const startRef = useRef({ x: 0, y: 0, t: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const current = deck[0];

  const dismiss = useCallback((dir: "left" | "right" | "up") => {
    setExiting(dir);
    setTimeout(() => {
      setDeck((prev) => {
        const next = prev.slice(1);
        if (next.length === 0) onFinished();
        return next;
      });
      setExiting(null);
      setOffset({ x: 0, y: 0 });
    }, 300);
  }, [onFinished]);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (exiting) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging || exiting) return;
    setOffset({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y
    });
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging) return;
    setDragging(false);

    const dt = Date.now() - startRef.current.t;
    const vx = Math.abs(offset.x) / dt;
    const vy = offset.y / dt;

    if (offset.x > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD && offset.x > 30) {
      dismiss("right");
    } else if (offset.x < -SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD && offset.x < -30) {
      dismiss("left");
    } else if (offset.y < -SWIPE_THRESHOLD || vy < -VELOCITY_THRESHOLD) {
      dismiss("up");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") dismiss("right");
      if (e.key === "ArrowLeft") dismiss("left");
      if (e.key === "ArrowUp") dismiss("up");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  if (!current) return null;

  const rotation = offset.x * 0.08;
  const opacity = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);
  const upOpacity = Math.min(Math.abs(Math.min(offset.y, 0)) / SWIPE_THRESHOLD, 1);

  const exitTransform =
    exiting === "right" ? "translateX(120vw) rotate(20deg)"
    : exiting === "left" ? "translateX(-120vw) rotate(-20deg)"
    : exiting === "up" ? "translateY(-120vh)"
    : undefined;

  return (
    <div className="sd-container" ref={containerRef}>
      {/* Background cards (next 2) */}
      {deck.slice(1, 3).map((store, i) => (
        <div
          className="sd-card sd-card--bg"
          key={store.slug}
          style={{
            transform: `scale(${0.95 - i * 0.03}) translateY(${(i + 1) * 8}px)`,
            zIndex: 10 - i
          }}
        >
          <img alt="" className="sd-card-img" src={`/stores/store-${(store.imgIndex % 10) + 1}.jpg`} />
          <div className="sd-card-gradient" />
        </div>
      ))}

      {/* Active card */}
      <div
        className={`sd-card sd-card--active${exiting ? " sd-card--exiting" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: exiting
            ? exitTransform
            : `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`,
          transition: dragging ? "none" : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 20,
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none"
        }}
      >
        <img
          alt=""
          className="sd-card-img"
          src={`/stores/store-${(current.imgIndex % 10) + 1}.jpg`}
          draggable={false}
        />
        <div className="sd-card-gradient" />

        {/* Swipe labels */}
        <div className="sd-label sd-label--right" style={{ opacity: offset.x > 0 ? opacity : 0 }}>
          詳細を見る
        </div>
        <div className="sd-label sd-label--left" style={{ opacity: offset.x < 0 ? opacity : 0 }}>
          スキップ
        </div>
        <div className="sd-label sd-label--up" style={{ opacity: offset.y < 0 ? upOpacity : 0 }}>
          LINE予約
        </div>

        {/* Card info */}
        <div className="sd-card-info">
          <div className="sd-card-top">
            <span className="sd-badge">{current.area}</span>
            <span className="sd-badge">{current.category}</span>
            {current.isOpen && <span className="sd-badge sd-badge--open">営業中</span>}
          </div>
          <h2 className="sd-card-name">{current.name}</h2>
          <div className="sd-card-meta">
            <span>徒歩{current.walkMinutes}分</span>
            <span>待ち{current.waitMinutes}分</span>
            <span>〜{current.lastOrderAt}</span>
          </div>
          <div className="sd-card-tags">
            {current.benefitTags.slice(0, 3).map((tag) => (
              <span className="sd-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="sd-actions">
        <button className="sd-action sd-action--skip" onClick={() => dismiss("left")} type="button" aria-label="スキップ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button className="sd-action sd-action--line" onClick={() => dismiss("up")} type="button" aria-label="LINE予約">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="17 11 12 6 7 11"/><line x1="12" y1="18" x2="12" y2="6"/></svg>
        </button>
        <Link className="sd-action sd-action--detail" href={`/stores/${current.slug}`} aria-label="詳細">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </Link>
      </div>

      {/* Progress */}
      <div className="sd-progress">
        <div className="sd-progress-bar" style={{ width: `${((stores.length - deck.length) / stores.length) * 100}%` }} />
      </div>

      {/* Count */}
      <div className="sd-count">{stores.length - deck.length + 1} / {stores.length}</div>
    </div>
  );
}
