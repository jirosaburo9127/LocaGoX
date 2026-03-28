"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ScrollTopbar({
  logoText,
  location,
  navHref
}: {
  logoText: string;
  location: string;
  navHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nf-topbar${scrolled ? " nf-topbar--scrolled" : ""}`}>
      <div className="nf-topbar-left">
        <span className="nf-logo">{logoText}</span>
        <span className="nf-location">{location}</span>
      </div>
      <Link className="nf-topbar-link" href={navHref} aria-label="メニュー">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </Link>
    </header>
  );
}
