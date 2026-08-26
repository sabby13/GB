"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * The feature section is a single baked image — the cutting-mat with the
 * hand-drawn features. f1 (with quotes) on desktop, f2 (headings) on mobile.
 */
export default function FeaturePills() {
  return (
    <section className="w-full bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE.smooth }}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/f1.png" />
          <img
            src="/assets/f2.png"
            alt="Native — built for Windows. Feather-light — runs quietly. Alive — every butterfly follows its own path. Yours — make every desktop unmistakably yours."
            draggable={false}
            className="block h-auto w-full select-none"
          />
        </picture>
      </motion.div>
    </section>
  );
}
