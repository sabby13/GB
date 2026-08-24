"use client";

import { motion } from "framer-motion";
import { EASE, stagger, wordReveal } from "@/lib/motion";

// Set this to your installer URL (e.g. a GitHub release asset) when ready.
const DOWNLOAD_URL = "";
const VERSION = "1.6.1";

const QUOTE = "~ let something Beautiful live on your Screen ~".split(" ");

export default function DownloadSection() {
  return (
    <section className="relative w-full bg-white px-6 py-40">
      <div className="mx-auto max-w-5xl">
        {/* Word-by-word quote reveal (not a single fade) */}
        <motion.p
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto mb-24 max-w-3xl text-center font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-tight text-ink"
        >
          {QUOTE.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              variants={wordReveal}
              className="mr-[0.28em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Download card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE.expo }}
          className="mx-auto w-full max-w-[420px] rounded-[28px] bg-white px-10 pb-10 pt-5 text-center"
          style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.35)" }}
        >
          {/* App icon (your logo.png) */}
          <img
            src="/assets/app-icon.png"
            alt="GlassButterfly app icon"
            className="mx-auto mb-6 block h-auto w-full object-contain"
            draggable={false}
          />

          {/* Wordmark */}
          <div className="mb-5">
            <span className="wordmark text-4xl text-ink">
              GlassButterfly
              <sup className="ml-0.5 align-super text-[0.3em]">®</sup>
            </span>
          </div>

          <p className="text-sm text-ink/60">
            {VERSION} <span className="text-ink/40">(Version History)</span>
          </p>
          <p className="text-sm text-ink/60">Requires Windows 11+</p>

          <p className="mt-6 font-display text-4xl text-ink">$0.00</p>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Free</p>

          <a
            href={DOWNLOAD_URL || "#"}
            onClick={(e) => {
              if (!DOWNLOAD_URL) e.preventDefault();
            }}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-8 py-4 text-white transition-transform duration-300 hover:scale-[1.02]"
            style={{ boxShadow: "0 14px 30px -10px rgba(0,0,0,0.5)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8m0 0l-3-3m3 3l3-3" />
            </svg>
            <span className="text-lg">Download</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
