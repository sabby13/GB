"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { EASE, riseIn, stagger } from "@/lib/motion";

type Step = { title: string; caption: string; icon: React.ReactNode };

const STEPS: Step[] = [
  {
    title: "Download",
    caption: "Grab the free installer — a few megabytes, no account.",
    icon: (
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
    ),
  },
  {
    title: "Install",
    caption: "A quick, native Windows setup. No bloat, no drivers.",
    icon: (
      <path d="M4 7h16M4 12h16M4 17h10M20 15l2 2-2 2" />
    ),
  },
  {
    title: "Choose wallpaper",
    caption: "Pick a living wallpaper and make it yours.",
    icon: (
      <path d="M4 5h16v11H4z M4 20h16 M9 16l3-4 2 2 3-4" />
    ),
  },
  {
    title: "Done",
    caption: "Something beautiful is now living on your screen.",
    icon: <path d="M5 13l4 4L19 7" />,
  },
];

/**
 * A vertical, cinematic installation flow. A progress line scrubs with scroll
 * (GSAP ScrollTrigger) while each step rises into view (Framer Motion).
 */
export default function InstallationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lineRef.current) lineRef.current.style.transform = "scaleY(1)";
      return;
    }
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    // Keep triggers accurate after fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white px-6 py-40"
    >
      <motion.h2
        variants={riseIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto mb-24 max-w-5xl font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-none text-ink"
      >
        Installation
      </motion.h2>

      <div className="relative mx-auto max-w-2xl">
        {/* Track + scrubbing progress line */}
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-ink/10 md:left-[31px]" />
        <div
          ref={lineRef}
          className="absolute left-[27px] top-2 bottom-2 w-px origin-top bg-ink md:left-[31px]"
          style={{ transform: "scaleY(0)" }}
        />

        <motion.ol
          variants={stagger(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-16"
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: EASE.smooth },
                },
              }}
              className="relative flex items-start gap-7 pl-1"
            >
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white shadow-sm">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink"
                >
                  {step.icon}
                </svg>
              </span>
              <div className="pt-2">
                <span className="mb-1 block text-xs uppercase tracking-[0.3em] text-ink/40">
                  Step {i + 1}
                </span>
                <h3 className="font-display text-3xl text-ink">{step.title}</h3>
                <p className="mt-2 max-w-md text-ink/55">{step.caption}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
