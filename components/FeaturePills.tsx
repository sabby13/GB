"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type Feature = { name: string; body: string };

const FEATURES: Feature[] = [
  { name: "Native", body: "Built for Windows, not adapted to it." },
  { name: "Feather-light", body: "Runs quietly, so your desktop can be admired." },
  { name: "Alive", body: "Every butterfly follows its own path. No loops. No repetition." },
  { name: "Yours", body: "Make every desktop unmistakably yours." },
];

const RED = "#ff1a1a";

/* ---- one feature: animated red marker heading + white quote beneath ---- */
function FeatureRow({ f, index }: { f: Feature; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.7, rotate: -8 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: -1.5,
          transition: { type: "spring", stiffness: 260, damping: 16 },
        },
      }}
      whileHover={{ scale: 1.03, rotate: 0 }}
      className="group cursor-default select-none"
    >
      {/* Red heading with a twinkling asterisk bullet */}
      <h3
        className="font-marker flex items-start leading-[0.95] text-[clamp(5.2rem,15vw,11rem)]"
        style={{ color: RED }}
      >
        <motion.span
          aria-hidden="true"
          className="mr-2 inline-block"
          animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.18, 0.96, 1] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.35,
          }}
        >
          *
        </motion.span>
        <span>{f.name}</span>
      </h3>

      {/* White quote in the same hand */}
      <p className="font-marker mt-5 max-w-3xl pl-[0.55em] text-[clamp(2.5rem,6vw,4.2rem)] leading-snug text-white">
        {f.body}
      </p>
    </motion.div>
  );
}

/**
 * The feature section as a black cutting-mat: hand-drawn FC Magic headings in
 * red — each with a twinkling asterisk that pops in — and a white quote beneath.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-32 md:py-40"
    >
      {/* Two cutting-mat plates stacked into one tall backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none"
      >
        <img src="/assets/mat1.png" alt="" className="block w-full" draggable={false} />
        <img src="/assets/mat2.png" alt="" className="block w-full" draggable={false} />
      </div>

      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-28 px-8 md:gap-48 md:px-16"
      >
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.name} f={f} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
