"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { calloutIn } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const WORDS = ["Fast", "Lightweight", "Native", "Beautiful", "Smooth", "Free"];

const SPOTS = [
  { top: "18%", left: "8%" },
  { top: "30%", right: "10%" },
  { bottom: "26%", left: "12%" },
  { bottom: "20%", right: "14%" },
  { top: "50%", left: "6%" },
];

/**
 * Tiny glass callouts that surface subtly at the page edges, one at a time,
 * then fade away. Purely atmospheric.
 */
export default function FloatingCallouts() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let show: number;
    let hide: number;
    const loop = () => {
      show = window.setTimeout(() => {
        setVisible(true);
        hide = window.setTimeout(() => {
          setVisible(false);
          setI((n) => (n + 1) % WORDS.length);
          loop();
        }, 3200);
      }, 4200 + Math.random() * 2500);
    };
    loop();
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [reduced]);

  if (reduced) return null;

  const spot = SPOTS[i % SPOTS.length];

  return (
    <div className="pointer-events-none fixed inset-0 z-[15]">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={WORDS[i]}
            variants={calloutIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass absolute rounded-2xl px-5 py-3"
            style={spot as React.CSSProperties}
          >
            <span className="font-display text-lg text-ink/85">{WORDS[i]}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
