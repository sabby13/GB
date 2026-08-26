"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Feature = { name: string; body: string };

const FEATURES: Feature[] = [
  { name: "Native", body: "Built for Windows, not adapted to it." },
  { name: "Feather-light", body: "Runs quietly, so your desktop can be admired." },
  { name: "Alive", body: "Every butterfly follows its own path. No loops. No repetition." },
  { name: "Yours", body: "Make every desktop unmistakably yours." },
];

const RED = "#ff1a1a";

/* ---- typewriter that types while `active`, then clears ---- */
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [active, text]);

  return (
    <span>
      {shown}
      {active && <span className="gb-caret">▍</span>}
    </span>
  );
}

/* ---- one feature: animated red marker heading + hover typewriter body ---- */
function FeatureRow({ f, index }: { f: Feature; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false); // tap support on touch
  const active = hovered || pinned;

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
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => setPinned((v) => !v)}
      whileHover={{ scale: 1.03, rotate: 0 }}
      className="group cursor-default select-none"
    >
      {/* Red marker heading with a twinkling asterisk */}
      <h3
        className="font-marker flex items-start leading-[0.95] text-[clamp(2.6rem,7.5vw,5.5rem)]"
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

      {/* White marker body — reserved space, typewriter on hover */}
      <motion.p
        animate={{ y: active ? 0 : 8, opacity: active ? 1 : 0.0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="font-hand mt-3 min-h-[2.4em] max-w-2xl pl-[0.55em] text-[clamp(1.25rem,3vw,2.1rem)] leading-snug text-white"
      >
        <Typewriter text={f.body} active={active} />
      </motion.p>
    </motion.div>
  );
}

/**
 * The feature section as a black cutting-mat: hand-drawn marker headings in red
 * that pop and twinkle in, each hiding a white description that types out
 * beneath it on hover.
 */
export default function FeaturePills() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden py-32 md:py-40"
      style={{
        background: "url('/assets/mat2.svg') center / cover no-repeat #000000",
      }}
    >
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-8 md:gap-20 md:px-16"
      >
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.name} f={f} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
