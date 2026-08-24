"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Lazily registers ScrollTrigger on the client and returns the gsap handles.
 * GSAP is used only where a value must be interpolated against scroll
 * (e.g. the installation progress line); everything else uses Framer Motion.
 */
export function getGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
