"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
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
const LOAD_MS = 2000; // loader sweep
const BURST_MS = 4200; // butterflies stay ~4s before flying off
const SCROLL_DELAY_MS = 1000; // pause after logo revealed, then fade in "scroll"

/**
 * Orchestrates the opening sequence:
 *   loading -> segmented ring sweeps (~2s while assets init)
 *   burst   -> ring bursts into ~2x butterflies that reveal the logo (~4s)
 *   done    -> butterflies have flown off; canvas unmounts, logo stays.
 * Then, 1s after the reveal completes, the "scroll" hint fades in.
 */
export default function HeroExperience() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(16);
  const [scrollReady, setScrollReady] = useState(false);

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

  // Once the reveal is complete (logo fully shown), wait, then reveal "scroll".
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

      {/* Butterfly swarm canvas (revealed by bursting) */}
      {showCanvas && (
        <div className="absolute inset-0 z-20">
          <ButterflyScene active={phase !== "loading"} count={count} />
        </div>
      )}

      {/* The wordmark, revealed beneath the butterflies */}
      <SiteLogo revealed={reduced || phase !== "loading"} />

      {/* Scroll hint — only after the logo is fully revealed */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollReady ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE.smooth }}
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-ink/40">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
