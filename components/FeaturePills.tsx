"use client";

import { motion } from "framer-motion";
import { pillIn, stagger } from "@/lib/motion";

const FEATURES: { label: string; align: "start" | "center" | "end"; offset: string }[] = [
  { label: "✦ Native by design ✦", align: "center", offset: "0" },
  { label: "✦ Barely uses resources ✦", align: "start", offset: "-2vw" },
  { label: "✦ Beautiful in motion ✦", align: "end", offset: "2vw" },
  { label: "✦ Yours to customize ✦", align: "start", offset: "4vw" },
];

/**
 * Large floating capsule pills that drift into place independently as the
 * section scrolls into view.
 */
export default function FeaturePills() {
  return (
    <section className="relative w-full px-6 py-40 md:py-56">
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
