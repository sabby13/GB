"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  getWallpaperMetrics,
  onWallpaperMetrics,
} from "@/lib/butterfly/wallpaperMetrics";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Gentler distortion for small cards (e.g. the date). */
  softDistort?: boolean;
}

/**
 * A frosted liquid-glass surface. Its distortion layer samples the wallpaper
 * actually behind it — aligned to the monitor screen box (`.gb-screen`) rather
 * than the whole window, since here the glass lives inside the mockup monitor.
 */
export function GlassCard({
  children,
  className,
  softDistort = false,
  ...rest
}: GlassCardProps) {
  const distortRef = useRef<HTMLSpanElement>(null);
  const distortFilter = softDistort
    ? "url(#glass-liquid-soft) blur(3px) saturate(1.4)"
    : "url(#glass-liquid) blur(5px) saturate(1.5)";

  useEffect(() => {
    const el = distortRef.current;
    if (!el) return;
    const screen = el.closest(".gb-screen") as HTMLElement | null;

    const align = (): void => {
      const m = getWallpaperMetrics();
      if (!m || !m.iw || !m.ih) return;
      const host = screen ?? document.documentElement;
      const hostRect = host.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const bw = hostRect.width;
      const bh = hostRect.height;
      const scale = Math.max(bw / m.iw, bh / m.ih); // object-fit: cover
      const renderedW = m.iw * scale;
      const renderedH = m.ih * scale;
      const imgLeft = hostRect.left + (bw - renderedW) / 2;
      const imgTop = hostRect.top + (bh - renderedH) / 2;

      el.style.backgroundSize = `${renderedW}px ${renderedH}px`;
      el.style.backgroundPosition = `${imgLeft - rect.left}px ${imgTop - rect.top}px`;
    };

    align();
    const ro = new ResizeObserver(align);
    ro.observe(el);
    if (screen) ro.observe(screen);
    window.addEventListener("resize", align);
    window.addEventListener("scroll", align, { passive: true });
    const off = onWallpaperMetrics(align);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", align);
      window.removeEventListener("scroll", align);
      off();
    };
  }, []);

  return (
    <div className={className ? `glass-card ${className}` : "glass-card"} {...rest}>
      <span
        ref={distortRef}
        className="glass-card__distort"
        aria-hidden="true"
        style={{ filter: distortFilter }}
      />
      <span className="glass-card__refraction" aria-hidden="true" />
      <div className="glass-card__content">{children}</div>
    </div>
  );
}
