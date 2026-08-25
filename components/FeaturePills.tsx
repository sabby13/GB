"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { pillIn, stagger } from "@/lib/motion";
import { ButterflyLayer } from "./screensaver/ButterflyLayer";
import { butterflyConfig } from "@/lib/butterfly/config";

const FEATURES: { label: string; align: "start" | "center" | "end"; offset: string }[] = [
  { label: "✦ Native by design ✦", align: "center", offset: "0" },
  { label: "✦ Barely uses resources ✦", align: "start", offset: "-2vw" },
  { label: "✦ Beautiful in motion ✦", align: "end", offset: "2vw" },
  { label: "✦ Yours to customize ✦", align: "start", offset: "4vw" },
];

/**
 * Liquid-glass capsule pills that drift into place as the section scrolls into
 * view, framed by two decorative butterflies at the corners.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);
  // Mount the butterfly canvases only while the section is in view.
  const inView = useInView(sectionRef, { amount: 0.2 });

  // Same butterfly engine as the monitor (correct top-down orientation), but in
  // "hover" mode so each one gently flutters in place within its corner box.
  const cornerConfig = useMemo(
    () => ({
      ...butterflyConfig,
      hover: true,
      hoverCenter: [0, 0] as [number, number],
      hoverRadius: 1.25,
      keepoutX: 0,
      keepoutY: 0,
      scale: 2.2,
    }),
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-40 md:py-56"
    >
      {/* Decorative butterflies (top-left and bottom-right) */}
      {inView && (
        <>
          <div className="pointer-events-none absolute left-0 top-6 z-0 h-44 w-44 md:left-6 md:h-60 md:w-60">
            <ButterflyLayer count={1} config={cornerConfig} />
          </div>
          <div className="pointer-events-none absolute bottom-6 right-0 z-0 h-44 w-44 md:right-6 md:h-60 md:w-60">
            <ButterflyLayer count={1} config={cornerConfig} />
          </div>
        </>
      )}

      <motion.div
        variants={stagger(0.18)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 md:gap-16"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.label}
            variants={pillIn}
            className={`flex w-full ${
              f.align === "start"
                ? "justify-start"
                : f.align === "end"
                  ? "justify-end"
                  : "justify-center"
            }`}
            style={{ transform: `translateX(${f.offset})` }}
          >
            <span className="liquid-pill inline-flex items-center px-8 py-4 font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-none text-ink md:px-12 md:py-6">
              {f.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
