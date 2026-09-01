"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE } from "@/lib/motion";

type Step = { img: string; caption: string };

// Captions lightly reworded for clarity; images live in /assets/Installtion.
const STEPS: Step[] = [
  { img: "/assets/Installtion/1.png", caption: "Download the .zip and extract it to a folder." },
  { img: "/assets/Installtion/2.png", caption: "Open the extracted GlassButterfly folder." },
  { img: "/assets/Installtion/3.png", caption: "Right-click GlassButterfly.scr." },
  { img: "/assets/Installtion/4.png", caption: "Choose Install." },
  { img: "/assets/Installtion/5.png", caption: "Windows shows a warning — click More info." },
  { img: "/assets/Installtion/6.png", caption: "Click Run anyway." },
  { img: "/assets/Installtion/7.png", caption: "Open the Settings panel." },
  { img: "/assets/Installtion/8.png", caption: "Tweak what you like, then Exit." },
  { img: "/assets/Installtion/9.png", caption: "Click Preview to see it live." },
  { img: "/assets/Installtion/10.png", caption: "Click OK. Reopen anytime via “Screen Saver Settings” in Windows search." },
];

export default function InstallationSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [maxX, setMaxX] = useState(0);
  const [vh, setVh] = useState(800);
  const [step, setStep] = useState(1);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(STEPS.length, Math.max(1, Math.floor(v * STEPS.length) + 1)));
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    // re-measure once images have loaded (they change scrollWidth)
    const id = window.setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(id);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full bg-white"
      style={{ height: `${vh + maxX}px` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Heading + live step counter */}
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-6 pt-24 md:pt-28">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE.smooth }}
              className="font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-none text-ink"
            >
              Installation
            </motion.h2>
            <p className="mt-3 text-ink/50">Up and running in about a minute.</p>
          </div>
          <div className="hidden font-display text-2xl text-ink/70 sm:block">
            <span className="text-ink">{String(step).padStart(2, "0")}</span>
            <span className="text-ink/30"> / {String(STEPS.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Horizontal track (slides with scroll) */}
        <div className="flex flex-1 items-center overflow-hidden">
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-6 pl-6 pr-[12vw] md:gap-12 md:pl-[8vw]"
          >
            {STEPS.map((s, i) => (
              <li
                key={i}
                className="w-[78vw] max-w-[440px] shrink-0 md:w-[38vw] md:max-w-[520px]"
              >
                <div
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
                  style={{ boxShadow: "0 30px 70px -35px rgba(0,0,0,0.4)" }}
                >
                  <img
                    src={s.img}
                    alt={`Step ${i + 1}: ${s.caption}`}
                    draggable={false}
                    className="block aspect-square w-full object-cover"
                  />
                </div>
                <div className="mt-5 flex items-start gap-4">
                  <span className="font-display text-3xl leading-none text-ink/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:text-base">
                    {s.caption}
                  </p>
                </div>
              </li>
            ))}
          </motion.ol>
        </div>

        {/* Progress bar */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-10">
          <div className="h-px w-full bg-ink/10">
            <motion.div
              className="h-px origin-left bg-ink"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
