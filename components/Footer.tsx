"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StaticButterfly from "./StaticButterfly";
import { EASE } from "@/lib/motion";

/**
 * Closing "Stay close" newsletter footer — an editorial sign-off with a serif
 * headline, a soft e-mail capture, a rose bouquet with a monarch resting on it,
 * and a handwritten signature that links out.
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer
      id="site-footer"
      className="relative w-full overflow-hidden bg-white pb-10 pt-10"
    >
      {/* Full-bleed divider, edge to edge */}
      <div className="h-px w-full bg-ink" />

      <div className="relative mx-auto max-w-5xl px-6 pt-16">
        {/* Headline block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE.smooth }}
          className="text-center"
        >
          <h2 className="font-display text-[clamp(2.6rem,7vw,4rem)] leading-none text-ink">
            Stay close
          </h2>
          <p className="mt-4 font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-ink/90">
            We&apos;re building more beautiful software.
          </p>

          {/* E-mail capture — the CTA disappears once you're in */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setJoined(true);
            }}
            className="mx-auto mt-9 flex max-w-sm flex-col items-center gap-5"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full rounded-full border border-ink bg-white px-7 py-3 text-center text-[15px] text-[#3b82f6] placeholder-[#3b82f6]/80 outline-none transition-shadow duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
            />
            <div className="h-7">
              <AnimatePresence mode="wait">
                {joined ? (
                  <motion.p
                    key="thanks"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE.smooth }}
                    className="font-display text-lg italic text-ink/70"
                  >
                    ✦ You&apos;re on the list
                  </motion.p>
                ) : (
                  <motion.button
                    key="cta"
                    type="submit"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="font-display text-lg italic text-ink/90 transition-opacity duration-300 hover:opacity-60"
                  >
                    Count me in →
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        {/* Bouquet + resting monarch (larger) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE.expo }}
          className="relative mx-auto mt-10 w-full max-w-[780px]"
        >
          <img
            src="/assets/roses.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="block h-auto w-full select-none object-contain"
          />
          {/* Monarch resting on the top-left rose, facing 2 o'clock */}
          <div className="pointer-events-none absolute left-[-4%] top-[-8%] h-[58%] w-[58%]">
            <StaticButterfly orient={{ z: 1.02, y: -0.2 }} scaleMul={1.1} />
          </div>
        </motion.div>

        {/* Signature — bigger "yours truly" + handwritten sign that links out */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.2, ease: EASE.smooth }}
          className="mt-2 flex flex-col items-end"
        >
          <p className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] italic leading-snug text-[#2b3a67]">
            ~ yours truly
          </p>
          <a
            href="https://sabby13.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sahib — visit sabby13.github.io"
            className="mt-1 inline-block transition-transform duration-300 hover:scale-[1.04]"
          >
            <img
              src="/assets/sign.png"
              alt="Sahib"
              draggable={false}
              className="h-auto w-[clamp(140px,20vw,200px)] select-none object-contain"
            />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
