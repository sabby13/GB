"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FloatingButterflyScene = dynamic(
  () => import("./FloatingButterflyScene"),
  { ssr: false }
);

/**
 * Sends a single butterfly gliding across the whole page every ~15–20s.
 * The canvas only mounts during a flight, so it costs nothing in between.
 */
export default function FloatingButterfly() {
  const reduced = usePrefersReducedMotion();
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timer: number;
    const schedule = () => {
      const wait = 15000 + Math.random() * 5000; // 15–20s
      timer = window.setTimeout(() => setFlying(true), wait);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const handleDone = useCallback(() => {
    setFlying(false);
    // re-arm the next flyby
    window.setTimeout(() => setFlying(true), 15000 + Math.random() * 5000);
  }, []);

  if (reduced || !flying) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[25]">
      <FloatingButterflyScene onDone={handleDone} />
    </div>
  );
}
