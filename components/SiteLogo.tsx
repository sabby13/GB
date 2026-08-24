"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * The GlassButterfly wordmark. Rendered as type (the deck's wordmark font is
 * not in the asset set) so it stays crisp at any size. It is revealed by the
 * butterfly swarm while perfectly centered, then interpolates smoothly to a
 * small sticky header as the user scrolls the first viewport.
 */
export default function SiteLogo({ revealed }: { revealed: boolean }) {
  const [vh, setVh] = useState(900);
  const { scrollY } = useScroll();

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Over the first viewport of scroll: rise from center to top, shrink down.
  const rawY = useTransform(scrollY, [0, vh * 0.9], [0, -(vh / 2 - 34)], {
    clamp: true,
  });
  const rawScale = useTransform(scrollY, [0, vh * 0.9], [1, 0.26], {
    clamp: true,
  });

  const y = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.6 });
  const scale = useSpring(rawScale, { stiffness: 120, damping: 26, mass: 0.6 });

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
      <motion.div
        style={{ y, scale }}
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{
          opacity: revealed ? 1 : 0,
          filter: revealed ? "blur(0px)" : "blur(8px)",
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="select-none whitespace-nowrap"
      >
        <span className="wordmark text-[clamp(2.6rem,10vw,8rem)] leading-none text-ink">
          GlassButterfly
          <sup className="ml-1 align-super text-[0.28em] tracking-normal">®</sup>
        </span>
      </motion.div>
    </div>
  );
}
