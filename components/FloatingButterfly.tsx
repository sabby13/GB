"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FloatingButterflyScene = dynamic(
  () => import("./FloatingButterflyScene"),
  { ssr: false }
);

/**
 * Sends a single butterfly gliding across the screen — but only while `active`
 * (i.e. while the feature section is in view). The canvas only mounts during a
 * flight, so it costs nothing otherwise.
 */
export default function FloatingButterfly({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [flying, setFlying] = useState(false);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
    // Leaving the section removes the butterfly immediately (no stray fly-bys
    // over other sections).
    if (!active) setFlying(false);
  }, [active]);

  useEffect(() => {
    if (reduced || !active) return;
    // Begin a fly-by shortly after the section comes into view.
    const t = window.setTimeout(() => {
      if (activeRef.current) setFlying(true);
    }, 1000);
    return () => window.clearTimeout(t);
  }, [reduced, active]);

  const handleDone = useCallback(() => {
    setFlying(false);
    // Schedule the next pass only if the section is still in view.
    if (activeRef.current) {
      window.setTimeout(() => {
        if (activeRef.current) setFlying(true);
      }, 6000 + Math.random() * 4000);
    }
  }, []);

  if (reduced || !flying) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[25]">
      <FloatingButterflyScene onDone={handleDone} />
    </div>
  );
}
