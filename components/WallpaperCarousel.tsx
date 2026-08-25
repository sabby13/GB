"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { WALLPAPERS } from "@/lib/wallpapers";
import { EASE } from "@/lib/motion";
import { setWallpaperMetrics } from "@/lib/butterfly/wallpaperMetrics";

// The live overlay (clock + date + butterfly) is client-only and mounts ONCE.
const ScreenSaverOverlay = dynamic(
  () => import("./screensaver/ScreenSaverOverlay"),
  { ssr: false }
);

/**
 * The monitor "screen". The wallpaper image cross-fades on the arrows, while a
 * persistent GlassSaver overlay (clock, date, butterfly) renders on top and
 * never remounts — so switching wallpapers feels seamless, exactly like the
 * real screensaver changing its background.
 */
export default function WallpaperCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const count = WALLPAPERS.length;

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  const active = WALLPAPERS[index];

  // Publish the current wallpaper URL + natural size so the glass cards can
  // sample it for their liquid-glass distortion, and set the CSS var they read.
  useEffect(() => {
    const src = active.src;
    const el = screenRef.current;
    const img = new Image();
    img.onload = () => {
      setWallpaperMetrics({ url: src, iw: img.naturalWidth, ih: img.naturalHeight });
      el?.style.setProperty("--wallpaper-url", `url("${src}")`);
    };
    img.onerror = () => {
      el?.style.setProperty("--wallpaper-url", "none");
    };
    img.src = src;
  }, [active.src]);

  return (
    <div
      ref={screenRef}
      className="gb-screen relative h-full w-full overflow-hidden rounded-[6px] bg-black"
    >
      {/* Cross-fading wallpaper image (only this layer swaps) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={active.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: EASE.smooth }}
          style={{ background: active.gradient }}
        >
          <img
            className="h-full w-full object-cover"
            src={active.src}
            alt={active.title}
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
          <span className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.3em] text-white/70">
            {active.title}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Persistent live overlay: clock, date, butterfly. Hidden on CUSTOM —
          that slot is just a still image (your own wallpaper). */}
      {active.id !== "custom" && <ScreenSaverOverlay butterflyCount={1} />}

      {/* Screen glass sheen (above the overlay, below controls) */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Arrows */}
      <CarouselArrow side="left" onClick={() => go(-1)} />
      <CarouselArrow side="right" onClick={() => go(1)} />

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {WALLPAPERS.map((w, i) => (
          <button
            key={w.id}
            aria-label={`Show ${w.title}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === index ? 18 : 6,
              background: i === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
      <span className="sr-only">{direction >= 0 ? "next" : "previous"}</span>
    </div>
  );
}

function CarouselArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous wallpaper" : "Next wallpaper"}
      className="glass group absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
      style={{ [side]: "12px" } as React.CSSProperties}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-ink"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
