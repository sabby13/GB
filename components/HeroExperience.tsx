"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import SiteLogo from "./SiteLogo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// The 3D canvas must never render on the server.
const ButterflyScene = dynamic(() => import("./ButterflyScene"), {
  ssr: false,
});

type Phase = "loading" | "burst" | "done";

/**
 * Orchestrates the opening sequence:
 *   loading  -> dotted ring spins (~2s while assets init)
 *   burst    -> ring "explodes" into butterflies that reveal the logo (~2.4s)
 *   done     -> butterflies have flown off; canvas unmounts, logo stays.
 */
export default function HeroExperience() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(22);

  // Fewer butterflies on small screens for performance.
  useEffect(() => {
    setCount(window.innerWidth < 768 ? 12 : 22);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const t1 = window.setTimeout(() => setPhase("burst"), 2000);
    return () => window.clearTimeout(t1);
  }, [reduced]);

  useEffect(() => {
    if (phase !== "burst") return;
    const t2 = window.setTimeout(() => setPhase("done"), 2600);
    return () => window.clearTimeout(t2);
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

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <span className="text-[11px] uppercase tracking-[0.35em] text-ink/40">
          scroll
        </span>
      </div>
    </section>
  );
}
