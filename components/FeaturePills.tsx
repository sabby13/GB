"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Box = { l: number; t: number; w: number; h: number };
type Feature = { name: string; body: string; box: Box };

// Boxes are % of f2.png (the red headings), measured from the image itself.
const FEATURES: Feature[] = [
  { name: "Native", body: "Built for Windows, not adapted to it.", box: { l: 39.9, t: 8.7, w: 23.4, h: 9.5 } },
  { name: "Feather-light", body: "Runs quietly, so your desktop can be admired.", box: { l: 28.3, t: 34.2, w: 43.7, h: 11.6 } },
  { name: "Alive", body: "Every butterfly follows its own path. No loops. No repetition.", box: { l: 43.1, t: 59.3, w: 17.2, h: 9.7 } },
  { name: "Yours", body: "Make every desktop unmistakably yours.", box: { l: 41.6, t: 84.1, w: 19.3, h: 9.8 } },
];

/**
 * The feature section is the headings-only image (f2.png). Invisible hover
 * zones sit over each red heading; hovering (or tapping) one reveals its quote.
 */
export default function FeaturePills() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE.smooth }}
        className="relative w-full"
      >
        <img
          src="/assets/f2.png"
          alt="Native — built for Windows. Feather-light — runs quietly. Alive — every butterfly follows its own path. Yours — make every desktop unmistakably yours."
          draggable={false}
          className="block h-auto w-full select-none"
        />

        {/* Hover layer */}
        <div className="absolute inset-0">
          {FEATURES.map((f, i) => {
            const on = active === i;
            const cx = f.box.l + f.box.w / 2;
            return (
              <div key={f.name}>
                {/* Invisible hotspot over the heading */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`${f.name}: ${f.body}`}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${f.box.l}%`,
                    top: `${f.box.t}%`,
                    width: `${f.box.w}%`,
                    height: `${f.box.h}%`,
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive((v) => (v === i ? null : v))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((v) => (v === i ? null : v))}
                  onClick={() => setActive((v) => (v === i ? null : i))}
                />

                {/* Quote revealed beneath the heading */}
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-center"
                  style={{
                    left: `${cx}%`,
                    top: `${f.box.t + f.box.h + 0.8}%`,
                    width: "min(84vw, 640px)",
                  }}
                >
                  <motion.p
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
                    transition={{ duration: 0.3, ease: EASE.smooth }}
                    className="font-sans text-[clamp(1.3rem,2.8vw,2.4rem)] font-light leading-snug tracking-tight text-white"
                  >
                    {f.body}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
