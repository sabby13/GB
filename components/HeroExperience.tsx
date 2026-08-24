"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import SiteLogo from "./SiteLogo";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// The 3D canvas must never render on the server.
const ButterflyScene = dynamic(() => import("./ButterflyScene"), {
  ssr: false,
});

type Phase = "loading" | "burst" | "done";

// Sequence timing (ms)
const LOAD_MS = 2400; // loader draws a full circle (slower)
const TITLE_DELAY_MS = 1000; // after butterflies appear, then the title fades in
const BURST_MS = 4200; // butterflies stay ~4s before flying off
const SCROLL_DELAY_MS = 1000; // after butterflies clear, then the "scroll" hint

/**
 * Orchestrates the opening sequence:
 *   loading -> the dashed circle draws on clockwise (~2.4s)
 *   burst   -> the ring bursts into butterflies; ~1s later the GlassButterfly
 *              title fades in beneath them; butterflies fly off (~4s total)
 *   done    -> the "scroll" hint fades in (and fades out again on scroll)
 */
export default function HeroExperience() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(16);
  const [titleShown, setTitleShown] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);

  const { scrollY } = useScroll();
  const scrollFade = useTransform(scrollY, [0, 140], [1, 0], { clamp: true });

  useEffect(() => {
    setCount(window.innerWidth < 768 ? 9 : 16);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      setTitleShown(true);
      return;
    }
    const t1 = window.setTimeout(() => setPhase("burst"), LOAD_MS);
    return () => window.clearTimeout(t1);
  }, [reduced]);

  useEffect(() => {
    if (phase !== "burst") return;
    // Title fades in ~1s after the butterflies appear.
    const tTitle = window.setTimeout(() => setTitleShown(true), TITLE_DELAY_MS);
    const tDone = window.setTimeout(() => setPhase("done"), BURST_MS);
    return () => {
      window.clearTimeout(tTitle);
      window.clearTimeout(tDone);
    };
  }, [phase]);

  // Once the butterflies have cleared, reveal the "scroll" hint.
  useEffect(() => {
    if (phase !== "done") return;
    const t3 = window.setTimeout(() => setScrollReady(true), SCROLL_DELAY_MS);
    return () => window.clearTimeout(t3);
  }, [phase]);

  const showCanvas = !reduced && phase !== "done";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-cream">
      {/* Loader ring */}
      {!reduced && <Loader visible={phase === "loading"} />}

      {/* Butterfly swarm canvas */}
      {showCanvas && (
        <div className="absolute inset-0 z-20">
          <ButterflyScene active={phase !== "loading"} count={count} />
        </div>
      )}

      {/* Header strip + GlassButterfly title (title appears 1s into the burst) */}
      <SiteLogo revealed={reduced || titleShown} />

      {/* Scroll hint — appears after the butterflies, fades out on scroll */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollReady ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE.smooth }}
      >
        <motion.span
          style={{ opacity: scrollFade }}
          className="block text-[11px] uppercase tracking-[0.35em] text-ink/40"
        >
          scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
