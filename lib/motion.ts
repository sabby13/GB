import type { Variants } from "framer-motion";

/** Shared cinematic easings — never linear. */
export const EASE = {
  smooth: [0.16, 1, 0.3, 1] as const,
  expo: [0.19, 1, 0.22, 1] as const,
  soft: [0.25, 0.1, 0.25, 1] as const,
};

/** Fade + gentle rise, used across sections. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE.smooth },
  },
};

/** Container that staggers its children into view. */
export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Per-word reveal for the download quote. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE.smooth },
  },
};

/** Feature pill float-in with a slight scale settle. */
export const pillIn: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: EASE.expo },
  },
};

/** Glass callout pop. */
export const calloutIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.5, ease: EASE.soft },
  },
};
