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
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  // The step in focus tracks scroll progress (0 → first, 1 → last).
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.round(v * (STEPS.length - 1)));
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
    const id = window.setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full bg-white"
      style={{ height: `${vh + maxX}px` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Heading */}
        <div className="mx-auto w-full max-w-6xl px-6 pt-24 md:pt-28">
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

        {/* Horizontal filmstrip (slides with scroll) */}
        <div className="flex flex-1 items-center overflow-hidden pb-8">
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-8 px-[16vw] md:gap-16 md:px-[38vw]"
          >
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={i} className="shrink-0">
                  <motion.div
                    animate={{ scale: on ? 1 : 0.78 }}
                    transition={{ duration: 0.5, ease: EASE.smooth }}
                    className="flex origin-center flex-col items-center"
                  >
                    <div className="relative">
                      <img
                        src={s.img}
                        alt={`Step ${i + 1}: ${s.caption}`}
                        draggable={false}
                        className="block h-auto max-h-[50vh] w-auto max-w-[82vw] rounded-xl md:max-h-[62vh] md:max-w-[54vw]"
                        style={{ boxShadow: "0 24px 60px -30px rgba(0,0,0,0.45)" }}
                      />
                      {/* Non-focused steps darken toward black */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl bg-black transition-opacity duration-500"
                        style={{ opacity: on ? 0 : 0.62 }}
                      />
                    </div>
                    <div
                      className="mt-5 flex items-center gap-2.5 transition-opacity duration-500"
                      style={{ opacity: on ? 1 : 0.4 }}
                    >
                      <span className="font-display text-xl leading-none text-ink/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-center text-[14px] leading-snug text-ink/70 md:text-[15px]">
                        {s.caption}
                      </p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
