"use client";

import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { EASE, stagger } from "@/lib/motion";
import { ButterflyLayer } from "./screensaver/ButterflyLayer";
import { butterflyConfig } from "@/lib/butterfly/config";

type Part = { t: string; italic?: boolean };
type Feature = { i: string; parts: Part[]; body: string };

// Small serif index, a headline with one italic accent, and a line of body.
const FEATURES: Feature[] = [
  {
    i: "I",
    parts: [{ t: "Native by " }, { t: "design", italic: true }],
    body: "Built on Windows internals, not bolted on top. It wakes instantly and behaves like it always belonged.",
  },
  {
    i: "II",
    parts: [{ t: "Feather-", italic: false }, { t: "light", italic: true }],
    body: "A few megabytes of memory and a whisper of CPU. Your machine stays cool, quiet, and quick.",
  },
  {
    i: "III",
    parts: [{ t: "Alive in " }, { t: "motion", italic: true }],
    body: "Monarchs rendered in real time drift across your wallpaper — every flight its own, never a loop.",
  },
  {
    i: "IV",
    parts: [{ t: "Yours to " }, { t: "shape", italic: true }],
    body: "Your wallpapers, your palette, your pace. Set the mood and make it unmistakably yours.",
  },
];

// Warm, deep monarch-red — a restrained accent, not a siren.
const ACCENT = "#9e2b26";

const cell = {
  hidden: { opacity: 0, y: 34, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE.smooth },
  },
};

const rule = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: EASE.expo },
  },
};

const introItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE.smooth },
  },
};

/**
 * The feature section, rebuilt as a calm editorial spec-sheet: a serif intro,
 * then a 2×2 grid of quiet statements — small roman index, a headline with an
 * italic accent, a hairline that draws in, and one line of supporting copy.
 * A single monarch drifts in the upper corner, clear of the text.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

  const cornerConfig = useMemo(
    () => ({
      ...butterflyConfig,
      hover: true,
      hoverCenter: [0, 0] as [number, number],
      hoverRadius: 1.15,
      keepoutX: 0,
      keepoutY: 0,
      scale: 2.0,
    }),
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-40 md:py-56"
    >
      {/* One quiet monarch, upper-right, clear of the copy */}
      {inView && (
        <div className="pointer-events-none absolute right-2 top-10 z-0 h-40 w-40 opacity-90 md:right-16 md:top-16 md:h-52 md:w-52">
          <ButterflyLayer count={1} config={cornerConfig} />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Intro */}
        <motion.div
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="mb-24 max-w-2xl md:mb-32"
        >
          <motion.p
            variants={introItem}
            className="mb-5 font-sans text-xs uppercase tracking-[0.34em] text-ink/40"
          >
            The craft
          </motion.p>
          <motion.h2
            variants={introItem}
            className="font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.02] text-ink"
          >
            Crafted to <span className="italic">disappear.</span>
          </motion.h2>
          <motion.p
            variants={introItem}
            className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink/55"
          >
            Four reasons GlassButterfly feels less like software you run and more
            like part of your desk.
          </motion.p>
        </motion.div>

        {/* 2×2 spec grid */}
        <motion.div
          variants={stagger(0.16)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 md:gap-y-24"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.i} variants={cell} className="group relative pt-7">
              {/* Hairline that draws in */}
              <motion.span
                variants={rule}
                className="absolute left-0 top-0 block h-px w-full origin-left bg-ink/15"
              />

              <div className="flex items-baseline gap-4">
                <span
                  className="font-display text-lg italic leading-none"
                  style={{ color: ACCENT }}
                >
                  {f.i}
                </span>
                <h3 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] text-ink">
                  {f.parts.map((p, i) => (
                    <span key={i} className={p.italic ? "italic" : ""}>
                      {p.t}
                    </span>
                  ))}
                </h3>
              </div>

              <p className="mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/55">
                {f.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
