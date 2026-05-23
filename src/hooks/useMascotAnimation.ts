import type { Variants } from "framer-motion";

/** Fade + slide-up for full page entry/exit */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

/** Spring pop-in for mascot entrance */
export const mascotEnterVariants: Variants = {
  initial: { opacity: 0, y: 32, scale: 0.92 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.34, 1.56, 0.64, 1],
      delay: 0.15,
    },
  },
};

/** Speech bubble pop-in */
export const bubbleVariants: Variants = {
  initial: { opacity: 0, scale: 0.7, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.6 },
  },
};


