import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { motionTransition, useReducedMotion } from "../../lib/motion";

export function Collapsible({ open, children }: { open: boolean; children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={motionTransition(reduced)}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
