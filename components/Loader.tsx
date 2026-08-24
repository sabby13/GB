"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * The initial loading indicator: a slowly rotating dotted ring on the
 * cream background. It fades out as the butterfly swarm bursts.
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
        <div
          className="animate-spin-slow absolute inset-0 rounded-full"
          style={{
            border: "2px dashed rgba(8,8,8,0.85)",
          }}
        />
      </div>
    </motion.div>
  );
}
