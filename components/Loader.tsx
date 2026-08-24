"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

// Geometry for the dashed circle.
const R = 108;
const C = 2 * Math.PI * R; // circumference ≈ 678.6

/**
 * The initial loading indicator: tangential dashes lying along a circle's
 * circumference. The arc draws on from the right (3 o'clock) and grows until it
 * completes the full circle, then loops. The circle itself never rotates.
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
      <svg className="loader-svg" viewBox="0 0 240 240" width={240} height={240}>
        <defs>
          {/* A growing solid arc that reveals the dashed ring beneath it */}
          <mask id="gb-loader-reveal">
            <circle
              cx={120}
              cy={120}
              r={R}
              fill="none"
              stroke="#fff"
              strokeWidth={12}
              strokeDasharray={C}
              strokeDashoffset={C}
              className="loader-reveal"
            />
          </mask>
        </defs>

        {/* The dashes along the circumference, revealed progressively */}
        <circle
          cx={120}
          cy={120}
          r={R}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="8 13"
          mask="url(#gb-loader-reveal)"
        />
      </svg>
    </motion.div>
  );
}
