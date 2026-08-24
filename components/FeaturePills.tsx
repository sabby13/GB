"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { pillIn, stagger } from "@/lib/motion";
import FloatingButterfly from "./FloatingButterfly";

const FEATURES: { label: string; align: "start" | "center" | "end"; offset: string }[] = [
  { label: "Built to stay light", align: "center", offset: "0" },
  { label: "Windows native", align: "start", offset: "-2vw" },
  { label: "Customize to your vibe", align: "end", offset: "2vw" },
  { label: 'Make people go “WOOAH”', align: "start", offset: "4vw" },
];

/**
 * Large floating capsule pills that drift into place independently as the
 * section scrolls into view.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);
  // The butterfly fly-by is active only while this section is in view.
  const inView = useInView(sectionRef, { amount: 0.35 });

  return (
    <section ref={sectionRef} className="relative w-full px-6 py-40 md:py-56">
      {/* Occasional butterfly fly-by — confined to this section */}
      <FloatingButterfly active={inView} />

      <motion.div
        variants={stagger(0.18)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-16"
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
            <span className="pill inline-flex items-center bg-white px-8 py-4 font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-none text-ink md:px-12 md:py-6">
              {f.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
