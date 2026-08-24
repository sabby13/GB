"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Height of the fixed off-white header strip.
const HEADER_H = 84;
// Hero (centred) size relative to the docked size (keeps the big reveal).
const HERO_SCALE = 2.5;

/**
 * The GlassButterfly wordmark plus the persistent header.
 *
 * - A fixed off-white strip sits at the very top of the page throughout the
 *   whole site. It's invisible over the cream hero and fades in as you scroll.
 * - The wordmark is revealed large and centred during the hero, then
 *   interpolates smoothly up and shrinks to its docked size — which matches the
 *   section headings (~88px) — where it stays as the site header.
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

  // Over the first viewport of scroll: rise from centre to the header strip,
  // scaling from the large hero size down to the docked (header) size of 1.
  const rawY = useTransform(scrollY, [0, vh * 0.9], [0, -(vh / 2 - HEADER_H / 2)], {
    clamp: true,
  });
  const rawScale = useTransform(scrollY, [0, vh * 0.9], [HERO_SCALE, 1], {
    clamp: true,
  });
  const y = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.6 });
  const scale = useSpring(rawScale, { stiffness: 120, damping: 26, mass: 0.6 });

  // The header strip fades in as soon as the user starts scrolling.
  const stripOpacity = useTransform(scrollY, [0, 120], [0, 1], { clamp: true });

  return (
    <>
      {/* Persistent off-white header strip (no divider line) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 w-full"
        style={{
          height: HEADER_H,
          background: "var(--cream)",
          opacity: stripOpacity,
        }}
      />

      {/* Interpolating wordmark (docks into the strip at header size) */}
      <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
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
          {/* Same size as the "Installation" / "Download" headings */}
          <span className="wordmark text-[clamp(1.9rem,5vw,3.4rem)] leading-none text-ink">
            GlassButterfly
            <sup className="ml-1 align-super text-[0.28em] tracking-normal">®</sup>
          </span>
        </motion.div>
      </div>
    </>
  );
}
