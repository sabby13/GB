"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

// The ring stays perfectly still; these segments illuminate one after another
// around the circle to read as a progress sweep.
const SEGMENTS = 44;
const RADIUS = 112; // px from centre of the 240px box
const CYCLE = 1.6; // seconds for one full loop of the sweep

/**
 * The initial loading indicator: a stationary dashed ring whose individual
 * segments light up sequentially around the path (a travelling progress sweep),
 * looping until the assets are ready. It fades out as the butterflies burst.
 */
export default function Loader({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE.smooth }}
      aria-hidden={!visible}
    >
      <div className="relative h-[240px] w-[240px]">
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const angle = (i / SEGMENTS) * 360;
          return (
            <span
              key={i}
              className="loader-seg"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${RADIUS}px)`,
                // negative, staggered delay makes the lit band travel around
                animationDelay: `${-(i / SEGMENTS) * CYCLE}s`,
                animationDuration: `${CYCLE}s`,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
