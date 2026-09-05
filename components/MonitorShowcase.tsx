"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import WallpaperCarousel from "./WallpaperCarousel";
import { EASE } from "@/lib/motion";

// The monitor is authored at one fixed desktop width and then uniformly scaled
// to fit narrower screens, so every proportion (bezel, glass card, clock, date,
// butterfly, wallpaper crop) is identical to desktop — just smaller.
const DESIGN_W = 880;

/**
 * A premium desktop monitor sitting centre-stage. Soft reflection, glass edge,
 * grounded shadow and premium lighting. The screen hosts the wallpaper carousel.
 */
export default function MonitorShowcase() {
  const [screenOff, setScreenOff] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const measure = () => {
      const wrapW = wrapRef.current?.clientWidth ?? DESIGN_W;
      const scale = Math.min(1, wrapW / DESIGN_W);
      const natural = innerRef.current?.offsetHeight ?? 0;
      setFit({ scale, height: natural * scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-28">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE.smooth }}
        className="mb-14 max-w-xl text-center font-display text-3xl leading-tight text-ink/80 md:text-4xl"
      >
        Your desktop, alive.
      </motion.p>

      <motion.div
        ref={wrapRef}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: EASE.expo }}
        className="relative mx-auto w-full max-w-[880px]"
      >
        {/* Height-reserving box that clips the un-scaled overflow */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: fit.height || undefined }}
        >
          {/* Fixed desktop-width monitor, scaled to fit */}
          <div
            ref={innerRef}
            style={{
              width: DESIGN_W,
              transform: `scale(${fit.scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Monitor body (sits in front of the stand) */}
            <div
              className="relative z-10 rounded-[22px] p-[14px]"
              style={{
                background:
                  "linear-gradient(180deg, #f4f4f5 0%, #e6e6e9 55%, #cfcfd4 100%)",
                boxShadow:
                  "0 2px 2px rgba(255,255,255,0.9) inset, 0 -1px 2px rgba(0,0,0,0.15) inset, 0 40px 80px -30px rgba(0,0,0,0.45)",
              }}
            >
              {/* Screen bezel */}
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-black p-[10px]"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4) inset",
                }}
              >
                <WallpaperCarousel />
                {/* Glass reflection across the whole panel */}
                <div
                  className="pointer-events-none absolute inset-0 z-[15] rounded-[8px]"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 30%)",
                  }}
                />
                {/* Screen off — blacks out the panel when the power dot is clicked */}
                <div
                  className="pointer-events-none absolute inset-0 z-[30] bg-black transition-opacity duration-500"
                  style={{ opacity: screenOff ? 1 : 0 }}
                  aria-hidden="true"
                />
              </div>

              {/* Power dot on the bezel — glows white; click to turn the screen off/on */}
              <button
                type="button"
                onClick={() => setScreenOff((v) => !v)}
                aria-label={screenOff ? "Turn screen on" : "Turn screen off"}
                className={`gb-power-dot mx-auto mt-[7px] block h-[7px] w-[7px] rounded-full ${
                  screenOff ? "gb-power-dot--off" : ""
                }`}
              />
            </div>

            {/* Stand (tucked behind the screen) */}
            <div className="relative z-0 mx-auto -mt-3 flex flex-col items-center">
              <div
                className="h-16 w-24"
                style={{
                  background:
                    "linear-gradient(180deg, #dcdce0 0%, #c3c3c9 100%)",
                  clipPath: "polygon(30% 0, 70% 0, 82% 100%, 18% 100%)",
                }}
              />
              <div
                className="h-2.5 w-52 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #d0d0d5 0%, #b4b4ba 100%)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                }}
              />
            </div>

            {/* Grounded soft shadow */}
            <div
              className="mx-auto mt-6 h-10 w-[70%] rounded-[50%] blur-2xl"
              style={{ background: "rgba(0,0,0,0.18)" }}
            />
          </div>
        </div>
      </motion.div>

      <p className="mt-10 text-center text-sm text-ink/50">
        Use the arrows to preview screensaver
      </p>
    </section>
  );
}
