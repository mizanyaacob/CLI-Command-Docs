import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/** Central place every animated component reads reduced-motion preference from. */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

export const panelVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function motionTransition(reduced: boolean, duration = 0.22) {
  return reduced ? { duration: 0 } : { duration, ease: [0.16, 1, 0.3, 1] as const };
}
