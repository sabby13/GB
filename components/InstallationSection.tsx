"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE } from "@/lib/motion";

type Slide = { img: string; caption?: string; finale?: boolean };

const STEPS: Slide[] = [
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

// The finale slides in last, like the rest.
const SLIDES: Slide[] = [...STEPS, { img: "/assets/welcome.png", finale: true }];
const LAST = SLIDES.length - 1;

export default function InstallationSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [range, setRange] = useState({ start: 0, end: 0, travel: 0 });
  const [vh, setVh] = useState(800);
  const [active, setActive] = useState(0);
  // Mobile swipe hint: shown on step 1 until the cards are first moved.
  // In-memory only, so it naturally reappears on a fresh page load.
  const [swiped, setSwiped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // Move from "first card centred" to "last card centred" — so every step,
  // including the welcome finale, lands dead-centre regardless of its width.
  const x = useTransform(scrollYProgress, [0, 1], [range.start, range.end]);

  // Layout centre of each card (unaffected by the translate/scale transforms).
  const centers = useRef<number[]>([]);

  // The focused step is whichever card is actually nearest the screen centre.
  const computeActive = (val: number) => {
    const cs = centers.current;
    if (!cs.length) return;
    const target = window.innerWidth / 2 - val;
    let best = 0;
    let bd = Infinity;
    cs.forEach((c, i) => {
      const d = Math.abs(c - target);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setActive(best);
  };
  useMotionValueEvent(x, "change", computeActive);

  // Dismiss the swipe hint once the user scrolls the cards along. Guarded on a
  // measured section (travel > 0), since before layout the scroll range is
  // degenerate and progress reads ~1.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!swiped && range.travel > 0 && p > 0.015) setSwiped(true);
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setVh(window.innerHeight);
      const cs = Array.from(track.children).map((c) => {
        const el = c as HTMLElement;
        return el.offsetLeft + el.offsetWidth / 2;
      });
      centers.current = cs;
      const half = window.innerWidth / 2;
      const start = half - cs[0];
      const end = half - cs[cs.length - 1];
      setRange({ start, end, travel: Math.max(0, start - end) });
      computeActive(x.get());
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
      style={{ height: `${vh + range.travel}px` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Heading — disappears once the welcome finale is reached */}
        <div
          className="mx-auto w-full max-w-6xl px-6 pt-24 transition-opacity duration-500 md:pt-28"
          style={{ opacity: active === LAST ? 0 : 1 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE.smooth }}
            className="font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-none text-ink"
          >
            Installation
          </motion.h2>
          <p
            className="mt-3 text-ink/50 transition-opacity duration-500"
            style={{ opacity: active === 0 ? 1 : 0 }}
          >
            Up and running in about a minute.
          </p>
        </div>

        {/* Horizontal filmstrip (slides with scroll) */}
        <div className="flex flex-1 items-center overflow-hidden pb-8">
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-[30vw] px-[8vw] md:gap-[22vw] md:px-[10vw]"
          >
            {SLIDES.map((s, i) => {
              const on = i === active;
              if (s.finale) {
                return (
                  <li key={i} className="shrink-0">
                    <motion.div
                      animate={{ scale: on ? 1 : 0.78 }}
                      transition={{ duration: 0.5, ease: EASE.smooth }}
                      className="flex origin-center items-center justify-center"
                    >
                      <img
                        src={s.img}
                        alt="That’s it. Welcome to GlassButterfly."
                        draggable={false}
                        className="block h-auto w-auto max-h-[74vh] max-w-[98vw] md:max-h-[88vh] md:max-w-[94vw]"
                      />
                    </motion.div>
                  </li>
                );
              }
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

                    {/* Mobile-only swipe hint on the first step */}
                    {i === 0 && !swiped && (
                      <div
                        aria-hidden="true"
                        className="mt-4 flex select-none items-center justify-center gap-2.5 font-sans text-[11px] uppercase tracking-[0.28em] text-ink/55 md:hidden"
                      >
                        <motion.span
                          animate={{ x: [0, -4, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          ←
                        </motion.span>
                        <span>Swipe</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          →
                        </motion.span>
                      </div>
                    )}

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
