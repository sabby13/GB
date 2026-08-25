"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { EASE, stagger } from "@/lib/motion";
import { ButterflyLayer } from "./screensaver/ButterflyLayer";
import { butterflyConfig } from "@/lib/butterfly/config";

type Part = { t: string; italic?: boolean };
type Feature = { n: string; align: "start" | "end"; parts: Part[] };

// Each phrase has one word set in italic for an editorial accent.
const FEATURES: Feature[] = [
  { n: "1", align: "start", parts: [{ t: "Native by " }, { t: "design", italic: true }] },
  { n: "2", align: "end", parts: [{ t: "Barely uses " }, { t: "resources", italic: true }] },
  { n: "3", align: "start", parts: [{ t: "Beautiful", italic: true }, { t: " in motion" }] },
  { n: "4", align: "end", parts: [{ t: "Yours to " }, { t: "customize", italic: true }] },
];

const item = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
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
    transition: { duration: 1.1, ease: EASE.expo, delay: 0.15 },
  },
};

/**
 * The features, reimagined as an editorial spread — big serif statements with
 * an italic accent, a small index, a giant ghosted number and a hairline that
 * draws in — instead of boxed pills. Two butterflies flutter at the corners.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

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
        variants={stagger(0.22)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col gap-20 md:gap-28"
      >
        {FEATURES.map((f) => {
          const end = f.align === "end";
          return (
            <motion.div
              key={f.n}
              variants={item}
              className={`relative flex flex-col ${
                end ? "items-end text-right" : "items-start text-left"
              }`}
            >
              {/* Giant ghosted index behind the line (warm red) */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-[0.42em] select-none font-display text-[clamp(6rem,17vw,13rem)] leading-none ${
                  end ? "right-0" : "left-0"
                }`}
                style={{ color: "rgba(190, 26, 34, 0.24)" }}
              >
                {f.n}
              </span>

              <div className="relative z-10">
                <h3 className="font-display text-[clamp(2.2rem,6.6vw,4.7rem)] leading-[1.04] text-ink">
                  {f.parts.map((p, i) => (
                    <span key={i} className={p.italic ? "italic" : ""}>
                      {p.t}
                    </span>
                  ))}
                </h3>

                <motion.span
                  variants={rule}
                  className={`mt-6 block h-px bg-ink/25 ${
                    end ? "origin-right" : "origin-left"
                  }`}
                  style={{ width: "min(42vw, 340px)" }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
