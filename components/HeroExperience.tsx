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
const BURST_MS = 4200; // butterflies stay ~4s before flying off
const SCROLL_DELAY_MS = 2000; // after butterflies + logo, then fade in "scroll"

/**
 * Orchestrates the opening sequence in strict order:
 *   loading -> the dashed circle draws on clockwise (~2.4s)
 *   burst   -> the ring bursts into butterflies that fly off (~4s)
 *   done    -> the GlassButterfly title fades in
 * Then, ~1s later, the "scroll" hint fades in — and it fades back out as soon
 * as the user starts scrolling.
 */
export default function HeroExperience() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(16);
  const [scrollReady, setScrollReady] = useState(false);

  const { scrollY } = useScroll();
  // Fade the scroll hint out as soon as scrolling begins.
  const scrollFade = useTransform(scrollY, [0, 140], [1, 0], { clamp: true });

  // Slightly fewer butterflies on small screens for performance.
  useEffect(() => {
    setCount(window.innerWidth < 768 ? 9 : 16);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const t1 = window.setTimeout(() => setPhase("burst"), LOAD_MS);
    return () => window.clearTimeout(t1);
  }, [reduced]);

  useEffect(() => {
    if (phase !== "burst") return;
    const t2 = window.setTimeout(() => setPhase("done"), BURST_MS);
    return () => window.clearTimeout(t2);
  }, [phase]);

  // Once the title has appeared, wait, then reveal the "scroll" hint.
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

      {/* The GlassButterfly title — appears only after the butterflies */}
      <SiteLogo revealed={reduced || phase === "done"} />

      {/* Scroll hint — appears after the title, fades out on scroll */}
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
